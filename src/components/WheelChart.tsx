import React from 'react';
import { ChartConfig } from '@/types';

interface WheelChartProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  config: ChartConfig;
  slices: Array<{
    id: number;
    color: string;
    label: string;
    path: string;
    targetPath: string;
    labelPos: { x: number; y: number };
  }>;
  guides: number[];
  onInteract: (e: React.MouseEvent | React.TouchEvent) => void;
}

export const WheelChart: React.FC<WheelChartProps> = ({
  svgRef,
  config,
  slices,
  guides,
  onInteract,
}) => {
  const { width, height, radius, maxScore } = config;
  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <div className="w-full max-w-[500px] aspect-square relative select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full cursor-pointer overflow-visible"
        onMouseDown={onInteract}
        onTouchStart={(e) => {
            // 必要に応じてe.preventDefault()を入れる
            onInteract(e);
        }}
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

        {/* スライス（データ） */}
        <g>
          {slices.map((slice) => (
            <React.Fragment key={slice.id}>
              <path
                d={slice.path}
                fill={slice.color}
                className="fill-opacity-60 hover:fill-opacity-80 transition-all duration-300 ease-out"
                stroke="none"
              />
              <path
                d={slice.targetPath}
                fill="none"
                stroke={slice.color}
                strokeWidth="2"
                strokeDasharray="4,2"
                className="pointer-events-none opacity-80"
              />
            </React.Fragment>
          ))}
        </g>

        {/* ラベル */}
        <g>
            {slices.map((slice) => (
                <text
                    key={slice.id}
                    x={slice.labelPos.x}
                    y={slice.labelPos.y}
                    className="text-[12px] font-bold fill-gray-600 pointer-events-none"
                    textAnchor="middle"
                    dominantBaseline="middle"
                >
                    {slice.label}
                </text>
            ))}
        </g>
      </svg>
    </div>
  );
};