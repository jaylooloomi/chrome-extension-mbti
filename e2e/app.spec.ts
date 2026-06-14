import { test, expect, Page } from '@playwright/test';

// A complete MBTIResult the mocked backends return.
const mockResult = {
  mbti: 'INTJ',
  title: 'The Test Architect',
  description: 'A bookmark trail of systems-design and long-form essays.',
  traits: ['Strategic', 'Curious', 'Collector'],
  food: ['ramen', 'coffee'],
  clothing: ['minimal', 'monochrome'],
  housing: ['studio', 'plants'],
  travel: ['Japan', 'trains'],
  education: ['MOOCs', 'papers'],
  entertainment: ['sci-fi', 'chess'],
  money: ['index funds', 'frugal'],
  sex: ['trust', 'depth'],
  pornstar: ['—'],
  foodpercent: '62',
  clothingpercent: '48',
  housingpercent: '71',
  travelpercent: '55',
  educationpercent: '88',
  entertainmentpercent: '67',
  moneypercent: '74',
  sexpercent: '41',
  pornstarpercent: '12',
  yourself: 'A long-game thinker who values competence and autonomy.',
  couple: 'Someone who respects depth and communicates directly.',
};

const bookmarkTree = [
  {
    title: 'root',
    children: [
      { title: 'Bookmarks Bar', children: [{ title: 'GitHub' }, { title: 'Hacker News' }, { title: 'arXiv' }] },
    ],
  },
];

/** Stub chrome.bookmarks, and optionally Chrome's on-device LanguageModel, before any page script runs. */
async function installMocks(page: Page, opts: { chromeAiJson?: string } = {}) {
  await page.addInitScript(
    ([tree, chromeAiJson]) => {
      (window as any).chrome = {
        bookmarks: { getTree: (cb: (n: unknown) => void) => cb(tree) },
        runtime: {},
      };
      if (chromeAiJson) {
        (window as any).LanguageModel = {
          availability: async () => 'available',
          create: async () => ({
            prompt: async () => chromeAiJson,
            destroy() {},
          }),
        };
      }
    },
    [bookmarkTree, opts.chromeAiJson ?? ''] as const,
  );
}

/** Intercept the OpenAI-compatible chat endpoint. */
async function mockChat(page: Page, body: object, status = 200) {
  await page.route('**/chat/completions', (route) =>
    route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) }),
  );
}

test.describe('MBTI Hidden Self — provider UI', () => {
  test('provider dropdown shows the right fields per provider', async ({ page }) => {
    await page.goto('/');
    const select = page.locator('select');

    // Gemini → API key + model, no base-URL field.
    await select.selectOption('gemini');
    await expect(page.locator('input[type=password]')).toBeVisible();
    await expect(page.getByPlaceholder('gemini-2.5-flash')).toBeVisible();

    // Ollama → base URL + model, no API key field.
    await select.selectOption('ollama');
    await expect(page.locator('input[type=password]')).toHaveCount(0);
    await expect(page.getByPlaceholder('http://localhost:11434/v1')).toBeVisible();
    await expect(page.getByPlaceholder('llama3.2')).toBeVisible();

    // Chrome built-in AI → no credential inputs at all.
    await select.selectOption('chrome-ai');
    await expect(page.locator('input')).toHaveCount(0);
    await expect(page.getByRole('button', { name: '開始分析' })).toBeVisible();
  });

  test('shows a validation error when the API key is missing', async ({ page }) => {
    await page.goto('/');
    await page.locator('select').selectOption('gemini');
    await page.getByRole('button', { name: '開始分析' }).click();
    await expect(page.getByText('請輸入你的 API 金鑰。')).toBeVisible();
  });
});

test.describe('MBTI Hidden Self — end-to-end happy paths', () => {
  test('Gemini (cloud, mocked fetch) renders the full result card', async ({ page }) => {
    await installMocks(page);
    await mockChat(page, { choices: [{ message: { content: JSON.stringify(mockResult) } }] });

    await page.goto('/');
    await page.locator('select').selectOption('gemini');
    await page.locator('input[type=password]').fill('test-key');
    await page.getByRole('button', { name: '開始分析' }).click();

    const title = page.locator('h2');
    await expect(title).toBeVisible();
    await expect(title).toContainText('The Test Architect');
    await expect(title).toContainText('建築師'); // character name prefix (zh)

    // 9 category stat bars + key traits + retest control.
    await expect(page.locator('[data-testid="persona-radar"]')).toBeVisible();
    await expect(page.getByText('Strategic')).toBeVisible();
    await expect(page.getByRole('button', { name: '重新分析' })).toBeVisible();
  });

  test('Chrome built-in AI (mocked LanguageModel) renders the result card', async ({ page }) => {
    await installMocks(page, { chromeAiJson: JSON.stringify(mockResult) });

    await page.goto('/');
    await page.locator('select').selectOption('chrome-ai');
    await page.getByRole('button', { name: '開始分析' }).click();

    await expect(page.locator('h2')).toContainText('The Test Architect');
    await expect(page.locator('[data-testid="persona-radar"]')).toBeVisible();
  });

  test('Chrome AI session is created inside the gesture, before bookmarks resolve', async ({ page }) => {
    // getTree is intentionally delayed; create() must fire first (within the click activation).
    await page.addInitScript(
      ([tree, json]) => {
        (window as any).__order = {};
        (window as any).chrome = {
          bookmarks: {
            getTree: (cb: (n: unknown) => void) => {
              (window as any).__order.getTreeAt = performance.now();
              setTimeout(() => cb(tree), 300);
            },
          },
          runtime: {},
        };
        (window as any).LanguageModel = {
          availability: async () => 'available',
          create: async () => {
            (window as any).__order.createAt = performance.now();
            return { prompt: async () => json, destroy() {} };
          },
        };
      },
      [bookmarkTree, JSON.stringify(mockResult)] as const,
    );

    await page.goto('/');
    await page.locator('select').selectOption('chrome-ai');
    await page.getByRole('button', { name: '開始分析' }).click();
    await expect(page.locator('h2')).toContainText('The Test Architect');

    const order = await page.evaluate(() => (window as any).__order);
    expect(order.createAt).toBeLessThanOrEqual(order.getTreeAt);
  });
});

test.describe('MBTI Hidden Self — error handling', () => {
  test('surfaces a friendly auth error on HTTP 401', async ({ page }) => {
    await installMocks(page);
    await mockChat(page, { error: { message: 'invalid api key' } }, 401);

    await page.goto('/');
    await page.locator('select').selectOption('gemini');
    await page.locator('input[type=password]').fill('bad-key');
    await page.getByRole('button', { name: '開始分析' }).click();

    await expect(page.getByText(/authentication failed|api key/i)).toBeVisible();
  });
});
