export const translations = {
  ja: {
    title: "人生の輪",
    modes: {
      current: "いま",
      ideal: "こうなりたい",
    },
    categories: {
      job: "仕事・キャリア",
      money: "お金・経済",
      health: "健康",
      family: "家族・パートナー",
      relationship: "人間関係",
      learning: "学び・自己啓発",
      fun: "遊び・余暇",
      environment: "物理的環境",
    },
    descriptions: {
      job: "現在の職務内容、働きがい、将来のキャリアパスに対する満足度。",
      money: "現在の収入、貯蓄、資産運用、経済的な安心感に対する満足度。",
      health: "身体的な調子、エネルギーレベル、精神的な健康状態、生活習慣。",
      family: "家族やパートナーとの関係性、家庭内の雰囲気、過ごす時間の質。",
      relationship: "友人、同僚、地域社会など、家族以外の人とのつながり。",
      learning: "新しい知識の習得、スキルの向上、精神的な成長、自己投資。",
      fun: "趣味、娯楽、リラックスする時間、人生を楽しむことへの充実度。",
      environment: "自宅や職場の快適さ、住んでいる地域の安全性や利便性。",
    },
    resetData: "データをリセット",
  },
  en: {
    title: "Wheel of Life",
    modes: {
      current: "Current",
      ideal: "Ideal",
    },
    categories: {
      job: "Career",
      money: "Finance",
      health: "Health",
      family: "Family & Partner",
      relationship: "Relationships",
      learning: "Personal Growth",
      fun: "Fun & Recreation",
      environment: "Physical Environment",
    },
    descriptions: {
      job: "Satisfaction with your current role, career path, and professional growth.",
      money: "Your financial stability, income, savings, and financial freedom.",
      health: "Your physical well-being, energy levels, diet, and mental health.",
      family: "Quality of relationships with your partner, children, parents, and siblings.",
      relationship: "Connections with friends, colleagues, and your social circle.",
      learning: "Personal development, education, and acquiring new skills.",
      fun: "Hobbies, leisure time, relaxation, and pure enjoyment of life.",
      environment: "Your home environment, workplace, and physical surroundings.",
    },
    resetData: "Reset Data",
  },
} as const;

export type Translations = typeof translations.ja;