import { test, expect, Page } from '@playwright/test';

// A minimal valid result the mocked backend echoes back.
const mockResult = {
  mbti: 'INTJ', title: 'T', description: 'd', traits: ['a', 'b', 'c'],
  food: ['x'], clothing: ['x'], housing: ['x'], travel: ['x'], education: ['x'],
  entertainment: ['x'], money: ['x'], sex: ['x'], pornstar: ['x'],
  foodpercent: '50', clothingpercent: '50', housingpercent: '50', travelpercent: '50',
  educationpercent: '50', entertainmentpercent: '50', moneypercent: '50', sexpercent: '50', pornstarpercent: '50',
  yourself: 'y', couple: 'c',
};

const bookmarkTree = [
  { title: 'root', children: [{ title: 'Bookmarks Bar', children: [{ title: 'GitHub' }, { title: 'arXiv' }] }] },
];

async function stubBookmarks(page: Page) {
  await page.addInitScript((t) => {
    (window as any).chrome = { bookmarks: { getTree: (cb: (n: unknown) => void) => cb(t) }, runtime: {} };
  }, bookmarkTree);
}

test('prompt sent to the AI is deterministic across runs; temperature is low', async ({ page }) => {
  await stubBookmarks(page);

  const requests: any[] = [];
  await page.route('**/chat/completions', async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ choices: [{ message: { content: JSON.stringify(mockResult) } }] }),
    });
  });

  await page.goto('/');
  await page.locator('select').selectOption('gemini');
  await page.locator('input[type=password]').fill('test-key');

  // Run #1
  await page.getByRole('button', { name: '開始分析' }).click();
  await page.locator('h2').waitFor();

  // Run #2 — same inputs
  await page.getByRole('button', { name: '重新分析' }).click();
  await page.getByRole('button', { name: '開始分析' }).click();
  await expect.poll(() => requests.length).toBe(2);

  const p0 = requests[0].messages[0].content as string;
  const p1 = requests[1].messages[0].content as string;

  // The prompt our code sends is byte-identical → any output variance is the model, not us.
  expect(p0).toBe(p1);

  // Prompt is well-formed: instruction, all categories, the actual bookmark titles, and language.
  expect(p0).toContain('Return ONLY a raw JSON object');
  for (const key of ['"food"', '"money"', '"sex"', '"pornstar"', '"yourself"', '"couple"']) {
    expect(p0).toContain(key);
  }
  expect(p0).toContain('GitHub');
  expect(p0).toContain('Traditional Chinese');

  // Low, fixed sampling temperature for consistency.
  expect(requests[0].temperature).toBe(0.3);
  expect(requests[1].temperature).toBe(0.3);
});
