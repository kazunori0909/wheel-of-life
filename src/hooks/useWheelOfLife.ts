import { useState, useCallback, useRef } from "react";
import { Category, ChartConfig } from "@/types";
import {
  CATEGORIES_DATA,
  calculateScoreFromClick,
  calculateSlicePath,
  calculateLabelPosition,
} from "@/utils/wheelMath";

const INITIAL_SCORE = 5;

export const CHART_CONFIG: ChartConfig = {
  maxScore: 10,
  width: 500,
  height: 500,
  radius: 180,
  labelRadius: 215,
};

export const useWheelOfLife = () => {
  // State: カテゴリデータ
  const [categories, setCategories] = useState<Category[]>(
    CATEGORIES_DATA.map((c, i) => ({
      id: i,
      label: c.label,
      color: c.color,
      score: INITIAL_SCORE,
    }))
  );

  const svgRef = useRef<SVGSVGElement>(null);

  // Action: スコア更新
  const updateScore = useCallback((index: number, newScore: number) => {
    setCategories((prev) =>
      prev.map((c, i) => (i === index ? { ...c, score: newScore } : c))
    );
  }, []);

  // Action: チャート操作
  const handleChartInteraction = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!svgRef.current) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const rect = svgRef.current.getBoundingClientRect();
      const result = calculateScoreFromClick(
        clientX,
        clientY,
        rect,
        categories.length,
        CHART_CONFIG
      );

      updateScore(result.index, result.score);
    },
    [categories.length, updateScore]
  );

  // Computed: 描画用データ
  const chartData = {
    config: CHART_CONFIG,
    slices: categories.map((c, i) => ({
      ...c,
      path: calculateSlicePath(i, c.score, categories.length, CHART_CONFIG),
      labelPos: calculateLabelPosition(i, categories.length, CHART_CONFIG),
    })),
    guides: Array.from({ length: CHART_CONFIG.maxScore }, (_, i) => i + 1),
  };

  return {
    categories,
    chartData,
    svgRef,
    updateScore,
    handleChartInteraction,
  };
};