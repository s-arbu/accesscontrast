import React, { useState, useEffect } from 'react';
import type { ColorRgb } from '../../utils/contrast';
import { rgbToHex } from '../../utils/contrast';

export function LivePreview({ foreground, background }: { foreground: ColorRgb; background: ColorRgb }) {
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const fgHex = rgbToHex(foreground);
  const bgHex = rgbToHex(background);

  // Trigger for the jump-up animation
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [fgHex, bgHex]);

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
      <div 
        onClick={() => setIsPreviewCollapsed(!isPreviewCollapsed)}
        className="flex cursor-pointer items-center justify-between select-none border-b border-slate-200 pb-4 dark:border-slate-800"
      >
        <div className="w-4" />
        <h2 className="text-center flex-1 text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
          Live Preview
        </h2>
        <svg viewBox="0 0 24 24" className={`h-4 w-4 text-slate-900 dark:text-white transition-transform duration-200 ${isPreviewCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </div>

      {!isPreviewCollapsed && (
        <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <div 
            className={`relative overflow-hidden rounded-[20px] border border-slate-200 bg-slate-50 p-6 transition-all duration-300 ease-out dark:border-slate-800 ${
              isAnimating ? '-translate-y-2 scale-[1.02] shadow-xl dark:shadow-black/50' : 'shadow-sm'
            }`} 
            style={{ backgroundColor: bgHex, color: fgHex }}
          >
            <h3 className="text-lg font-bold tracking-tight mb-4">Dashboard Component</h3>
            <p className="mb-5 text-sm opacity-90 leading-relaxed">
              This container simulates how your selected color contrast pairs look on structural UI elements and typography.
            </p>
            <button className="rounded-xl px-4 py-2 text-xs font-semibold shadow-sm" style={{ backgroundColor: fgHex, color: bgHex }}>
              Action Button
            </button>
          </div>
        </div>
      )}
    </div>
  );
}