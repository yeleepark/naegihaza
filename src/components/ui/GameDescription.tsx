'use client';

import { useTranslation } from 'react-i18next';

type FaqItem = {
  q: string;
  a: string;
};

type GameDescriptionProps = {
  gameKey: string;
};

export default function GameDescription({ gameKey }: GameDescriptionProps) {
  const { t } = useTranslation();

  const introTitle = t(`${gameKey}.description.intro.title`);
  const introP1 = t(`${gameKey}.description.intro.p1`);
  const introP2 = t(`${gameKey}.description.intro.p2`);

  const rulesTitle = t(`${gameKey}.description.rules.title`);
  const rulesItems = t(`${gameKey}.description.rules.items`, { returnObjects: true }) as string[];

  const tipsTitle = t(`${gameKey}.description.tips.title`);
  const tipsItems = t(`${gameKey}.description.tips.items`, { returnObjects: true }) as string[];

  const faqTitle = t(`${gameKey}.description.faq.title`);
  const faqItems = t(`${gameKey}.description.faq.items`, { returnObjects: true }) as FaqItem[];

  return (
    <article className="w-full max-w-2xl mx-auto px-4 pb-8">
      <section className="mb-8">
        <h2 className="font-game text-xl font-black text-black mb-4">{introTitle}</h2>
        <p className="font-game text-sm text-black/85 leading-relaxed mb-3">{introP1}</p>
        <p className="font-game text-sm text-black/85 leading-relaxed">{introP2}</p>
      </section>

      <section className="mb-8">
        <h2 className="font-game text-xl font-black text-black mb-4">{rulesTitle}</h2>
        <ol className="space-y-2">
          {rulesItems.map((item, i) => (
            <li key={i} className="font-game flex items-start gap-3 text-sm text-black/85">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-black/10 flex items-center justify-center text-xs font-bold text-black/60">
                {i + 1}
              </span>
              <span className="leading-6">{item}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="font-game text-xl font-black text-black mb-4">{tipsTitle}</h2>
        <ul className="space-y-2">
          {tipsItems.map((item, i) => (
            <li key={i} className="font-game flex items-start gap-3 text-sm text-black/85">
              <span className="flex-shrink-0 text-black/40">•</span>
              <span className="leading-5">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-game text-xl font-black text-black mb-4">{faqTitle}</h2>
        <dl className="space-y-4">
          {faqItems.map((item, i) => (
            <div key={i}>
              <dt className="font-game text-sm font-bold text-black mb-1">Q. {item.q}</dt>
              <dd className="font-game text-sm text-black/85 leading-relaxed pl-6">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
