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
  
  const exportRefLandscape = useRef<HTMLDivElement>(null);
  const exportRefPortrait = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (layout: 'landscape' | 'portrait') => {
    const targetRef = layout === 'landscape' ? exportRefLandscape : exportRefPortrait;
    if (isExporting || !targetRef.current) return;
    
    setIsExporting(true);

    try {
      const dataUrl = await toPng(targetRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 1,
      });

      // iOS etc: Use Web Share API if possible
      // Checking for mobile devices to favor share sheet, while PC favors direct download
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile && navigator.share) {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], `wheel-of-life-${layout}.png`, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'Wheel of Life',
              files: [file]
            });
            return; // 共有成功、もしくはユーザーが完了したので終了
          } catch (shareErr) {
            console.log('Share canceled or failed', shareErr);
            // AbortErrorはユーザーがキャンセルした場合なので通常のダウンロードに進ませない
            if (shareErr instanceof Error && shareErr.name === 'AbortError') {
               return;
            }
          }
        }
      }

      // フォールバック: 通常のダウンロード
      const link = document.createElement('a');
      link.download = `wheel-of-life-${layout}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    } finally {
      setIsExporting(false);
    }
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
          ref={exportRefLandscape}
          layout="landscape"
          categories={categories}
          chartData={chartData}
          editMode={editMode}
          isTargetInitialized={isTargetInitialized}
        />
        <ExportView
          ref={exportRefPortrait}
          layout="portrait"
          categories={categories}
          chartData={chartData}
          editMode={editMode}
          isTargetInitialized={isTargetInitialized}
        />
      </div>
    </main>
  );
}