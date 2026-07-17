import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useColorContrast } from './hooks/useColorContrast';

import { Sidebar } from './components/layout/Sidebar';
import { InteractiveCanvas } from './components/lab/InteractiveCanvas';
import { ColorTuningPanel } from './components/lab/ColorTuningPanel';
import { LivePreview } from './components/lab/LivePreview';
import { ComplianceMetrics } from './components/lab/ComplianceMetrics';
import { ContrastHistory } from './components/lab/ContrastHistory';
import { GuideTab } from './components/tabs/GuideTab';
import { FaqTab } from './components/tabs/FaqTab';

export default function App() {
  // Local UI state
  const [isDark, setIsDark] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHeatmapActive, setIsHeatmapActive] = useState(false);

  // Shared logic from the custom hook
  const {
    foreground, background, pickMode, setPickMode, history,
    contrastResult, toast, showToast, updateColor, swapColors,
    addHistory, restoreFromHistory
  } = useColorContrast();

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100 pb-28 lg:pb-0">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
          
          <Sidebar isDark={isDark} setIsDark={setIsDark} />

          <main className="flex-1 px-4 py-5 sm:px-6 lg:ml-24 lg:px-8 lg:py-8">
            
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-in fade-in duration-300">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                  <span className="text-xs">✓</span> Trusted Accessibility Standard Tool
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Image Contrast Lab</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-800 dark:text-slate-200">
                  Upload a design, sample exact pixels, and validate contrast for real interface text and UI states.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 7h16" /><path d="M7 4v3" /><path d="M17 4v3" /><rect x="4" y="7" width="16" height="13" rx="2" />
                  </svg>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Standard met</div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">WCAG 2.1 / 2.2 compliant</div>
                </div>
              </div>
            </div>

            <Routes>
              {/* The workbench is now routed directly */}
              <Route path="/" element={
                <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.2fr_0.8fr] animate-in fade-in duration-300">
                  <div className="space-y-6">
                    <InteractiveCanvas 
                      uploadedImage={uploadedImage} setUploadedImage={setUploadedImage}
                      isLoading={isLoading} setIsLoading={setIsLoading}
                      isHeatmapActive={isHeatmapActive} setIsHeatmapActive={setIsHeatmapActive}
                      pickMode={pickMode} setPickMode={setPickMode}
                      foreground={foreground} background={background}
                      updateColor={updateColor} addHistory={addHistory} showToast={showToast}
                    />
                    <ColorTuningPanel 
                      foreground={foreground} background={background}
                      updateColor={updateColor} swapColors={swapColors} showToast={showToast}
                    />
                  </div>

                  <div className="space-y-6 lg:sticky lg:top-8 lg:h-fit">
                    <LivePreview foreground={foreground} background={background} />
                    <ComplianceMetrics 
                      foreground={foreground} background={background} 
                      contrastResult={contrastResult} updateColor={updateColor}
                    />
                    <ContrastHistory history={history} onRestore={restoreFromHistory} />
                  </div>
                </section>
              } />
              <Route path="/guide" element={<GuideTab />} />
              <Route path="/faq" element={<FaqTab />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

          </main>
        </div>

        {toast && (
          <div 
            role="status" 
            aria-live="polite" 
            className={`fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-xl transition-all animate-in fade-in slide-in-from-bottom-4 duration-300 lg:bottom-6 ${
              toast.variant === 'success' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950' : 'bg-rose-600 text-white'
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}