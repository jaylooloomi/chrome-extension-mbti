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
      "donationMessage": "Having you all by my side throughout this journey has been the greatest motivation for me to keep creating. To me, this endeavor is far more than just a job; it is a bridge through which I share my life and my soul with you. If you resonate with the value of my work, or if you have ever found a spark of inspiration or joy in my content, I sincerely invite you to support me through a small donation. Your contribution, no matter the size, means the world to me.",
      "systemMessage": "SYSTEM MESSAGE",
      "analyzing": "Analyzing Neural Patterns...",
      "downloading": "Downloading Memory Tree...",
      "resultTitle": "Analysis Complete",
      "unknown": "Unknown",
      "mbtiType": "Personality Type",
      "traits": "Core Traits",
      "retest": "Retest",
      "toggleLang": "中文",
      "footerAuth": "MIT License | Version 1.0 | Author: Arthur Wang",
      "bookmarkApiError": "Could not access bookmarks API. Make sure you are running this in a Chrome extension.",
      "downloadBookmarks": "Download Bookmarks",
      "favoriteThing": "What is your favorite thing?",
      "unhideKeyInfo": "Show Details",
      "hideKeyInfo": "Hide Details",
      "jumpToTop": "Jump to Top",
      "jumpToBottom": "Jump to Bottom",
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
      "pornstar":"pornstar",
      "tooltipApiKey": "For personal use only; the system will not save this information!",
      "copysuccess":"Image copied to clipboard!",
      "likeThisTool": "Do you like this tool?",
      "sponsorCoffee": "Sponsor a coffee ☕",
      "coffeeicon": "☕",
      "skipAndStartAnalysis": "Skip and Start Analysis",
    }
  },
  zh: {
    translation: {
      "title": "MBTI 人格分析",
      "apiKeyLabel": "Gemini API Key:",
      "getKey": "獲取 API Key",
      "aiButton": "測驗開始",
      "privacy": "注意：您的資料僅供本機使用及傳送至 Gemini 進行分析，本應用程式不會儲存您的 API Key 或個人資訊。",
      "donationMessage": "一路上有你們的陪伴，是我能持續創作的最大動力。這份事業對我而言，不僅僅是工作，更是與你們分享生活與靈魂的橋樑。如果您認同我的創作價值，或是曾經在我的內容中獲得一點啟發或快樂，誠摯邀請您透過小額贊助來支持我。",
      "systemMessage": "系統訊息",
      "analyzing": "正在分析神經網路模式...",
      "downloading": "正在讀取記憶樹...",
      "resultTitle": "分析完成",
      "unknown": "未知",
      "mbtiType": "人格類型",
      "traits": "核心特質",
      "retest": "重新分析",
      "toggleLang": "English",
      "footerAuth": "MIT License | Version 1.0 | 作者: Arthur Wang",
      "bookmarkApiError": "无法访问书签 API。请确保您在 Chrome 扩展程序中运行。",
      "downloadBookmarks": "下載書籤",
      "favoriteThing": "你最喜歡的東西是什麼?",
      "unhideKeyInfo": "不隱藏",
      "hideKeyInfo": "隱藏關鍵訊息",
      "jumpToTop": "回到頂部",
      "jumpToBottom": "跳至底部",
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
      "pornstar":"成人影星",
      "tooltipApiKey": "僅供使用者個人使用, 系統將不會保存!",
      "copysuccess":"圖片已複製到剪貼簿！",
      "likeThisTool": "喜歡這個工具嗎？",
      "sponsorCoffee": "贊助一杯咖啡 ☕",
      "coffeeicon": "☕",
      "skipAndStartAnalysis": "跳過並開始分析",
    }
  }
}

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
