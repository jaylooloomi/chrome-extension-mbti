import { logger } from "./logger";
import { scoreCategories } from "./categoryScore";

export interface MBTIResult {
  mbti: string;
  title: string;
  description: string;
  traits: string[];
  food: string[];
  clothing: string[];
  housing: string[];
  travel: string[];
  education: string[];
  entertainment: string[];
  money: string[];
  sex: string[];
  pornstar: string[];
  foodpercent: string;
  clothingpercent: string;
  housingpercent: string;
  travelpercent: string;
  educationpercent: string;
  entertainmentpercent: string;
  moneypercent: string;
  sexpercent: string;
  pornstarpercent: string;
  yourself: string;
  couple: string;
}

export type ProviderId = "chrome-ai" | "openrouter" | "gemini" | "groq" | "ollama" | "custom";

export interface ProviderPreset {
  id: ProviderId;
  name: string;
  /** "chrome" = on-device Prompt API; "openai" = OpenAI-compatible /chat/completions endpoint. */
  kind: "chrome" | "openai";
  baseUrl?: string;
  defaultModel?: string;
  needsKey: boolean;
  /** URL where the user can get a free API key. */
  keyUrl?: string;
  /** Whether the user may edit the base URL (Ollama / custom). */
  editableUrl?: boolean;
  /** True when requests stay on the user's machine (no data leaves the device). */
  privacyLocal: boolean;
}

// Lower temperature → far more consistent results across runs (was 0.7, which
// made the same bookmarks produce noticeably different personas each time).
export const ANALYSIS_TEMPERATURE = 0.3;
const CHROME_TOP_K = 3;

export const PROVIDERS: ProviderPreset[] = [
  { id: "chrome-ai", name: "Chrome Built-in AI", kind: "chrome", needsKey: false, privacyLocal: true },
  {
    id: "openrouter",
    name: "OpenRouter (free)",
    kind: "openai",
    baseUrl: "https://openrouter.ai/api/v1",
    defaultModel: "meta-llama/llama-3.3-70b-instruct:free",
    needsKey: true,
    keyUrl: "https://openrouter.ai/keys",
    privacyLocal: false,
  },
  {
    id: "gemini",
    name: "Google Gemini (free)",
    kind: "openai",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    defaultModel: "gemini-2.5-flash",
    needsKey: true,
    keyUrl: "https://aistudio.google.com/apikey",
    privacyLocal: false,
  },
  {
    id: "groq",
    name: "Groq (free)",
    kind: "openai",
    baseUrl: "https://api.groq.com/openai/v1",
    defaultModel: "llama-3.3-70b-versatile",
    needsKey: true,
    keyUrl: "https://console.groq.com/keys",
    privacyLocal: false,
  },
  {
    id: "ollama",
    name: "Ollama (local)",
    kind: "openai",
    baseUrl: "http://localhost:11434/v1",
    defaultModel: "llama3.2",
    needsKey: false,
    editableUrl: true,
    privacyLocal: true,
  },
  {
    id: "custom",
    name: "Custom (OpenAI-compatible)",
    kind: "openai",
    baseUrl: "",
    defaultModel: "",
    needsKey: false,
    editableUrl: true,
    privacyLocal: false,
  },
];

export function getProvider(id: ProviderId): ProviderPreset {
  return PROVIDERS.find((p) => p.id === id) ?? PROVIDERS[0];
}

export interface AnalyzeConfig {
  providerId: ProviderId;
  /** Effective base URL (preset value, or user value for ollama/custom). */
  baseUrl: string;
  apiKey: string;
  model: string;
}

/**
 * Normalise a user-supplied base URL: prepend http:// when no scheme is present
 * and strip any trailing slashes. Empty input is returned unchanged.
 */
export function normalizeBaseUrl(url: string): string {
  let u = (url ?? "").trim();
  if (!u) return "";
  if (!/^https?:\/\//i.test(u)) u = `http://${u}`;
  return u.replace(/\/+$/, "");
}

/**
 * Best-effort extraction of a JSON object from a model response.
 * Handles markdown code fences and surrounding prose.
 */
export function extractJson<T = any>(text: string): T {
  const cleaned = (text ?? "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) {
      return JSON.parse(cleaned.slice(first, last + 1)) as T;
    }
    throw new Error("Model did not return valid JSON.");
  }
}

/**
 * Validate a provider config before running. Returns an i18n error key, or null when valid.
 */
export function validateConfig(cfg: AnalyzeConfig): string | null {
  const preset = getProvider(cfg.providerId);
  if (preset.kind === "chrome") return null;
  if (preset.needsKey && !cfg.apiKey.trim()) return "enterKeyError";
  if (preset.editableUrl && !cfg.baseUrl.trim()) return "enterUrlError";
  if (!cfg.model.trim()) return "enterModelError";
  return null;
}

