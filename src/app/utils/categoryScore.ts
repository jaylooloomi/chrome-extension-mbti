// Deterministic category scoring from the user's bookmark titles.
// Replaces the model's invented "density %" with a reproducible value derived
// from how many bookmark titles match each life-domain lexicon.

export type CategoryKey =
  | 'food' | 'clothing' | 'housing' | 'travel' | 'education'
  | 'entertainment' | 'money' | 'sex' | 'pornstar';

// Keep terms distinctive to avoid false positives (e.g. avoid "av", "tax",
// "rent", "tour" which match unrelated words). Mixes EN + 繁中. All matched
// case-insensitively as substrings against lowercased titles.
export const CATEGORY_LEXICON: Record<CategoryKey, string[]> = {
  food: ['food', 'recipe', 'restaurant', 'cook', 'meal', 'cuisine', 'coffee', 'cafe', 'baking', 'noodle', 'ramen', 'sushi', 'dessert',
    '美食', '食譜', '餐廳', '料理', '咖啡', '烘焙', '甜點', '小吃', '菜單'],
  clothing: ['fashion', 'clothing', 'outfit', 'sneaker', 'shoes', 'apparel', 'cosmetic', 'makeup', 'skincare', 'jacket', 'handbag',
    '時尚', '穿搭', '服飾', '美妝', '彩妝', '保養', '精品'],
  housing: ['furniture', 'interior', 'apartment', 'mortgage', 'ikea', 'renovation', 'decor', 'real estate',
    '居家', '家具', '室內', '裝潢', '租屋', '房地產', '家居', '收納'],
  travel: ['travel', 'flight', 'hotel', 'airbnb', 'airline', 'railway', 'itinerary', 'backpack', 'visa',
    '旅遊', '旅行', '機票', '飯店', '航班', '景點', '住宿', '行程', '高鐵', '自由行'],
  education: ['course', 'learn', 'study', 'tutorial', 'university', 'college', 'documentation', 'docs', 'mooc', 'lecture',
    'arxiv', 'wikipedia', 'coursera', 'udemy', 'textbook', 'scholar', 'school',
    '教育', '學習', '課程', '教學', '大學', '知識', '研究', '論文', '學校', '補習'],
  entertainment: ['game', 'gaming', 'movie', 'film', 'music', 'video', 'youtube', 'netflix', 'twitch', 'spotify', 'steam',
    'anime', 'manga', 'comic', 'podcast', 'disney',
    '遊戲', '電影', '音樂', '影片', '娛樂', '動畫', '漫畫', '追劇', '直播', '小說'],
  money: ['money', 'finance', 'invest', 'stock', 'bank', 'crypto', 'bitcoin', 'budget', 'insurance', 'etf', 'trading', 'salary', 'wallet', 'nasdaq',
    '理財', '投資', '股票', '銀行', '金融', '加密', '記帳', '保險', '報稅', '基金', '薪水', '存錢'],
  sex: ['relationship', 'dating', 'couple', 'romance', 'tinder', 'girlfriend', 'boyfriend', 'marriage',
    '戀愛', '約會', '感情', '伴侶', '兩性', '婚姻', '曖昧', '交友'],
  pornstar: ['porn', 'xxx', 'adult', 'nsfw', 'hentai', 'escort', 'onlyfans',
    '色情', '情色', '成人', '18禁', 'a片'],
};

const CATEGORY_KEYS = Object.keys(CATEGORY_LEXICON) as CategoryKey[];

/** Recursively collect all non-empty bookmark titles (lowercased). */
export function collectTitles(node: unknown, out: string[] = []): string[] {
  if (!node) return out;
  if (Array.isArray(node)) {
    for (const n of node) collectTitles(n, out);
    return out;
  }
  const anyNode = node as { title?: unknown; children?: unknown };
  if (typeof anyNode.title === 'string' && anyNode.title.trim()) {
    out.push(anyNode.title.toLowerCase());
  }
  if (Array.isArray(anyNode.children)) collectTitles(anyNode.children, out);
  return out;
}

/**
 * Score each category 0–100 from the bookmark titles.
 * Counts titles matching each category's lexicon, then normalises to the
 * strongest category (= 100). Fully deterministic for a given bookmark set.
 */
export function scoreCategories(bookmarkStructure: unknown): Record<CategoryKey, number> {
  const titles = collectTitles(bookmarkStructure);

  const counts = {} as Record<CategoryKey, number>;
  for (const cat of CATEGORY_KEYS) {
    const terms = CATEGORY_LEXICON[cat].map((t) => t.toLowerCase());
    counts[cat] = titles.reduce((acc, title) => (terms.some((t) => title.includes(t)) ? acc + 1 : acc), 0);
  }

  const max = Math.max(0, ...CATEGORY_KEYS.map((c) => counts[c]));
  const pct = {} as Record<CategoryKey, number>;
  for (const cat of CATEGORY_KEYS) {
    pct[cat] = max > 0 ? Math.round((counts[cat] / max) * 100) : 0;
  }
  return pct;
}
