'use client';

import { useTranslation } from 'react-i18next';

export default function HomeAbout() {
  const { t } = useTranslation();

  return (
    <section className="min-h-screen min-h-[100dvh] h-screen h-[100dvh] flex items-center justify-center px-6 py-16 md:py-24 snap-start snap-always sa-animation sa-fade-up bg-[#e8f4f8]">
      <div className="max-w-2xl w-full text-center">
        <h2 className="font-game text-2xl md:text-3xl font-black text-black mb-6">
          {t('home.about.title')}
        </h2>
        <p className="font-game text-base md:text-lg text-black/80 leading-relaxed whitespace-pre-line">
          {t('home.about.description')}
        </p>
      </div>
    </section>
  );
}
