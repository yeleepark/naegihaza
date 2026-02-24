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
    <div className="mt-4 border-t border-black/10 pt-4">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="font-game w-full flex items-center justify-between text-sm font-bold text-black/50 hover:text-black/80 transition-colors"
      >
        <span>{t('common.howToPlay')}</span>
        <span
          className="text-xs transition-transform duration-200"
          style={{ display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▾
        </span>
      </button>

      {open && (
        <ol className="mt-3 space-y-2">
          {steps.map((step, i) => (
            <li key={i} className="font-game flex items-start gap-2 text-sm text-black/70">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-xs font-bold text-black/60">
                {i + 1}
              </span>
              <span className="leading-5">{step}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
