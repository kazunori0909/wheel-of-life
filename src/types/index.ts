export interface Category {
  id: number;
  label: string;
  key: string;
  color: string;
  score: number;
}

export interface ChartConfig {
  maxScore: number;
  width: number;
  height: number;
  radius: number;
  labelRadius: number;
}