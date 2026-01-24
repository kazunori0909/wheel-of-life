import React from 'react';
import { Category } from '@/types';
import { EditMode } from '@/hooks/useWheelOfLife';

interface ControlPanelProps {
  categories: (Category & { targetScore: number })[];
  onScoreChange: (index: number, score: number) => void;
  editMode: EditMode;
  changeEditMode: (mode: EditMode) => void;
  resetData: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ categories, onScoreChange, editMode, changeEditMode = () => {}, resetData }) => {
  return (
    <div className="flex flex-col gap-4 w-full min-w-[300px] flex-1">
      <div className="flex bg-gray-100 p-1 rounded-lg mb-2">
        <button
          onClick={() => changeEditMode('current')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${
            editMode === 'current' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          現状 (Current)
        </button>
        <button
          onClick={() => changeEditMode('target')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${
            editMode === 'target' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          理想 (Ideal)
        </button>
      </div>
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
              value={editMode === 'current' ? cat.score : cat.targetScore}
              onChange={(e) => onScoreChange(index, Number(e.target.value))}
              className="flex-1 cursor-pointer accent-blue-500 h-2 bg-gray-200 rounded-lg appearance-none"
            />
            <span className="font-bold text-blue-500 w-6 text-right">
              {editMode === 'current' ? cat.score : cat.targetScore}
            </span>
          </div>
        </div>
      ))}

      <div className="mt-4 flex justify-end">
        <button
          onClick={resetData}
          className="text-xs text-red-400 hover:text-red-600 underline transition-colors"
        >
          データをリセット
        </button>
      </div>
    </div>
  );
};