export const buildPrompt = (bookmarkStructure: unknown, langPrompt: string, maxChars?: number) => {
  let structure = JSON.stringify(bookmarkStructure);
  if (maxChars && structure.length > maxChars) {
    structure = structure.slice(0, maxChars) + ' …(truncated)';
  }
  return `
You are a psychological expert specializing in digital footprints.
Analyze the following browser bookmark directory structure and website names and determine the user's likely MBTI personality type.

Bookmark StructureName And WebsiteName:
${structure}

Please analyze the document and extract the following keywords from the "title".
Return ONLY a raw JSON object (no markdown formatting, no code blocks) with the following keys:
- "mbti": The 4-letter MBTI code (e.g., INTJ, ENFP).
- "title": A short, punchy, screenshot-worthy persona label — witty, relatable and a little playful, like a viral personality-test label (NOT a formal or LinkedIn-style title). 2-5 words, specific to their bookmarks, and fun to share. Keep it good-natured, never mean. (Language for: ${langPrompt})
- "description": A short, engaging and slightly playful read on why their bookmarks point to this type — relatable and shareable. (Language for: ${langPrompt})
- "traits": An array of 3 short, punchy, relatable keywords describing their digital habits. (Language for: ${langPrompt})
- "food": (Extract the 7 most relevant keywords related to food preferences; only keywords.)
- "clothing": (Extract the 7 most relevant keywords related to fashion sense; only keywords.)
- "housing": (Extract the 7 most relevant keywords related to living conditions; only keywords.)
- "travel": (Extract the 7 most relevant keywords related to travel preferences; only keywords.)
- "education": (Extract the 7 most relevant keywords related to educational values; only keywords.)
- "entertainment": (Extract the 7 most relevant keywords related to entertainment values; only keywords.)
- "money": (Extract the 7 most relevant keywords related to money values; only keywords.)
- "sex": (Extract the 7 most relevant keywords related to relationship and intimacy preferences; only keywords.)
- "pornstar": (Extract the 7 most relevant keywords related to adult-entertainment interests; only keywords.)
- "yourself": Analyze what kind of person you are? (1-3 sentences) (Language for: ${langPrompt})
- "couple": Analyze what qualities make a good partner for you? (1-3 sentences, about emotional connection and compatibility) (Language for: ${langPrompt})
Language for response: ${langPrompt}
`;
};

/* ----------------------------- Chrome built-in AI ----------------------------- */

type ChromeAvailability = "available" | "downloadable" | "downloading" | "unavailable" | "unsupported";

function getLanguageModel(): any | null {
  const g = globalThis as any;
  return g.LanguageModel ?? g.ai?.languageModel ?? null;
}

/** Detect whether the on-device Prompt API can be used in this browser. */
export async function chromeAiAvailability(): Promise<ChromeAvailability> {
  try {
    const LM = getLanguageModel();
    if (!LM || typeof LM.availability !== "function") return "unsupported";
    const status = await LM.availability();
    return (status as ChromeAvailability) ?? "unavailable";
  } catch (error) {
    logger.error("chromeAiAvailability error:", error);
    return "unsupported";
  }
}

/**
 * Start a Chrome built-in AI session. MUST be called synchronously inside a user
 * gesture (e.g. a click handler) — Chrome requires user activation to begin the
 * one-time model download when availability is "downloadable". Returns the
 * session promise immediately so create() is invoked within the gesture.
 */
export function createChromeSession(onProgress?: (loaded: number) => void): Promise<any> {
  const LM = getLanguageModel();
  if (!LM) return Promise.reject(new Error("Chrome built-in AI is not available in this browser."));
  return LM.create({
    temperature: ANALYSIS_TEMPERATURE,
    topK: CHROME_TOP_K,
    monitor(m: any) {
      m.addEventListener?.("downloadprogress", (e: any) => onProgress?.(e.loaded ?? 0));
    },
  });
}

async function analyzeWithChromeAI(
  prompt: string,
  sessionPromise?: Promise<any>,
  onProgress?: (loaded: number) => void,
): Promise<MBTIResult> {
  logger.info("[MBTI] provider = chrome-ai (on-device Gemini Nano) — no network request is made.");
  let session: any;
  try {
    session = await (sessionPromise ?? createChromeSession(onProgress));
  } catch (e) {
    // Some Chrome builds don't accept temperature/topK — fall back to defaults.
    logger.warn("[MBTI] chrome-ai create with sampling params failed, retrying with defaults:", e);
    const LM = getLanguageModel();
    session = await LM.create({
      monitor(m: any) {
        m.addEventListener?.("downloadprogress", (e2: any) => onProgress?.(e2.loaded ?? 0));
      },
    });
  }
  try {
    const text = await session.prompt(prompt);
    logger.info("[MBTI] chrome-ai (Gemini Nano) raw output (first 200 chars):", String(text).slice(0, 200));
    return extractJson<MBTIResult>(text);
  } finally {
    session.destroy?.();
  }
}

/* --------------------------- OpenAI-compatible client -------------------------- */

async function chatCompletion(
  endpoint: string,
  apiKey: string,
  model: string,
  prompt: string,
  useJsonFormat: boolean,
): Promise<string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

  const body: Record<string, unknown> = {
    model,
    messages: [{ role: "user", content: prompt }],
    temperature: ANALYSIS_TEMPERATURE,
    stream: false,
  };
  if (useJsonFormat) body.response_format = { type: "json_object" };

  const res = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify(body) });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const err: any = new Error(`HTTP ${res.status} ${res.statusText} ${detail}`.trim());
    err.status = res.status;
    err.detail = detail;
    throw err;
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

