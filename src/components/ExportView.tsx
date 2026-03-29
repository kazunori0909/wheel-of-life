import React, { forwardRef } from 'react';
import { WheelChart } from '@/components/WheelChart';
import type { Category, ChartConfig } from '@/types';
import type { EditMode } from '@/hooks/useWheelOfLife';
import { useLanguage } from '@/context/LanguageContext';
import styles from './ExportView.module.css';

interface ExportViewProps {
  layout: 'landscape' | 'portrait';
  categories: (Category & { targetScore: number })[];
  chartData: {
    config: ChartConfig;
    slices: any[];
    guides: number[];
  };
  editMode: EditMode;
  isTargetInitialized: boolean;
}

export const ExportView = forwardRef<HTMLDivElement, ExportViewProps>(({
  layout,
  categories,
  chartData,
  editMode,
  isTargetInitialized
}, ref) => {
  const isLandscape = layout === 'landscape';
  const { t, language } = useLanguage();
  
  const title = t('title');
  const categoriesDict = t('categories') as Record<string, string>;
  const descriptionsDict = t('descriptions') as Record<string, string>;

  return (
    <div
      ref={ref}
      className={`${styles.container} ${isLandscape ? styles.landscape : styles.portrait}`}
      style={{
        width: isLandscape ? '1200px' : '800px',
        height: isLandscape ? '675px' : '1200px',
      }}
    >
      <h1 className={styles.title}>{title}</h1>

      <div className={isLandscape ? styles.landscapeWrapper : styles.portraitWrapper}>
        {isLandscape ? (
          <>
            <div className={styles.leftConstrained}>
              <div className={styles.descriptionList}>
                {categories.map((cat) => (
                  <div key={cat.id} className={styles.descriptionItem}>
                    <div className={styles.descHeader}>
                      <span className={styles.catName}>{categoriesDict[cat.key]}</span>
                      <span className={styles.catScore}>
                        {cat.score === cat.targetScore ? cat.score : `${cat.score} → ${cat.targetScore}`}
                      </span>
                    </div>
                    <p className={styles.descText}>{descriptionsDict[cat.key]}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.chartArea}>
              <WheelChart
                svgRef={{ current: null }}
                config={chartData.config}
                slices={chartData.slices}
                guides={chartData.guides}
                onInteract={() => {}}
                editMode={editMode}
                isTargetInitialized={isTargetInitialized}
                disableAnimation={true}
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles.chartArea}>
              <WheelChart
                svgRef={{ current: null }}
                config={chartData.config}
                slices={chartData.slices}
                guides={chartData.guides}
                onInteract={() => {}}
                editMode={editMode}
                isTargetInitialized={isTargetInitialized}
                disableAnimation={true}
              />
            </div>
            <div className={styles.topConstrained}>
              <div className={styles.descriptionList}>
                {categories.map((cat) => (
                  <div key={cat.id} className={styles.descriptionItem}>
                    <div className={styles.descHeader}>
                      <span className={styles.catName}>{categoriesDict[cat.key]}</span>
                      <span className={styles.catScore}>
                        {cat.score === cat.targetScore ? cat.score : `${cat.score} → ${cat.targetScore}`}
                      </span>
                    </div>
                    <p className={styles.descText}>{descriptionsDict[cat.key]}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

ExportView.displayName = 'ExportView';
