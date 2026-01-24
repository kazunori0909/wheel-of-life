import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '@/types';
import { EditMode } from '@/hooks/useWheelOfLife';
import { useLanguage } from '@/context/LanguageContext';

interface ControlPanelProps {
  categories: (Category & { targetScore: number })[];
  onScoreChange: (index: number, score: number) => void;
  editMode: EditMode;
  changeEditMode: (mode: EditMode) => void;
  resetData: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ categories, onScoreChange, editMode, changeEditMode = () => {}, resetData }) => {
  const { t } = useLanguage();
  const categoriesDict = t('categories');
  const modesDict = t('modes');
  const descriptionsDict = t('descriptions') as Record<string, string>;

  const [activeInfo, setActiveInfo] = useState<string | null>(null);

  const toggleInfo = (key: string) => {
    setActiveInfo((prev) => (prev === key ? null : key));
  };

  return (
    <div className="flex flex-col gap-4 w-full min-w-[300px] flex-1">
      <div className="flex bg-gray-100 p-1 rounded-lg mb-2">
        <button
          onClick={() => changeEditMode('current')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${
            editMode === 'current' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {modesDict.current}
        </button>
        <button
          onClick={() => changeEditMode('target')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${
            editMode === 'target' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {modesDict.ideal}
        </button>
      </div>
      {categories.map((cat, index) => (
        <div key={cat.id} className="flex flex-col border-b border-gray-100 pb-1">
          <div className="flex items-center justify-between">
            <button
              onClick={() => toggleInfo(cat.key)}
              className="flex items-center gap-1 w-32 shrink-0 text-left group"
              type="button"
            >
              <span className="font-bold text-sm text-gray-700">
                {categoriesDict[cat.key as keyof typeof categoriesDict]}
              </span>
              <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
              </span>
            </button>
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
          <AnimatePresence>
            {activeInfo === cat.key && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="text-sm text-gray-500 py-2">
                  {descriptionsDict[cat.key]}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      <div className="mt-4 flex justify-end">
        <button
          onClick={resetData}
          className="text-xs text-red-400 hover:text-red-600 underline transition-colors"
        >
          {t('resetData')}
        </button>
      </div>
    </div>
  );
};