import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "title": "MBTI Persona Analysis",
      "apiKeyLabel": "Gemini API Key:",
      "getKey": "Get API Key",
      "aiButton": "Start Test",
      "privacy": "Note: Your data is processed locally and only sent to your Gemini for analysis. We do not store your API key or data.",
      "analyzing": "Analyzing Neural Patterns...",
      "downloading": "Downloading Memory Tree...",
      "resultTitle": "Analysis Complete",
      "unknown": "Unknown",
      "mbtiType": "Personality Type",
      "traits": "Core Traits",
      "retest": "Retest",
      "toggleLang": "中文",
      "footerAuth": "MIT License",
      "bookmarkApiError": "Could not access bookmarks API. Make sure you are running this in a Chrome extension.",
      "downloadBookmarks": "Download Bookmarks",
      "couple": "Which person is right for you?",
      "whoYouAre": "What kind of person you are?",
      "food":"food",
      "clothing":"clothing",
      "housing":"housing",
      "travel":"travel",
      "education":"education",
      "entertainment":"entertainment",
      "money":"money",
      "sex":"sex",
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
      "downloading": "正在讀取記憶樹...",
      "resultTitle": "分析完成",
      "unknown": "未知",
      "mbtiType": "人格類型",
      "traits": "核心特質",
      "retest": "重新分析",
      "toggleLang": "English",
      "footerAuth": "MIT License",
      "bookmarkApiError": "无法访问书签 API。请确保您在 Chrome 扩展程序中运行。",
      "downloadBookmarks": "下載書籤",
      "couple": "適合你的伴侶?",
      "whoYouAre": "你是一位怎麼樣的人?",
      "food":"食",
      "clothing":"衣",
      "housing":"住",
      "travel":"行",
      "education":"育",
      "entertainment":"樂",
      "money":"錢",
      "sex":"性",
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
