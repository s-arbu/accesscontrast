import React from 'react';

interface HistoryItem {
  fg: string;
  bg: string;
  ratio: number;
}

interface ContrastHistoryProps {
  history: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
}

export function ContrastHistory({ history, onRestore }: ContrastHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">No color samples saved yet. Use the color picker to record swatches.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_45px_-24px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Sample history</h2>
      </div>
      <div className="space-y-2">
        {history.map((item, idx) => (
          <button
            key={`${item.fg}-${item.bg}-${idx}`}
            type="button"
            onClick={() => onRestore(item)}
            className="w-full flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-left transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="h-6 w-6 rounded-full border border-white dark:border-slate-900 shadow-sm" style={{ backgroundColor: item.fg }} />
                <div className="h-6 w-6 rounded-full border border-white dark:border-slate-900 shadow-sm" style={{ backgroundColor: item.bg }} />
              </div>
              <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                {item.fg} / {item.bg}
              </div>
            </div>
            <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${item.ratio >= 4.5 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'}`}>
              {item.ratio.toFixed(1)}:1
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}