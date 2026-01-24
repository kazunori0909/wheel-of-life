'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChartConfig } from '@/types';
import { EditMode } from '@/hooks/useWheelOfLife';
import { useLanguage } from '@/context/LanguageContext';

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
}

export const WheelChart: React.FC<WheelChartProps> = ({
  svgRef,
  config,
  slices,
  guides,
  onInteract,
  editMode,
  isTargetInitialized,
}) => {
  const { width, height, radius, maxScore } = config;
  const centerX = width / 2;
  const centerY = height / 2;

  const { t } = useLanguage();
  const categoriesDict = t('categories');

  return (
    <div className="w-full max-w-[500px] aspect-square relative select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
        style={{ touchAction: 'none' }}
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
                  className="pointer-events-none"
                />
                {isMid && (
                  <text
                    x={centerX - r}
                    y={centerY}
                    dy="-5"
                    className="text-sm font-bold fill-gray-400 pointer-events-none text-center"
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
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              fill={slice.color}
              fillOpacity={0.5}
              className="transition-all duration-300 ease-out"
              stroke="none"
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
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                fill="none"
                stroke={slice.color}
                strokeWidth="3"
                strokeDasharray="4 4"
                className="pointer-events-none transition-all duration-300 ease-out"
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
                    className="text-[20px] font-medium fill-gray-600 pointer-events-none"
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
          className="cursor-pointer"
          onMouseDown={onInteract}
          onTouchStart={(e) => onInteract(e)}
        />
      </svg>
    </div>
  );
};