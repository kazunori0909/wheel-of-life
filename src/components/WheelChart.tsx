'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChartConfig } from '@/types';
import { EditMode } from '@/hooks/useWheelOfLife';
import { useLanguage } from '@/context/LanguageContext';
import styles from './WheelChart.module.css';

interface WheelChartProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  config: ChartConfig;
  slices: Array<{
    id: number;
    color: string;
    label: string;
    key: string;
    path: string;
    targetPath: string;
    labelPos: { x: number; y: number };
  }>;
  guides: number[];
  onInteract: (e: React.MouseEvent | React.TouchEvent) => void;
  editMode: EditMode;
  isTargetInitialized: boolean;
  disableAnimation?: boolean;
}

export const WheelChart: React.FC<WheelChartProps> = ({
  svgRef,
  config,
  slices,
  guides,
  onInteract,
  editMode,
  isTargetInitialized,
  disableAnimation = false,
}) => {
  const { width, height, radius, maxScore } = config;
  const centerX = width / 2;
  const centerY = height / 2;

  const { t } = useLanguage();
  const categoriesDict = t('categories');

  return (
    <div className={styles.container}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className={styles.svgContent}
      >
        {/* ガイド（同心円） */}
        <g>
          {guides.map((val) => {
            const r = (radius / maxScore) * val;
            const isMid = val === 5;
            return (
              <React.Fragment key={val}>
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={r}
                  fill="none"
                  stroke={isMid ? "#bbb" : "#e0e0e0"}
                  strokeDasharray={isMid ? "none" : "4,4"}
                  className={styles.guideCircle}
                />
                {isMid && (
                  <text
                    x={centerX - r}
                    y={centerY}
                    dy="-5"
                    className={styles.guideText}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {val}
                  </text>
                )}
              </React.Fragment>
            );
          })}
        </g>

        {/* 現状スコア（1層目：奥） */}
        <g>
          {slices.map((slice) => (
            <motion.path
              key={`current-${slice.id}`}
              d={slice.path}
              initial={{ d: slice.path }}
              animate={{ d: slice.path }}
              transition={disableAnimation ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 25 }}
              fill={slice.color}
              fillOpacity={0.5}
              className={styles.currentPath}
              stroke="none"
              style={disableAnimation ? { transition: 'none' } : undefined}
            />
          ))}
        </g>

        {/* 理想スコア（2層目：手前） */}
        {(editMode === 'target' || isTargetInitialized) && (
          <g>
            {slices.map((slice) => (
              <motion.path
                key={`target-${slice.id}`}
                d={slice.targetPath}
                initial={{ d: slice.targetPath }}
                animate={{ d: slice.targetPath }}
                transition={disableAnimation ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 25 }}
                fill="none"
                stroke={slice.color}
                strokeWidth="3"
                strokeDasharray="4 4"
                className={styles.targetPath}
                style={disableAnimation ? { transition: 'none' } : undefined}
              />
            ))}
          </g>
        )}

        {/* ラベル */}
        <g>
            {slices.map((slice) => (
                <text
                    key={slice.id}
                    x={slice.labelPos.x}
                    y={slice.labelPos.y}
                    className={styles.labelText}
                    textAnchor="middle"
                    dominantBaseline="middle"
                >
                    {categoriesDict[slice.key as keyof typeof categoriesDict]}
                </text>
            ))}
        </g>

        {/* 操作用ヒットエリア */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius + 30}
          fill="transparent"
          className={styles.hitArea}
          onMouseDown={onInteract}
          onTouchStart={(e) => onInteract(e)}
        />
      </svg>
    </div>
  );
};