'use client';

import React from 'react';
import { useWheelOfLife } from '@/hooks/useWheelOfLife';
import { ControlPanel } from '@/components/ControlPanel';
import { WheelChart } from '@/components/WheelChart';
import { useLanguage } from '@/context/LanguageContext';
import styles from './page.module.css';

export default function WheelOfLifePage() {
  const { 
    categories, 
    chartData, 
    svgRef, 
    updateScore, 
    handleChartInteraction,
    editMode,
    changeEditMode,
    resetData,
    syncTargetToCurrent,
    isTargetInitialized
  } = useWheelOfLife();

  const { t, language, toggleLanguage } = useLanguage();

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <button
          onClick={toggleLanguage}
          className={styles.langButton}
        >
          {language === 'ja' ? 'English' : '日本語'}
        </button>
      </div>

      <h1 className={styles.title}>{t('title')}</h1>

      <div className={styles.container}>
        {/* 左側：入力パネル */}
        <ControlPanel 
          categories={categories} 
          onScoreChange={updateScore} 
          editMode={editMode}
          changeEditMode={changeEditMode}
          resetData={resetData}
          syncTargetToCurrent={syncTargetToCurrent}
        />

        {/* 右側：チャート */}
        <WheelChart 
          svgRef={svgRef}
          config={chartData.config}
          slices={chartData.slices}
          guides={chartData.guides}
          onInteract={handleChartInteraction}
          editMode={editMode}
          isTargetInitialized={isTargetInitialized}
        />
      </div>
    </main>
  );
}