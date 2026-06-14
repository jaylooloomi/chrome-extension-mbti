# Chrome Web Store — Listing Copy

> Paste into the Chrome Web Store Developer Dashboard. Two languages provided. See **Submission notes** at the bottom before publishing.

---

## English

**Name**
```
MBTI Hidden Self
```

**Short description / Summary** (≤ 132 chars)
```
A hidden personality test — your bookmarks reveal your MBTI type. Private on-device AI or a free key. No account, no tracking.
```

**Detailed description**
```
🧠 The personality test you don't take — your bookmarks already know.

Most personality tests make you answer questions. MBTI Hidden Self does the opposite: it reads the titles in your bookmark tree and reveals your hidden self — a 4-letter MBTI type, core traits, a short "who you are / who fits you" analysis, and a radar of what you actually gravitate toward across life dimensions (food, style, home, travel, learning, leisure, money, and more).

If you love the MBTI test, 16 Personalities, or the viral SBTI quiz — this is the no-questions, behavior-based version.

🔒 Private by design — you choose the AI
• Chrome Built-in AI (Gemini Nano) — runs on your own device. No key, and nothing leaves your computer.
• A free API key (OpenRouter / Google Gemini / Groq) — paste it once, no install.
• Your own local Ollama server.

No servers of ours, no sign-up, no tracking. Only bookmark titles (never URLs) are sent — and only to the provider you pick. With Chrome Built-in AI or Ollama, the analysis never leaves your machine.

✨ Features
• A shareable persona card with an animated interest radar — made for screenshots
• Interest scores computed directly from your real bookmarks — reproducible, not guesswork
• English / 繁體中文, one-tap switch
• Copy your result as an image to share with friends

Lightweight, free, and just for fun.

Not affiliated with, or endorsed by, The Myers-Briggs Company. For entertainment only — not a psychological assessment.
```

**Category:** Fun
**Language:** English, Chinese (Traditional)

---

## 繁體中文

**名稱**
```
MBTI 隱藏人格
```

**簡短說明**（≤ 132 字元）
```
不用作答的人格測驗 — 你的書籤揭露隱藏的 MBTI。裝置端 AI 或免費金鑰，免註冊、零追蹤。
```

**詳細說明**
```
🧠 你不用作答的人格測驗 —— 你的書籤早就懂你。

大多數人格測驗要你回答一堆題目，MBTI 隱藏人格反過來：它讀取你書籤樹裡的「標題」，揭露你沒意識到的自己 —— 4 碼 MBTI 類型、核心特質、「你是怎樣的人 / 誰適合你」的簡短分析，以及一張橫跨食、衣、住、行、育、樂、錢…的興趣雷達圖。

喜歡 MBTI 測驗、16型人格、或最近爆紅的 SBTI —— 這是「免作答、看行為」的版本。

🔒 隱私優先 — AI 由你選
• Chrome 裝置端 AI（Gemini Nano）：在你自己的裝置上跑，免金鑰，資料完全不離開電腦。
• 免費 API 金鑰（OpenRouter / Google Gemini / Groq）：貼一次即可，免安裝。
• 你自己的本機 Ollama。

我們沒有伺服器、不需註冊、零追蹤。只傳送書籤「標題」（絕不傳網址），且只傳到你選的供應商；選 Chrome 裝置端 AI 或 Ollama 時，分析全程不離開你的電腦。

✨ 特色
• 可分享的人格卡片＋動態興趣雷達圖，專為截圖設計
• 興趣分數直接由你的真實書籤計算 —— 可重現，不是亂猜
• 中文 / English 一鍵切換
• 一鍵把結果複製成圖片分享

輕量、免費、純娛樂。

與 The Myers-Briggs Company 無任何關聯或背書。僅供娛樂，非心理測驗。
```

**類別：** 娛樂
**語言：** 繁體中文、英文

---

## Store metadata helpers

**SEO keyword targets** (work these naturally into the description — already done above): `MBTI`, `MBTI test`, `personality test`, `16 personalities`, `SBTI`, `hidden / true self`, `from your bookmarks`, `繁中：MBTI測驗、16型人格、隱藏人格`.

**Permission justifications** (required on submission)
- `bookmarks`: "Reads the user's bookmark folder and page titles to infer interests. Titles are sent only to the AI provider the user explicitly selects, or processed fully on-device."
- Host permissions (`localhost`, `openrouter.ai`, `generativelanguage.googleapis.com`, `api.groq.com`): "Used to send the analysis request to the AI provider the user selects."
- **Remote code:** No. **Data collection:** None collected/stored by the developer.

**Privacy practices / data usage**
- Bookmark **titles** are transmitted to the user-chosen AI provider solely to perform the analysis, and are not stored by the developer. A privacy policy URL is required by the store.

**Suggested screenshots** (1280×800 or 640×400): the input screen and the result radar (see `/screenshots`).

---

## ⚠️ Submission notes (read before publishing)

1. **"MBTI" trademark** — "MBTI" / "Myers-Briggs" are trademarks of The Myers-Briggs Company. Keeping "MBTI" in the name boosts discoverability but carries some risk; the disclaimer line in the description ("Not affiliated with…") is the common mitigation. Proceed at your discretion.
2. **Adult / intimacy categories** — the analysis includes "intimacy" and "adult" dimensions. Chrome Web Store maturity/content policies could trigger review or a rating. Consider gating or removing these before public submission (easy to drop from `categoryScore.ts`, the prompt, and `ResultCard.tsx`).
3. **Privacy policy URL** is mandatory because the extension transmits user data (bookmark titles) to third-party APIs.
