'use client';

import React from 'react';
import { useWheelOfLife } from '@/hooks/useWheelOfLife';
import { ControlPanel } from '@/components/ControlPanel';
import { WheelChart } from '@/components/WheelChart';

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
    isTargetInitialized
  } = useWheelOfLife();

  return (
    <main className="min-h-screen bg-[#f4f7f6] flex flex-col items-center py-10 px-5 font-sans text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-slate-700">人生の輪</h1>

      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg w-full max-w-5xl flex flex-col-reverse md:flex-row gap-10 items-center justify-center">
        {/* 左側：入力パネル */}
        <ControlPanel 
          categories={categories} 
          onScoreChange={updateScore} 
          editMode={editMode}
          changeEditMode={changeEditMode}
          resetData={resetData}
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