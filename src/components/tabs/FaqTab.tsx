import React from 'react';
import { faqData } from '../../data/seoContent';

export function FaqTab() {
  // Schema.org for direct FAQ snippets in search results
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.items.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  return (
    <section className="animate-in fade-in duration-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60 md:p-10">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">{faqData.title}</h2>
          <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{faqData.description}</p>
        </div>

        <div className="space-y-4">
          {faqData.items.map((item, index) => (
            <details key={index} className="group rounded-[20px] border border-slate-300 bg-slate-50 transition-all duration-300 open:bg-white open:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:open:bg-slate-800/80">
              <summary className="flex cursor-pointer items-start justify-between p-5 font-semibold list-none text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-[20px] dark:text-white">
                <span className="pr-6 mt-1 flex-1 min-w-0 break-words hyphens-auto">{item.q}</span>
                <span className="flex shrink-0 h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700 transition-transform duration-300 group-open:rotate-180 group-open:bg-blue-100 group-open:text-blue-700 dark:bg-slate-700 dark:text-slate-200 dark:group-open:bg-blue-900/80 dark:group-open:text-blue-300">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </span>
              </summary>
              <div className="px-5 pb-6 pt-2 text-sm leading-relaxed text-slate-800 dark:text-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}