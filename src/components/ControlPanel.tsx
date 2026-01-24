import React from 'react';
import { Category } from '@/types';

interface ControlPanelProps {
  categories: Category[];
  onScoreChange: (index: number, score: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ categories, onScoreChange }) => {
  return (
    <div className="flex flex-col gap-4 w-full min-w-[300px] flex-1">
      {categories.map((cat, index) => (
        <div key={cat.id} className="flex items-center justify-between pb-1 border-b border-gray-100">
          <label className="font-bold text-sm text-gray-700 w-32 shrink-0">
            {cat.label}
          </label>
          <div className="flex flex-1 items-center gap-2">
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={cat.score}
              onChange={(e) => onScoreChange(index, Number(e.target.value))}
              className="flex-1 cursor-pointer accent-blue-500 h-2 bg-gray-200 rounded-lg appearance-none"
            />
            <span className="font-bold text-blue-500 w-6 text-right">
              {cat.score}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};