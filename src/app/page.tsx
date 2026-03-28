'use client';

import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { useWheelOfLife } from '@/hooks/useWheelOfLife';
import { ControlPanel } from '@/components/ControlPanel';
import { WheelChart } from '@/components/WheelChart';
import { ExportView } from '@/components/ExportView';
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
  
  const exportRef = useRef<HTMLDivElement>(null);
  const [exportLayout, setExportLayout] = useState<'landscape' | 'portrait'>('landscape');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (layout: 'landscape' | 'portrait') => {
    if (isExporting || !exportRef.current) return;
    setIsExporting(true);
    setExportLayout(layout);

    // Give React a tick to update the DOM layout class before capturing
    setTimeout(async () => {
      try {
        if (!exportRef.current) return;
        const dataUrl = await toPng(exportRef.current, {
          cacheBust: true,
          pixelRatio: 2,
          quality: 1,
        });
        const link = document.createElement('a');
        link.download = `wheel-of-life-${layout}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to export image', err);
      } finally {
        setIsExporting(false);
      }
    }, 100);
  };

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

      {/* フッター：保存ボタン（右下） */}
      <div className={styles.footer}>
        <div className={styles.actionButtons}>
          <button
            onClick={() => handleExport('landscape')}
            disabled={isExporting}
            className={styles.exportButton}
          >
            {t('savePcImage')}
          </button>
          <button
            onClick={() => handleExport('portrait')}
            disabled={isExporting}
            className={styles.exportButton}
          >
            {t('saveMobileImage')}
          </button>
        </div>
      </div>

      {/* 非表示の画像保存用コンテナ */}
      <div className={styles.offscreen}>
        <ExportView
          ref={exportRef}
          layout={exportLayout}
          categories={categories}
          chartData={chartData}
          editMode={editMode}
          isTargetInitialized={isTargetInitialized}
        />
      </div>
    </main>
  );
}