import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '@/types';
import { EditMode } from '@/hooks/useWheelOfLife';
import { useLanguage } from '@/context/LanguageContext';
import styles from './ControlPanel.module.css';

interface ControlPanelProps {
  categories: (Category & { targetScore: number })[];
  onScoreChange: (index: number, score: number) => void;
  editMode: EditMode;
  changeEditMode: (mode: EditMode) => void;
  resetData: () => void;
  syncTargetToCurrent: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ categories, onScoreChange, editMode, changeEditMode = () => {}, resetData, syncTargetToCurrent }) => {
  const { t } = useLanguage();
  const categoriesDict = t('categories');
  const modesDict = t('modes');
  const descriptionsDict = t('descriptions') as Record<string, string>;

  const [activeInfo, setActiveInfo] = useState<string | null>(null);

  const toggleInfo = (key: string) => {
    setActiveInfo((prev) => (prev === key ? null : key));
  };

  return (
    <div className={styles.container}>
      <div className={styles.modeSwitchContainer}>
        <button
          onClick={() => changeEditMode('current')}
          className={`${styles.modeButton} ${
            editMode === 'current' ? styles.modeButtonActive : styles.modeButtonInactive
          }`}
        >
          {modesDict.current}
        </button>
        <button
          onClick={() => changeEditMode('target')}
          className={`${styles.modeButton} ${
            editMode === 'target' ? styles.modeButtonActive : styles.modeButtonInactive
          }`}
        >
          {modesDict.ideal}
        </button>
      </div>
      {categories.map((cat, index) => (
        <div key={cat.id} className={styles.categoryRow}>
          <div className={styles.categoryRowHeader}>
            <button
              onClick={() => toggleInfo(cat.key)}
              className={`${styles.infoButton} group`}
              type="button"
            >
              <span className={styles.infoButtonText}>
                {categoriesDict[cat.key as keyof typeof categoriesDict]}
              </span>
              <span className={styles.infoButtonIcon}>
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
            <div className={styles.sliderContainer}>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={editMode === 'current' ? cat.score : cat.targetScore}
                onChange={(e) => onScoreChange(index, Number(e.target.value))}
                className={styles.slider}
              />
              <span className={styles.scoreValue}>
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
                className={styles.descriptionContainer}
              >
                <p className={styles.descriptionText}>
                  {descriptionsDict[cat.key]}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      <div className={styles.footer}>
        {editMode === 'target' && (
          <button
            onClick={syncTargetToCurrent}
            className={styles.syncButton}
          >
            {t('syncTarget')}
          </button>
        )}
        <button
          onClick={resetData}
          className={styles.resetButton}
        >
          {t('resetData')}
        </button>
      </div>
    </div>
  );
};