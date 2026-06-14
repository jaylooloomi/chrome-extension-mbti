import { describe, it, expect } from "vitest";
import {
  normalizeBaseUrl,
  extractJson,
  getProvider,
  validateConfig,
  PROVIDERS,
  AnalyzeConfig,
} from "./providers";

describe("normalizeBaseUrl", () => {
  it("returns empty string for empty input", () => {
    expect(normalizeBaseUrl("")).toBe("");
    expect(normalizeBaseUrl("   ")).toBe("");
  });
  it("prepends http:// when no scheme is given", () => {
    expect(normalizeBaseUrl("localhost:11434/v1")).toBe("http://localhost:11434/v1");
  });
  it("keeps an explicit scheme and strips trailing slashes", () => {
    expect(normalizeBaseUrl("https://openrouter.ai/api/v1/")).toBe("https://openrouter.ai/api/v1");
    expect(normalizeBaseUrl("http://localhost:11434/v1///")).toBe("http://localhost:11434/v1");
  });
});

describe("extractJson", () => {
  it("parses clean JSON", () => {
    expect(extractJson('{"mbti":"INTJ"}')).toEqual({ mbti: "INTJ" });
  });
  it("strips markdown code fences", () => {
    expect(extractJson('```json\n{"mbti":"ENFP"}\n```')).toEqual({ mbti: "ENFP" });
  });
  it("recovers JSON embedded in prose", () => {
    expect(extractJson('Here you go:\n{"mbti":"ISFJ"}\nThanks')).toEqual({ mbti: "ISFJ" });
  });
  it("throws when no JSON present", () => {
    expect(() => extractJson("nope")).toThrow(/valid JSON/i);
  });
});

describe("getProvider", () => {
  it("resolves each known provider id", () => {
    for (const p of PROVIDERS) {
      expect(getProvider(p.id).id).toBe(p.id);
    }
  });
  it("falls back to the first provider for an unknown id", () => {
    // @ts-expect-error testing runtime fallback
    expect(getProvider("does-not-exist").id).toBe(PROVIDERS[0].id);
  });
  it("has correct base URLs and key requirements for cloud presets", () => {
    expect(getProvider("openrouter").baseUrl).toBe("https://openrouter.ai/api/v1");
    expect(getProvider("openrouter").needsKey).toBe(true);
    expect(getProvider("gemini").baseUrl).toContain("generativelanguage.googleapis.com");
    expect(getProvider("groq").baseUrl).toBe("https://api.groq.com/openai/v1");
    expect(getProvider("ollama").needsKey).toBe(false);
    expect(getProvider("ollama").editableUrl).toBe(true);
    expect(getProvider("chrome-ai").kind).toBe("chrome");
  });
});

describe("validateConfig", () => {
  const cfg = (over: Partial<AnalyzeConfig>): AnalyzeConfig => ({
    providerId: "openrouter",
    baseUrl: "",
    apiKey: "",
    model: "some-model",
    ...over,
  });

  it("never blocks the chrome provider (checked separately)", () => {
    expect(validateConfig(cfg({ providerId: "chrome-ai", model: "" }))).toBeNull();
  });
  it("requires a key for key-based providers", () => {
    expect(validateConfig(cfg({ providerId: "groq", apiKey: "" }))).toBe("enterKeyError");
    expect(validateConfig(cfg({ providerId: "groq", apiKey: "gsk_x" }))).toBeNull();
  });
  it("requires a base URL for editable-url providers", () => {
    expect(validateConfig(cfg({ providerId: "ollama", baseUrl: "" }))).toBe("enterUrlError");
    expect(validateConfig(cfg({ providerId: "ollama", baseUrl: "http://localhost:11434/v1" }))).toBeNull();
  });
  it("requires a model", () => {
    expect(validateConfig(cfg({ providerId: "groq", apiKey: "k", model: "" }))).toBe("enterModelError");
  });
});
