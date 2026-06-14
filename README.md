<div align="center">

# 🧠 MBTI Hidden Self

**The personality test you don't take — your bookmarks reveal your hidden MBTI.**

Pick a provider · click once · get an MBTI persona from your browsing footprint. Use Chrome's **built-in on-device AI** (no key), a **free cloud key** (OpenRouter / Gemini / Groq), or your own **local Ollama**.

![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Edge-4c8bf5)
![Manifest](https://img.shields.io/badge/manifest-v3-9457eb)
![Built with](https://img.shields.io/badge/built%20with-Vite%20%2B%20React%20%2B%20TS-646cff)
![AI](https://img.shields.io/badge/AI-Chrome%20Built--in%20%C2%B7%20OpenRouter%20%C2%B7%20Gemini%20%C2%B7%20Groq%20%C2%B7%20Ollama-000000)
![License](https://img.shields.io/badge/license-MIT-22c55e)

🌐 **English** · [繁體中文](#繁體中文)

</div>

---

### The problem

Most "AI personality" tools want two things you shouldn't have to give them: an **API key** and your **data on someone else's server**. Your bookmarks are one of the most revealing trails you own — where you read, shop, learn, and unwind. Handing that to a cloud model just to get a fun persona card is a bad trade.

### The solution

This extension reads your bookmark **tree** locally and sends it to **an AI backend you choose**, then renders a persona card — MBTI type, traits, and a breakdown of what you gravitate toward. You decide the trade-off between convenience, quality, and privacy:

- **Chrome Built-in AI** (Gemini Nano) — on-device, no key, nothing leaves your machine.
- **Free cloud key** (OpenRouter / Gemini / Groq) — paste one free key, best quality, no install.
- **Ollama** — your own local models, fully private and unlimited.
- **Custom** — any OpenAI-compatible endpoint.

### Key features

- 🔌 **One client, many providers** — everything runs through a single OpenAI-compatible path, plus a Chrome on-device branch.
- 🔒 **Private when you want it** — Chrome Built-in AI and Ollama keep bookmarks on your device.
- 🗝️ **Free options** — no key at all (Chrome/Ollama), or a free key from OpenRouter / Gemini / Groq.
- 🧠 **Auto-detect** — Chrome Built-in AI is detected at startup; if your device can't run it, the app falls back automatically.
- 🎨 **Refined UI** — a calm dark "aurora glass" theme with animated trait breakdowns.
- 🌏 **Bilingual** — English / 繁體中文, switchable in one tap.
- 🖼️ **Shareable** — copy your persona card to the clipboard as an image.
- 💾 **Remembers your setup** — provider, key, URL, and model are saved locally per provider.

### Providers at a glance

| Provider | Key? | Install? | Private? | Notes |
|---|---|---|---|---|
| **Chrome Built-in AI** | No | No (model auto-downloads) | ✅ on-device | Needs Chrome 138+, ~22 GB free disk, >4 GB VRAM (or 16 GB RAM). Small model — lighter analysis. |
| **OpenRouter** | Free key | No | ☁️ cloud | 28+ free models (`:free`). ~50 req/day free. |
| **Google Gemini** | Free key | No | ☁️ cloud | `gemini-2.5-flash`, 1,500 req/day. Best quality/ease balance. |
| **Groq** | Free key | No | ☁️ cloud | Very fast. ~1,000 req/day free. |
| **Ollama** | No | Yes | ✅ on-device | Unlimited, fully local. |
| **Custom** | Optional | — | depends | Any OpenAI-compatible base URL. |

### How it works

```
┌──────────────┐   read tree    ┌──────────────────┐                       ┌─────────────────────────┐
│  Your Chrome │ ─────────────► │  Extension popup  │ ── on-device ───────► │  Chrome Built-in AI     │
│  bookmarks   │ chrome.bookmarks│  (React + Vite)  │                       │  (Gemini Nano)          │
└──────────────┘                └──────────────────┘ ── /chat/completions ►│  OpenRouter/Gemini/     │
                                          │            (OpenAI-compatible)   │  Groq/Ollama/Custom     │
                                          ▼                                  └─────────────────────────┘
                                🧠 Persona card + interest radar
```

Only the bookmark **titles and folder structure** are sent — never the URLs themselves.

### Install

```bash
npm install
npm run build      # outputs to dist/
```

Then in Chrome: open `chrome://extensions` → enable **Developer mode** → **Load unpacked** → select the `dist/` folder.

**Per-provider setup**

- **Chrome Built-in AI** — nothing to do; the app detects availability. On first run the ~4 GB model downloads once. (Requires a capable desktop Chrome — see the table above.)
- **OpenRouter / Gemini / Groq** — get a free key ([OpenRouter](https://openrouter.ai/keys) · [Gemini](https://aistudio.google.com/apikey) · [Groq](https://console.groq.com/keys)) and paste it in.
- **Ollama** — install [Ollama](https://ollama.com/download), `ollama pull llama3.2`, and keep the default URL `http://localhost:11434/v1`.

> **CORS note:** the packed extension declares `host_permissions` for the providers above, so requests work out of the box. If you point **Ollama** at the *dev server* (not the extension), start it with `OLLAMA_ORIGINS="*" ollama serve`. A **Custom** host you add yourself may need its domain added to `host_permissions` in `public/manifest.json`.

### Usage

1. Click the extension icon to open the popup.
2. Choose an **AI Provider** from the dropdown.
3. Fill in what that provider needs (a key, a URL, and/or a model) — or nothing for Chrome Built-in AI.
4. Hit **Start Analysis**. The extension reads your bookmark tree, runs the analysis, and renders your persona.
5. Use **Show / Hide details** to expand the trait breakdown, and the **share** button to copy the card as an image.

### Settings

| Setting | Notes |
|---|---|
| Provider | Chrome Built-in AI · OpenRouter · Gemini · Groq · Ollama · Custom. Saved locally. |
| API Key | For key-based providers. Stored in `localStorage`, per provider, never shared. |
| API URL | For Ollama / Custom (OpenAI-compatible base URL ending in `/v1`). |
| Model | Editable; sensible defaults per provider. |
| Language | Toggle EN / 中文 in the header. |

### Privacy & security

- Bookmarks are sent **only** to the provider you choose. With **Chrome Built-in AI** or **Ollama**, nothing leaves your device.
- No accounts, no telemetry. Keys live in `localStorage`; results live in memory and vanish when the popup closes.
- Permissions: `bookmarks` (read your tree) and `host_permissions` for localhost + the cloud provider domains.
- Note: cloud free tiers may use submitted prompts to improve their models — prefer Chrome Built-in AI or Ollama if your bookmark titles are sensitive.

### Development

```
src/
├─ app/
│  ├─ App.tsx                 # popup shell, provider selector, state
│  ├─ components/
│  │  ├─ ResultCard.tsx       # persona card
│  │  ├─ PersonaRadar.tsx     # SVG persona radar chart
│  │  ├─ CyberButton.tsx
│  │  ├─ LoadingBar.tsx
│  │  └─ FloatingNav.tsx
│  ├─ utils/
│  │  ├─ providers.ts         # provider presets + OpenAI-compatible & Chrome AI clients
│  │  ├─ categoryScore.ts     # deterministic interest scores from bookmarks
│  │  ├─ bookmarks.ts
│  │  └─ *.test.ts            # vitest unit tests
│  ├─ data/characters.ts      # MBTI character profiles
│  └─ i18n.ts                 # EN / 繁中 strings
├─ e2e/                       # Playwright tests
├─ styles/                    # Tailwind v4 + theme
public/manifest.json          # Manifest V3
```

```bash
npm run dev        # vite dev server (append ?demo to preview a sample result card)
npm run build      # production build → dist/
npm run test:run   # vitest (single run)
```

### Known limitations

- `chrome.bookmarks` only exists inside the extension, so the **dev server can render the UI but can't run a real analysis** (use `?demo` to preview the result card).
- **Chrome Built-in AI** isn't available on every device/Chrome version, and Gemini Nano is a small model — analysis is lighter than a cloud model. The app detects this and lets you switch.
- Cloud free tiers have **daily rate limits**; if you hit one, switch providers or wait.
- Persona output is a playful inference from bookmark titles, not a clinical assessment.

---

## 繁體中文

# 🧠 MBTI 隱藏人格

**你不用作答的人格測驗 —— 你的書籤揭露隱藏的你。**

選一個 AI 供應商 · 點一下 · 從你的瀏覽足跡得出一張人格側寫。可用 Chrome **裝置端 AI**（免金鑰）、**免費雲端金鑰**（OpenRouter / Gemini / Groq）、或你自己的 **本機 Ollama**。

### 它在做什麼

擴充功能在本機讀取你書籤樹的「標題」，送到**你選擇的 AI**，產生人格卡片 —— MBTI 類型、特質、「你是怎樣的人 / 誰適合你」，以及一張依實際書籤分類計算的興趣雷達圖。便利、品質、隱私之間由你權衡：

- **Chrome 裝置端 AI（Gemini Nano）** — 在你的裝置上跑，免金鑰，資料不離開電腦。
- **免費雲端金鑰（OpenRouter / Gemini / Groq）** — 貼一把免費金鑰，品質最佳，免安裝。
- **Ollama** — 你自己的本機模型，完全隱私、無限次。
- **自訂** — 任何 OpenAI 相容端點。

### 安裝

```bash
npm install
npm run build      # 輸出到 dist/
```

Chrome → 開啟 `chrome://extensions` → 開「開發人員模式」→「載入未封裝項目」→ 選 `dist/` 資料夾。

### 使用

1. 點擊擴充功能圖示開啟視窗。
2. 從下拉選單選擇 **AI 供應商**。
3. 填入該供應商所需的（金鑰／網址／模型）—— 選 Chrome 裝置端 AI 則什麼都不用填。
4. 按 **開始分析**，即會讀取書籤並產生你的人格。
5. 用「顯示／隱藏關鍵字」展開細節，按分享鈕把卡片複製成圖片。

### 隱私

- 書籤**只**會傳給你選的供應商；選 Chrome 裝置端 AI 或 Ollama 時資料完全不離開電腦。
- 無帳號、零追蹤。金鑰存在 `localStorage`，結果只存在記憶體、關閉視窗即消失。
- 只傳送書籤「標題」，**絕不**傳網址。

> 僅供娛樂，非心理測驗；與 The Myers-Briggs Company 無任何關聯。

---

### License

MIT © Arthur Wang
