'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type HowToPlayProps = {
  stepsKey: string;
};

export default function HowToPlay({ stepsKey }: HowToPlayProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const steps = t(stepsKey, { returnObjects: true }) as string[];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center text-lg"
        aria-label={t('common.howToPlay')}
      >
        ?
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />

          <div
            className="relative bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-game text-lg font-black text-black">
                {t('common.howToPlay')}
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/50 hover:text-black transition-colors"
              >
                ✕
              </button>
            </div>

            <ol className="space-y-3">
              {steps.map((step, i) => (
                <li key={i} className="font-game flex items-start gap-3 text-sm text-black/80">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="leading-6">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </>
  );
}
