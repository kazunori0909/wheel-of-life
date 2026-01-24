import React, { useState, useCallback, useRef, useEffect } from "react";
import type { Category, ChartConfig } from "@/types";
import {
  CATEGORIES_DATA,
  calculateScoreFromClick,
  calculateSlicePath,
  calculateLabelPosition,
} from "@/utils/wheelMath";

const INITIAL_SCORE = 5;
const STORAGE_KEY = 'wheel-of-life-data';

export const CHART_CONFIG: ChartConfig = {
  maxScore: 10,
  width: 500,
  height: 500,
  radius: 150,
  labelRadius: 200,
};

export type EditMode = "current" | "target";

const CATEGORY_KEYS = ['job', 'money', 'health', 'family', 'relationship', 'learning', 'fun', 'environment'];

// Define extended type locally to ensure type safety without relying on external type updates
type WheelCategory = Category & { targetScore: number };

export const useWheelOfLife = () => {
  // State: カテゴリデータ
  const [categories, setCategories] = useState<WheelCategory[]>(
    CATEGORIES_DATA.map((c, i) => ({
      id: i,
      label: c.label,
      key: CATEGORY_KEYS[i],
      color: c.color,
      score: INITIAL_SCORE,
      targetScore: INITIAL_SCORE,
    }))
  );
  const [editMode, setEditMode] = useState<EditMode>("current");
  const [isTargetInitialized, setIsTargetInitialized] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed: unknown = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Ensure targetScore exists for backward compatibility
            const migrated = (parsed as Array<Category & { targetScore?: number; key?: string }>).map((c, i) => ({
              ...c,
              key: c.key || CATEGORY_KEYS[i],
              targetScore: typeof c.targetScore === "number" ? c.targetScore : (c.score || INITIAL_SCORE),
            }));
            setCategories(migrated as WheelCategory[]);
            
            // Check if there are any existing target scores different from current scores
            // to prevent overwriting user's previous data on migration
            const hasCustomTargets = migrated.some((c) => c.score !== c.targetScore);
            if (hasCustomTargets) setIsTargetInitialized(true);
          } else if (parsed && typeof parsed === 'object') {
            // New format
            const data = parsed as { categories: WheelCategory[], isTargetInitialized: boolean };
            setCategories(data.categories.map((c, i) => ({
              ...c,
              key: c.key || CATEGORY_KEYS[i]
            })));
            setIsTargetInitialized(data.isTargetInitialized);
          }
        } catch (e) {
          console.error("Failed to load data", e);
        }
      }
      setIsLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save to LocalStorage on update
  useEffect(() => {
    if (isLoaded) {
      const data = {
        categories,
        isTargetInitialized
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [categories, isTargetInitialized, isLoaded]);

  // Action: モード切り替え（理想モードに入るときに現状スコアをコピー）
  const changeEditMode = useCallback((mode: EditMode) => {
    if (mode === 'target' && !isTargetInitialized) {
      setCategories((prev) => prev.map((c) => ({ ...c, targetScore: c.score })));
      setIsTargetInitialized(true);
    }
    setEditMode(mode);
  }, [isTargetInitialized]);

  // Action: 全リセット
  const resetData = useCallback(() => {
    if (window.confirm('すべてのデータをリセットして初期状態に戻しますか？')) {
      localStorage.removeItem(STORAGE_KEY);
      setCategories(CATEGORIES_DATA.map((c, i) => ({
        id: i,
        label: c.label,
        key: CATEGORY_KEYS[i],
        color: c.color,
        score: INITIAL_SCORE,
        targetScore: INITIAL_SCORE,
      })));
      setEditMode('current');
      setIsTargetInitialized(false);
    }
  }, []);

  // Action: スコア更新
  const updateScore = useCallback((index: number, newScore: number) => {
    setCategories((prev) =>
      prev.map((c, i) => {
        if (i !== index) return c;
        return editMode === "current"
          ? { ...c, score: newScore }
          : { ...c, targetScore: newScore };
      })
    );
  }, [editMode]);

  // Action: チャート操作
  const handleChartInteraction = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!svgRef.current) return;

      const isTouch = "touches" in e;
      const clientX = isTouch ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = isTouch ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;

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
      targetPath: calculateSlicePath(i, c.targetScore, categories.length, CHART_CONFIG),
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
    editMode,
    changeEditMode,
    resetData,
    isTargetInitialized,
  };
};