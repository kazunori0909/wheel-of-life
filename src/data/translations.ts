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
    resetData: "Reset Data",
  },
} as const;

export type Translations = typeof translations.ja;