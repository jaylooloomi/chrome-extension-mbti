export interface CharacterProfile {
  name: Record<string, string>;
  description: Record<string, string>;
  image?: string;
}

// Importing assets directly provided by the user
// Placeholder for missing Figma assets
const intjImg = ""; // "figma:asset/e4501688edff3c158142f6956bbe8dca02947b2e.png";
const entjImg = ""; // "figma:asset/8c089559bc614d8a72ed28b1d1c5d7a77bc6c858.png";
const enfjImg = ""; // "figma:asset/0e3fecf05b6043b23eaf73f01d117289dfc31546.png";

export const characterData: Record<string, CharacterProfile> = {
  INTJ: {
    name: {
      en: "Architect (Architect)",
      zh: "建築師 (Architect)"
    },
    description: {
      en: "Imaginative and strategic thinkers, with a plan for everything.",
      zh: "充滿想像力且果斷的戰略家，凡事皆有計畫。"
    },
    image: "images/intj.jpg"
  },
  INTP: {
    name: {
      en: "Logician (Logician)",
      zh: "邏輯學家 (Logician)"
    },
    description: {
      en: "Innovative inventors with an unquenchable thirst for knowledge.",
      zh: "具有創造力的發明家，對知識有著無止境的渴望。"
    },
    image: "images/intp.jpg"
  },
  ENTJ: {
    name: {
      en: "Commander (Commander)",
      zh: "指揮官 (Commander)"
    },
    description: {
      en: "Bold, imaginative and strong-willed leaders, always finding a way - or making one.",
      zh: "大膽且富有想像力的強大領導者，總能找到前進的道路。"
    },
    image: "images/entj.jpg"
  },
  ENTP: {
    name: {
      en: "Debater (Debater)",
      zh: "辯論家 (Debater)"
    },
    description: {
      en: "Smart and curious thinkers who cannot resist an intellectual challenge.",
      zh: "聰明且好奇的思考者，無法抗拒智力上的挑戰。"
    },
    image: "images/entp.jpg"
  },
  INFJ: {
    name: {
      en: "Advocate (Advocate)",
      zh: "提倡者 (Advocate)"
    },
    description: {
      en: "Quiet and mystical, yet very inspiring and tireless idealists.",
      zh: "安靜且神秘，同時也是鼓舞人心且不倦的理想主義者。"
    },
    image: "images/infj.jpg"
  },
  INFP: {
    name: {
      en: "Mediator (Mediator)",
      zh: "调停者 (Mediator)"
    },
    description: {
      en: "Poetic, kind and altruistic people, always eager to help a good cause.",
      zh: "詩意、善良且利他的，總是在尋求支持正義的事業。"
    },
    image: "images/infp.jpg"
  },
  ENFJ: {
    name: {
      en: "Protagonist (Protagonist)",
      zh: "主人公 (Protagonist)"
    },
    description: {
      en: "Charismatic and inspiring leaders, able to mesmerize their listeners.",
      zh: "具有魅力且能激勵人心的領導者，讓聽眾聽得如痴如醉。"
    },
    image: "images/enfj.jpg"
  },
  ENFP: {
    name: {
      en: "Campaigner (Campaigner)",
      zh: "競選者 (Campaigner)"
    },
    description: {
      en: "Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.",
      zh: "熱情、有創意且開朗的自由靈魂，總能找到理由微笑。"
    },
    image: "images/enfp.jpg"
  },
  ISTJ: {
    name: {
      en: "Logistician (Logistician)",
      zh: "物流師 (Logistician)"
    },
    description: {
      en: "Practical and fact-minded individuals, whose reliability cannot be doubted.",
      zh: "務實且注重事實的人，可靠性不容置疑。"
    },
    image: "images/istj.jpg"
  },
  ISFJ: {
    name: {
      en: "Defender (Defender)",
      zh: "守護者 (Defender)"
    },
    description: {
      en: "Very dedicated and warm protectors, always ready to defend their loved ones.",
      zh: "非常專注且溫暖的人，始終準備好保護他們所愛的人。"
    },
    image: "images/isfj.jpg"
  },
  ESTJ: {
    name: {
      en: "Executive (Executive)",
      zh: "管理者 (Executive)"
    },
    description: {
      en: "Excellent administrators, unsurpassed at managing things - or people.",
      zh: "優秀的管理人，在管理事務或人方面無與倫比。"
    },
    image: "images/estj.jpg"
  },
  ESFJ: {
    name: {
      en: "Consul (Consul)",
      zh: "執政官 (Consul)"
    },
    description: {
      en: "Extraordinarily caring, social and popular people, always eager to help.",
      zh: "極具同情心、社交性且受歡迎的人，總是熱心提供幫助。"
    },
    image: "images/esfj.jpg"
  },
  ISTP: {
    name: {
      en: "Virtuoso (Virtuoso)",
      zh: "鑑賞家 (Virtuoso)"
    },
    description: {
      en: "Bold and practical experimenters, masters of all kinds of tools.",
      zh: "大膽且務實的探險家，擅長操作各類工具。"
    },
    image: "images/istp.jpg"
  },
  ISFP: {
    name: {
      en: "Adventurer (Adventurer)",
      zh: "冒險家 (Adventurer)"
    },
    description: {
      en: "Flexible and charming artists, always ready to explore and experience something new.",
      zh: "靈活且迷人的藝術家，隨時準備探索新事物。"
    },
    image: "images/isfp.jpg"
  },
  ESTP: {
    name: {
      en: "Entrepreneur (Entrepreneur)",
      zh: "企業家 (Entrepreneur)"
    },
    description: {
      en: "Smart, energetic and very perceptive people, who truly enjoy living on the edge.",
      zh: "聰明、精力充沛且非常有洞察力的人，享受冒險生活。"
    },
    image: "images/estp.jpg"
  },
  ESFP: {
    name: {
      en: "Entertainer (Entertainer)",
      zh: "表演者 (Entertainer)"
    },
    description: {
      en: "Spontaneous, energetic and enthusiastic people - life is never boring around them.",
      zh: "自發、精力充沛且熱情的表演者，生活在他們身邊絕不無聊。"
    },
    image: "images/esfp.jpg"
  }
};
