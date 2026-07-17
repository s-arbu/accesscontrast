import React from 'react';
import type { ColorRgb } from '../../utils/contrast';
import { rgbToHex, hexToRgb } from '../../utils/contrast';

// HSL fix for smooth slider motion
const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToRgb = (h: number, s: number, l: number): ColorRgb => {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return { r: Math.round(255 * f(0)), g: Math.round(255 * f(8)), b: Math.round(255 * f(4)) };
};
// ----------------------------------------

// Small component for the animated color square
const AnimatedColorSquare = ({ hex }: { hex: string }) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [hex]);

  return (
    <div 
      className={`h-14 w-14 shrink-0 rounded-2xl border border-slate-200/80 shadow-inner transition-all duration-300 ease-out dark:border-slate-900/50 ${
        isAnimating ? '-translate-y-2 scale-110 shadow-lg dark:shadow-black/50' : ''
      }`} 
      style={{ backgroundColor: hex }} 
    />
  );
};

interface ColorTuningPanelProps {
  foreground: ColorRgb;
  background: ColorRgb;
  updateColor: (next: ColorRgb, target: 'foreground' | 'background') => void;
  swapColors: () => void;
  showToast: (msg: string, variant: 'success' | 'error') => void;
}

export function ColorTuningPanel({ foreground, background, updateColor, swapColors, showToast }: ColorTuningPanelProps) {
  // Shared card styling
  const panelCard = 'rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60 animate-in fade-in zoom-in-95 duration-500';

  const copyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      showToast(`Copied ${hex}`, 'success');
    } catch (err) {
      showToast('Copy failed', 'error');
    }
  };

  const updateHexValue = (value: string, target: 'foreground' | 'background') => {
    const parsed = hexToRgb(value);
    if (parsed) updateColor(parsed, target);
  };

  const renderColorControl = (color: ColorRgb, target: 'foreground' | 'background') => {
    const hex = rgbToHex(color);
    
    // Use real HSL so the slider moves smoothly
    const hsl = rgbToHsl(color.r, color.g, color.b);

    const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newL = Number(e.target.value);
      updateColor(hslToRgb(hsl.h, hsl.s, newL), target);
    };

    return (
      <div className="rounded-[20px] border border-slate-200/80 bg-slate-50/50 p-5 transition-colors hover:border-slate-300 dark:border-slate-700/50 dark:bg-slate-800/40 dark:hover:border-slate-600">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            {target}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <AnimatedColorSquare hex={hex} />
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(hsl.l)}
              onChange={handleSlider}
              aria-label={`Adjust ${target} lightness`}
              className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-slate-700"
            />
            <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span>Darker</span>
              <span>Lighter</span>
            </div>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Hex value
            </label>
            <div className="relative group">
              <input
                value={hex}
                onChange={e => updateHexValue(e.target.value, target)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-mono font-semibold text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white group-hover:border-slate-300 dark:group-hover:border-slate-600"
              />
              <button
                type="button"
                onClick={() => copyHex(hex)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="10" height="10" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Opacity
            </label>
            <input 
              value="100%" disabled 
              className="w-full cursor-not-allowed rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm font-mono font-semibold text-slate-400 opacity-70 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-500" 
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={panelCard}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-900 dark:text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Fine-tune colors</h2>
        </div>
        <button 
          type="button" onClick={swapColors} title="Swap colors"
          className="group rounded-xl p-2 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m16 3 4 4-4 4" /><path d="M20 7H4" /><path d="m8 21-4-4 4-4" /><path d="M4 17h16" />
          </svg>
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {renderColorControl(foreground, 'foreground')}
        {renderColorControl(background, 'background')}
      </div>
    </div>
  );
}