type FaqItem = {
  q: string;
  a: string;
};

type GameDescriptionProps = {
  description: {
    intro: { title: string; p1: string; p2: string };
    rules: { title: string; items: string[] };
    tips: { title: string; items: string[] };
    faq: { title: string; items: FaqItem[] };
  };
};

export default function GameDescription({ description }: GameDescriptionProps) {
  const { intro, rules, tips, faq } = description;

  return (
    <article className="w-full max-w-2xl mx-auto px-4 pb-8">
      <section className="mb-8">
        <h2 className="font-game text-xl font-black text-black mb-4">{intro.title}</h2>
        <p className="font-game text-sm text-black/85 leading-relaxed mb-3">{intro.p1}</p>
        <p className="font-game text-sm text-black/85 leading-relaxed">{intro.p2}</p>
      </section>

      <section className="mb-8">
        <h2 className="font-game text-xl font-black text-black mb-4">{rules.title}</h2>
        <ol className="space-y-2">
          {rules.items.map((item, i) => (
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
        <h2 className="font-game text-xl font-black text-black mb-4">{tips.title}</h2>
        <ul className="space-y-2">
          {tips.items.map((item, i) => (
            <li key={i} className="font-game flex items-start gap-3 text-sm text-black/85">
              <span className="flex-shrink-0 text-black/40">•</span>
              <span className="leading-5">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-game text-xl font-black text-black mb-4">{faq.title}</h2>
        <dl className="space-y-4">
          {faq.items.map((item, i) => (
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
