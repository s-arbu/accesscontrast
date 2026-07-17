import React, { useMemo } from 'react';
import type { ColorRgb } from '../../utils/contrast';
import { rgbToHex, adjustLightness, calculateContrast } from '../../utils/contrast';

interface ComplianceMetricsProps {
  foreground: ColorRgb;
  background: ColorRgb;
  contrastResult: { ratio: number; aa: boolean; aaLarge: boolean; aaa: boolean; aaaLarge: boolean; };
  updateColor: (next: ColorRgb, target: 'foreground' | 'background') => void;
}

export function ComplianceMetrics({ foreground, background, contrastResult, updateColor }: ComplianceMetricsProps) {
  
  // Keeps suggestion logic memoized
  const suggestions = useMemo(() => {
    if (contrastResult.aaa) return null;

    const findPassingColor = (keep: ColorRgb, change: ColorRgb, targetRatio: number): ColorRgb | null => {
      let bestMatch: ColorRgb | null = null;
      let smallestDiff = 100;
      const currentL = (change.r * 0.2126 + change.g * 0.7152 + change.b * 0.0722) / 255 * 100;

      for (let i = 0; i <= 100; i++) {
        const testColor = adjustLightness(change, i);
        const testContrast = calculateContrast(keep, testColor);
        if (testContrast.ratio >= targetRatio) {
          const diff = Math.abs(currentL - i);
          if (diff < smallestDiff) {
            smallestDiff = diff;
            bestMatch = testColor;
          }
        }
      }
      return bestMatch;
    };

    return {
      aaFg: !contrastResult.aa ? findPassingColor(background, foreground, 4.5) : null,
      aaBg: !contrastResult.aa ? findPassingColor(foreground, background, 4.5) : null,
      aaaFg: !contrastResult.aaa ? findPassingColor(background, foreground, 7.0) : null,
      aaaBg: !contrastResult.aaa ? findPassingColor(foreground, background, 7.0) : null,
    };
  }, [foreground, background, contrastResult]);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_45px_-24px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Compliance metrics</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Computed with WCAG relative luminance.</p>
        </div>
        <div className="rounded-[20px] bg-slate-900 px-3 py-2 text-white dark:bg-slate-100 dark:text-slate-900">
          <span className="text-2xl font-semibold">{contrastResult.ratio.toFixed(2)}</span>
          <span className="ml-1 text-xs font-semibold">:1</span>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { title: 'Normal text', detail: 'Smaller than 18pt', pass: contrastResult.aa, aaaPass: contrastResult.aaa, showAaa: true },
          { title: 'Large headings', detail: 'Above 18pt', pass: contrastResult.aaLarge, aaaPass: contrastResult.aaaLarge, showAaa: true },
          { title: 'UI boundaries', detail: 'Focus rings and icons', pass: contrastResult.aaLarge, aaaPass: false, showAaa: false },
        ].map(item => (
          <div key={item.title} className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/40">
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">{item.title}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{item.detail}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.pass ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300'}`}>
                {item.pass ? '✓ AA pass' : '✗ AA fail'}
              </span>
              {item.showAaa && (
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.aaaPass ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300'}`}>
                  {item.aaaPass ? '✓ AAA pass' : '✗ AAA fail'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {suggestions && (suggestions.aaFg || suggestions.aaBg || suggestions.aaaFg || suggestions.aaaBg) && (
        <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-200 border-t border-slate-200 pt-5 dark:border-slate-800">
          <div className="mb-3 flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Suggested Fixes</h3>
          </div>
          
          <div className="flex flex-col gap-4">
            {!contrastResult.aa && (suggestions.aaFg || suggestions.aaBg) && (
              <div className="grid gap-3 sm:grid-cols-2">
                {suggestions.aaFg && (
                  <button 
                    onClick={() => updateColor(suggestions.aaFg!, 'foreground')} 
                    className="group flex flex-col items-start rounded-[16px] border border-emerald-200 bg-emerald-50 p-3 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md hover:bg-emerald-100/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30 dark:hover:shadow-black/40"
                  >
                    <span className="mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Fix Text (AA)</span>
                    <div className="text-sm font-mono font-semibold text-slate-900 dark:text-slate-200">{rgbToHex(suggestions.aaFg)}</div>
                  </button>
                )}
                {suggestions.aaBg && (
                  <button onClick={() => updateColor(suggestions.aaBg!, 'background')} className="group flex flex-col items-start rounded-[16px] border border-amber-200 bg-amber-50 p-3 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md hover:bg-amber-100/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-amber-900/40 dark:bg-amber-950/20 dark:hover:bg-amber-900/30 dark:hover:shadow-black/40">
                    <span className="mb-2 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">Fix Bg (AA)</span>
                    <div className="text-sm font-mono font-semibold text-slate-900 dark:text-slate-200">{rgbToHex(suggestions.aaBg)}</div>
                  </button>
                )}
              </div>
            )}
            {!contrastResult.aaa && (suggestions.aaaFg || suggestions.aaaBg) && (
              <div className="grid gap-3 sm:grid-cols-2">
                {suggestions.aaaFg && (
                  <button onClick={() => updateColor(suggestions.aaaFg!, 'foreground')} className="group flex flex-col items-start rounded-[16px] border border-emerald-200 bg-emerald-50 p-3 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md hover:bg-emerald-100/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                    <span className="mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Fix Text (AAA)</span>
                    <div className="text-sm font-mono font-semibold text-slate-900 dark:text-slate-200">{rgbToHex(suggestions.aaaFg)}</div>
                  </button>
                )}
                {suggestions.aaaBg && (
                  <button onClick={() => updateColor(suggestions.aaaBg!, 'background')} className="group flex flex-col items-start rounded-[16px] border border-emerald-200 bg-emerald-50 p-3 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md hover:bg-emerald-100/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                    <span className="mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Fix Bg (AAA)</span>
                    <div className="text-sm font-mono font-semibold text-slate-900 dark:text-slate-200">{rgbToHex(suggestions.aaaBg)}</div>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}