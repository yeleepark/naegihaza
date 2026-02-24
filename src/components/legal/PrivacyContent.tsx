'use client';

import { useTranslation } from 'react-i18next';

type Section = {
  title: string;
  content: string;
};

export default function PrivacyContent() {
  const { t } = useTranslation();

  const title = t('legal.privacy.title');
  const lastUpdated = t('legal.privacy.lastUpdated');
  const sections = t('legal.privacy.sections', { returnObjects: true }) as Section[];

  return (
    <article className="max-w-3xl mx-auto">
      <h1 className="font-game text-3xl font-black text-black mb-2">{title}</h1>
      <p className="font-game text-sm text-black/50 mb-8">{lastUpdated}</p>

      {sections.map((section, i) => (
        <section key={i} className="mb-8">
          <h2 className="font-game text-lg font-bold text-black mb-3">{section.title}</h2>
          <p className="font-game text-sm text-black/85 leading-relaxed">{section.content}</p>
        </section>
      ))}
    </article>
  );
}
