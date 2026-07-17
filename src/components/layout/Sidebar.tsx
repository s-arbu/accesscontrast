import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Sidebar({ isDark, setIsDark }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItemClass = ({ isActive }: { isActive?: boolean }) =>
    `group flex flex-col items-center justify-center gap-1.5 p-2 w-full rounded-2xl transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ` +
    (isActive
      ? "text-blue-700 bg-blue-100/50 dark:text-blue-400 dark:bg-blue-900/40 font-bold"
      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60 font-semibold");

  const icons = {
    lab: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 8h.01M4 20h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" /><path d="m2 16 5-5 6.5 6.5M14 14l3-3 5 5" />
      </svg>
    ),
    guide: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" /><path d="M6 6h10M6 10h10" />
      </svg>
    ),
    faq: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" />
      </svg>
    ),
    theme: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3v2" /><path d="M12 19v2" /><path d="M4.93 4.93l1.41 1.41" /><path d="M17.66 17.66l1.41 1.41" /><path d="M3 12h2" /><path d="M19 12h2" /><path d="M4.93 19.07l1.41-1.41" /><path d="M17.66 6.34l1.41-1.41" /><circle cx="12" cy="12" r="4" />
      </svg>
    ),
    github: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    ),
    menu: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
      </svg>
    ),
    issue: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>
    )
  };

  const tabs = [
    { path: '/', label: 'Lab', icon: icons.lab },
    { path: '/guide', label: 'Guide', icon: icons.guide },
    { path: '/faq', label: 'FAQ', icon: icons.faq }
  ];

  return (
    <>
      {/* Mobile nav */}
      <aside className="fixed inset-x-0 bottom-0 z-50 flex h-20 items-center justify-around border-t border-slate-200 bg-white/90 px-2 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 lg:hidden">
        {tabs.map((tab) => (
          <div key={tab.label} className="w-1/4 px-1">
            <NavLink to={tab.path} aria-label={`Open ${tab.label} tab`} onClick={() => setIsMobileMenuOpen(false)} className={navItemClass}>
              {tab.icon}
              <span className="text-[9px] uppercase tracking-widest">{tab.label}</span>
            </NavLink>
          </div>
        ))}
        
        {/* Mobile menu button */}
        <div className="w-1/4 px-1 relative flex justify-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className={navItemClass({ isActive: isMobileMenuOpen })}
          >
            {icons.menu}
            <span className="text-[9px] uppercase tracking-widest">Menu</span>
          </button>

          {/* Mobile dropdown menu */}
          {isMobileMenuOpen && (
            <>
              {/* Invisible backdrop for outside clicks */}
              <div className="fixed inset-0 -z-10" onClick={() => setIsMobileMenuOpen(false)} />
              
              <div className="absolute bottom-[calc(100%+16px)] right-2 w-56 origin-bottom-right rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in zoom-in-95 duration-200 dark:border-slate-800 dark:bg-slate-950">
                <button 
                  onClick={() => { setIsDark(prev => !prev); setIsMobileMenuOpen(false); }} 
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
                >
                  {icons.theme}
                  Toggle Dark Mode
                </button>
                <div className="my-1 h-px w-full bg-slate-100 dark:bg-slate-800" />
                <a 
                  href="https://github.com/s-arbu/accesscontrast" 
                  target="_blank" rel="noreferrer"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
                >
                  {icons.github}
                  Open Repository
                </a>
                <a 
                  href="https://github.com/s-arbu/accesscontrast/issues" 
                  target="_blank" rel="noreferrer"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
                >
                  {icons.issue}
                  Leave Feedback
                </a>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden w-28 shrink-0 flex-col items-center justify-between border-r border-slate-200 bg-white py-8 dark:border-slate-800/60 dark:bg-slate-950 lg:flex lg:fixed lg:inset-y-0 lg:left-0 z-40">
        <div className="flex w-full flex-col items-center gap-10">
          <div className="group flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 shadow-sm transition-all duration-300 hover:rotate-3 hover:scale-105 hover:bg-white hover:shadow-lg dark:bg-slate-900 dark:hover:bg-slate-800">
            <img src="/logo.svg" alt="AccessContrast Logo" className="h-10 w-10 transition-transform duration-300 group-hover:scale-110" />
          </div>
          
          <nav className="flex w-full flex-col gap-4 px-4">
            {tabs.map((tab) => (
              <NavLink key={tab.label} to={tab.path} aria-label={`Open ${tab.label} tab`} className={navItemClass}>
                {tab.icon}
                <span className="text-[9px] uppercase tracking-widest">{tab.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex w-full flex-col items-center gap-4 px-4">
          {/* Desktop theme toggle */}
          <button aria-label="Toggle dark mode" onClick={() => setIsDark(prev => !prev)} className={navItemClass({ isActive: false })}>
            {icons.theme}
          </button>
          
          {/* Desktop GitHub dropdown */}
          <div className="group relative w-full">
            <button className={navItemClass({ isActive: false })}>
              {icons.github}
            </button>
            {/* "before:-left-8 before:w-8" extends the invisible hover bridge */}
            <div className="pointer-events-none absolute left-[calc(100%+12px)] bottom-0 z-50 w-48 rounded-2xl border border-slate-200 bg-white p-1.5 opacity-0 shadow-xl transition-all duration-200 before:absolute before:-left-8 before:top-0 before:h-full before:w-8 before:content-[''] group-hover:pointer-events-auto group-hover:translate-x-2 group-hover:opacity-100 dark:border-slate-800 dark:bg-slate-950">
              <a 
                href="https://github.com/s-arbu/accesscontrast" 
                target="_blank" rel="noreferrer"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
              >
                {icons.github}
                Open Repository
              </a>
              <a 
                href="https://github.com/s-arbu/accesscontrast/issues" 
                target="_blank" rel="noreferrer"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
              >
                {icons.issue}
                Leave Feedback
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}