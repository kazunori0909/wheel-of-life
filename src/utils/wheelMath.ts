import { ChartConfig } from "@/types";

export const ANGLE_OFFSET = -Math.PI / 2; // 12時の方向から開始

export const CATEGORIES_DATA = [
  { label: "仕事・キャリア", color: "#FF6B6B" },
  { label: "お金・経済", color: "#4ECDC4" },
  { label: "健康", color: "#45B7D1" },
  { label: "家族・パートナー", color: "#FFA07A" },
  { label: "人間関係", color: "#96CEB4" },
  { label: "学び・自己啓発", color: "#D4A5A5" },
  { label: "遊び・余暇", color: "#9B59B6" },
  { label: "物理的環境", color: "#3498DB" },
];

// 扇形（スライス）のパス計算
export const calculateSlicePath = (
  index: number,
  score: number,
  totalCategories: number,
  config: ChartConfig
): string => {
  const { width, height, radius, maxScore } = config;
  const centerX = width / 2;
  const centerY = height / 2;
  const stepAngle = (Math.PI * 2) / totalCategories;

  const r = (radius / maxScore) * score;
  const startAngle = stepAngle * index + ANGLE_OFFSET;
  const endAngle = stepAngle * (index + 1) + ANGLE_OFFSET;

  if (score === 0) return `M ${centerX} ${centerY} Z`;

  const x1 = centerX + r * Math.cos(startAngle);
  const y1 = centerY + r * Math.sin(startAngle);
  const x2 = centerX + r * Math.cos(endAngle);
  const y2 = centerY + r * Math.sin(endAngle);

  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
};

// クリック位置からスコア計算
export const calculateScoreFromClick = (
  clientX: number,
  clientY: number,
  rect: DOMRect,
  totalCategories: number,
  config: ChartConfig
) => {
  const { width, height, radius, maxScore } = config;
  const centerX = width / 2;
  const centerY = height / 2;
  const stepAngle = (Math.PI * 2) / totalCategories;

  const scaleX = width / rect.width;
  const scaleY = height / rect.height;
  const x = (clientX - rect.left) * scaleX - centerX;
  const y = (clientY - rect.top) * scaleY - centerY;

  let angle = Math.atan2(y, x) - ANGLE_OFFSET;
  if (angle < 0) angle += Math.PI * 2;

  const index = Math.floor(angle / stepAngle) % totalCategories;
  const dist = Math.sqrt(x * x + y * y);
  let score = Math.round((dist / radius) * maxScore);

  if (score > maxScore) score = maxScore;
  if (score < 0) score = 0;

  return { index, score };
};

// ラベル位置の計算
export const calculateLabelPosition = (
  index: number,
  totalCategories: number,
  config: ChartConfig
) => {
  const { width, height, labelRadius } = config;
  const centerX = width / 2;
  const centerY = height / 2;
  const stepAngle = (Math.PI * 2) / totalCategories;

  const startAngle = stepAngle * index + ANGLE_OFFSET;
  const midAngle = startAngle + (stepAngle / 2);

  const x = centerX + labelRadius * Math.cos(midAngle);
  const y = centerY + labelRadius * Math.sin(midAngle);

  return { x, y };
};