import { describe, it, expect } from "vitest";
import { scoreCategories, collectTitles } from "./categoryScore";

const tree = [
  {
    title: 'root',
    children: [
      {
        title: 'Bookmarks Bar',
        children: [
          { title: 'Best ramen recipe' },
          { title: 'Coursera machine learning course' },
          { title: 'arXiv: attention is all you need' },
          { title: 'GitHub' },
        ],
      },
    ],
  },
];

describe("collectTitles", () => {
  it("flattens nested titles and lowercases them", () => {
    const titles = collectTitles(tree);
    expect(titles).toContain('best ramen recipe');
    expect(titles).toContain('arxiv: attention is all you need');
    expect(titles.length).toBe(6); // 'root', 'Bookmarks Bar' + 4 leaves
  });
});

describe("scoreCategories", () => {
  it("scores the strongest category at 100 and unrelated ones at 0", () => {
    const s = scoreCategories(tree);
    // education matched by 'course'/'coursera'/'arxiv' (2 titles) — the strongest
    expect(s.education).toBe(100);
    // food matched by 'recipe' (1 title) — half of education
    expect(s.food).toBe(50);
    // no money/travel/intimacy signals
    expect(s.money).toBe(0);
    expect(s.travel).toBe(0);
    expect(s.sex).toBe(0);
  });

  it("returns all zeros when nothing matches", () => {
    const s = scoreCategories([{ title: 'zzz', children: [{ title: 'qqq' }] }]);
    expect(Object.values(s).every((v) => v === 0)).toBe(true);
  });

  it("is deterministic — same input yields identical scores", () => {
    expect(scoreCategories(tree)).toEqual(scoreCategories(tree));
  });

  it("clamps every value into 0–100", () => {
    const s = scoreCategories(tree);
    for (const v of Object.values(s)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
  });
});
