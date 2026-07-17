import React from 'react';
import { guideData } from '../../data/seoContent';

export function GuideTab() {
  // Schema.org for rich snippets in Google
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": guideData.title,
    "description": guideData.description,
    "step": guideData.steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.title,
      "text": step.description
    }))
  };

  return (
    <section className="animate-in fade-in duration-300">
      {/* Hidden injection for search engines */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60 md:p-10">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">{guideData.title}</h2>
          <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{guideData.description}</p>
        </div>
        
        <ol className="grid gap-6 md:grid-cols-2 list-none p-0 m-0">
          {guideData.steps.map((step, index) => (
            <li key={index} className="group relative rounded-2xl border border-slate-300 bg-slate-50 p-6 transition-all duration-300 hover:border-blue-300 hover:bg-white hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 dark:hover:bg-slate-700">
              <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}