async function analyzeWithOpenAI(
  baseUrl: string,
  apiKey: string,
  model: string,
  prompt: string,
): Promise<MBTIResult> {
  const endpoint = `${normalizeBaseUrl(baseUrl)}/chat/completions`;
  const maxRetries = 3;
  const baseDelay = 1000;
  let lastError: unknown;

  logger.info(`[MBTI] provider = OpenAI-compatible | endpoint=${endpoint} | model=${model}`);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      let text: string;
      try {
        text = await chatCompletion(endpoint, apiKey, model, prompt, true);
      } catch (e: any) {
        // Some models/providers reject response_format — retry once in plain mode.
        if (e?.status === 400 && /response_format|json|format/i.test(e?.detail ?? e?.message ?? "")) {
          logger.debug("response_format unsupported, retrying without it");
          text = await chatCompletion(endpoint, apiKey, model, prompt, false);
        } else {
          throw e;
        }
      }
      logger.info("[MBTI] OpenAI-compatible raw output (first 200 chars):", String(text).slice(0, 200));
      return extractJson<MBTIResult>(text);
    } catch (error: any) {
      lastError = error;
      logger.error(`OpenAI-compatible error (attempt ${attempt}/${maxRetries}):`, error);
      const msg = error?.message ?? String(error);
      const retryable = /\b(429|500|502|503|504)\b|too many requests|timeout/i.test(msg);
      if (attempt === maxRetries || !retryable) throw error;
      await new Promise((r) => setTimeout(r, baseDelay * Math.pow(2, attempt - 1)));
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Request failed.");
}

/* --------------------------------- Dispatcher --------------------------------- */

function friendlyError(error: unknown, cfg: AnalyzeConfig): Error {
  const preset = getProvider(cfg.providerId);
  const message = error instanceof Error ? error.message : String(error);

  if (preset.kind === "chrome") {
    return new Error(message || "Chrome built-in AI failed. Try a cloud provider or Ollama instead.");
  }

  if (error instanceof TypeError || /failed to fetch|networkerror|load failed/i.test(message)) {
    if (preset.id === "ollama") {
      return new Error(`Cannot reach Ollama at ${cfg.baseUrl}. Make sure it is running (\`ollama serve\`).`);
    }
    return new Error(`Cannot reach ${preset.name}. Check your network${preset.editableUrl ? " and base URL" : ""}.`);
  }
  if (/\b401\b|unauthor|invalid api key|invalid_api_key/i.test(message)) {
    return new Error(`Authentication failed for ${preset.name}. Check your API key.`);
  }
  if (/\b404\b|not found|model/i.test(message) && /model/i.test(message)) {
    return new Error(`Model "${cfg.model}" was not found on ${preset.name}.`);
  }
  if (/\b429\b|too many requests|rate limit/i.test(message)) {
    return new Error(`${preset.name} rate limit reached. Wait a moment and try again.`);
  }
  return new Error(message || "Failed to analyze. Check your settings.");
}

export const analyzeMBTI = async (
  cfg: AnalyzeConfig,
  bookmarkStructure: unknown,
  language: string,
  onProgress?: (loaded: number) => void,
  chromeSession?: Promise<any>,
): Promise<MBTIResult> => {
  const preset = getProvider(cfg.providerId);
  const langPrompt = language?.startsWith("zh") ? "Traditional Chinese (繁體中文)" : "English";
  // Gemini Nano has a small context window — trim the bookmark blob for it.
  const prompt = buildPrompt(bookmarkStructure, langPrompt, preset.kind === "chrome" ? 6000 : undefined);

  try {
    let result: MBTIResult;
    if (preset.kind === "chrome") {
      result = await analyzeWithChromeAI(prompt, chromeSession, onProgress);
    } else {
      const baseUrl = preset.editableUrl ? cfg.baseUrl : preset.baseUrl ?? "";
      const model = (cfg.model || preset.defaultModel || "").trim();
      result = await analyzeWithOpenAI(baseUrl, cfg.apiKey, model, prompt);
    }
    // Percentages are computed deterministically from the actual bookmarks —
    // not estimated by the model — so they are reproducible and grounded.
    applyComputedPercents(result, bookmarkStructure);
    return result;
  } catch (error) {
    throw friendlyError(error, cfg);
  }
};

/** Overwrite the model's percent fields with deterministic, bookmark-derived scores. */
function applyComputedPercents(result: MBTIResult, bookmarkStructure: unknown): void {
  const s = scoreCategories(bookmarkStructure);
  result.foodpercent = String(s.food);
  result.clothingpercent = String(s.clothing);
  result.housingpercent = String(s.housing);
  result.travelpercent = String(s.travel);
  result.educationpercent = String(s.education);
  result.entertainmentpercent = String(s.entertainment);
  result.moneypercent = String(s.money);
  result.sexpercent = String(s.sex);
  result.pornstarpercent = String(s.pornstar);
}
