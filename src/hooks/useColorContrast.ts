import { useState, useMemo, useRef } from 'react';
import { calculateContrast, hexToRgb, type ColorRgb } from '../utils/contrast';

export type PickMode = 'foreground' | 'background' | null;
export type Tab = 'image' | 'guide' | 'faq';
export type HistoryItem = { fg: string; bg: string; ratio: number };

const defaultForeground: ColorRgb = { r: 79, g: 70, b: 229 };
const defaultBackground: ColorRgb = { r: 243, g: 244, b: 246 };

export const useColorContrast = () => {
  const [foreground, setForeground] = useState<ColorRgb>(defaultForeground);
  const [background, setBackground] = useState<ColorRgb>(defaultBackground);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [pickMode, setPickMode] = useState<PickMode>('foreground');
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);
  
  const toastTimerRef = useRef<number | null>(null);

  const contrastResult = useMemo(() => calculateContrast(foreground, background), [foreground, background]);

  const showToast = (message: string, variant: 'success' | 'error') => {
    setToast({ message, variant });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3200);
  };

  const addHistory = (nextItem: HistoryItem) => {
    setHistory(prev => {
      const idx = prev.findIndex(h => h.fg === nextItem.fg && h.bg === nextItem.bg);
      const copy = prev.slice();
      if (idx !== -1) copy.splice(idx, 1);
      copy.unshift(nextItem);
      if (copy.length > 5) copy.splice(5);
      return copy;
    });
  };

  const swapColors = () => {
    setForeground(background);
    setBackground(foreground);
  };

  const updateColor = (next: ColorRgb, target: 'foreground' | 'background') => {
    if (target === 'foreground') setForeground(next);
    else setBackground(next);
  };

  const restoreFromHistory = (item: HistoryItem) => {
    const fgRgb = hexToRgb(item.fg);
    const bgRgb = hexToRgb(item.bg);
    if (fgRgb) setForeground(fgRgb);
    if (bgRgb) setBackground(bgRgb);
    showToast('Restored selected swatch configuration!', 'success');
  };

  return {
    foreground, setForeground,
    background, setBackground,
    history, setHistory, addHistory,
    contrastResult, swapColors,
    pickMode, setPickMode,
    toast, showToast,
    updateColor, restoreFromHistory
  };
};