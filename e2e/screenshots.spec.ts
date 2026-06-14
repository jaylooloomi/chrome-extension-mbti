import { test, Page } from '@playwright/test';

// Captures real rendered screenshots of the popup (420px wide, like the extension).
test.use({ viewport: { width: 420, height: 940 } });

const mockResult = {
  mbti: 'INTJ',
  title: 'The 3 A.M. Rabbit-Holer',
  description:
    'Your bookmarks read like a blueprint: dense clusters of long-form essays, systems-design references, and a handful of carefully chosen tools you will absolutely "read later".',
  traits: ['chronically curious', 'tab hoarder', 'deep-diver'],
  food: ['ramen', 'pour-over coffee', 'meal-prep', 'sourdough', 'sushi', 'matcha'],
  clothing: ['minimal', 'monochrome', 'merino', 'techwear', 'matte black'],
  housing: ['studio', 'standing desk', 'plants', 'bookshelf', 'warm light'],
  travel: ['Japan', 'slow travel', 'trains', 'museums', 'hiking'],
  education: ['MOOCs', 'papers', 'documentation', 'first principles'],
  entertainment: ['sci-fi', 'strategy games', 'podcasts', 'chess'],
  money: ['index funds', 'frugal', 'automation', 'long-term'],
  sex: ['emotional depth', 'trust', 'communication', 'loyalty'],
  pornstar: ['—'],
  foodpercent: '62', clothingpercent: '48', housingpercent: '71', travelpercent: '55',
  educationpercent: '88', entertainmentpercent: '67', moneypercent: '74', sexpercent: '41', pornstarpercent: '12',
  yourself: 'A long-game thinker who values competence and autonomy. You build the right thing slowly.',
  couple: 'Someone who respects your need for depth and space, and communicates directly.',
};

// Diverse titles so the deterministic, bookmark-derived radar shows a real shape.
const bookmarkTree = [
  {
    title: 'root',
    children: [
      {
        title: 'Bookmarks Bar',
        children: [
          { title: 'arXiv: attention is all you need' },
          { title: 'Coursera machine learning course' },
          { title: 'MDN web docs' },
          { title: 'Best tonkotsu ramen recipe' },
          { title: 'Pour-over coffee guide' },
          { title: 'ETF investing for beginners' },
          { title: 'Crypto wallet security' },
          { title: 'Cheap flights to Japan' },
          { title: 'Kyoto hotel booking' },
          { title: 'Netflix top sci-fi movies' },
          { title: 'Spotify focus playlist' },
          { title: 'Minimalist fashion outfit ideas' },
          { title: 'IKEA small apartment furniture' },
        ],
      },
    ],
  },
];

async function mocks(page: Page) {
  await page.addInitScript((tree) => {
    (window as any).chrome = { bookmarks: { getTree: (cb: any) => cb(tree) }, runtime: {} };
  }, bookmarkTree);
  await page.route('**/chat/completions', (route) =>
    route.fulfill({ contentType: 'application/json', body: JSON.stringify({ choices: [{ message: { content: JSON.stringify(mockResult) } }] }) }),
  );
}

test('capture input screen', async ({ page }) => {
  await mocks(page);
  await page.goto('/');
  await page.locator('select').selectOption('gemini');
  await page.locator('input[type=password]').fill('AIzaSyXXXXXXXXXXXXXXXX');
  await page.waitForTimeout(700); // let entrance animations settle + fonts load
  await page.screenshot({ path: 'screenshots/input.png' });
});

test('capture result screen', async ({ page }) => {
  await mocks(page);
  await page.goto('/');
  await page.locator('select').selectOption('gemini');
  await page.locator('input[type=password]').fill('AIzaSyXXXXXXXXXXXXXXXX');
  await page.getByRole('button', { name: '開始分析' }).click();
  await page.locator('h2').waitFor();
  await page.waitForTimeout(900); // let bars animate in
  await page.screenshot({ path: 'screenshots/result.png', fullPage: true });
});
