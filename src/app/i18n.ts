import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "title": "MBTI Persona Analysis",
      "apiKeyLabel": "Gemini API Key:",
      "getKey": "Get API Key",
      "aiButton": "Start Test",
      "privacy": "Note: Your data is processed locally and only sent to Gemini for analysis. We do not store your API key or data.",
      "analyzing": "Analyzing Neural Patterns...",
      "downloading": "Downloading Memory Tree...",
      "resultTitle": "Analysis Complete",
      "unknown": "Unknown",
      "mbtiType": "Personality Type",
      "traits": "Core Traits",
      "retest": "Analyze Again",
      "toggleLang": "中文",
      "footerAuth": "MIT License"
    }
  },
  zh: {
    translation: {
      "title": "MBTI 人格分析",
      "apiKeyLabel": "Gemini API Key:",
      "getKey": "獲取 API Key",
      "aiButton": "測驗開始",
      "privacy": "注意：您的資料僅供本機使用及傳送至 Gemini 進行分析，本應用程式不會儲存您的 API Key 或個人資訊。",
      "analyzing": "正在分析神經網路模式...",
      "downloading": "正在下載記憶樹...",
      "resultTitle": "分析完成",
      "unknown": "未知",
      "mbtiType": "人格類型",
      "traits": "核心特質",
      "retest": "重新分析",
      "toggleLang": "English",
      "footerAuth": "MIT License"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "zh",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
