type FaqItem = {
  q: string;
  a: string;
};

type GameKey = 'roulette' | 'breakout' | 'slot' | 'bomb';

const ALL_GAMES: { key: GameKey; emoji: string; names: Record<string, string> }[] = [
  { key: 'roulette', emoji: '🎯', names: { ko: '룰렛돌리기', en: 'Roulette', zh: '转盘', es: 'Ruleta' } },
  { key: 'breakout', emoji: '🧱', names: { ko: '벽돌깨기', en: 'Breakout', zh: '打砖块', es: 'Breakout' } },
  { key: 'slot', emoji: '🎰', names: { ko: '슬롯머신', en: 'Slot Machine', zh: '老虎机', es: 'Tragamonedas' } },
  { key: 'bomb', emoji: '💣', names: { ko: '폭탄돌리기', en: 'Bomb Pass', zh: '传炸弹', es: 'Pasa la Bomba' } },
];

const RELATED_TITLE: Record<string, string> = {
  ko: '다른 게임도 해보세요',
  en: 'Try Other Games',
  zh: '试试其他游戏',
  es: 'Prueba otros juegos',
};

type GameDescriptionProps = {
  description: {
    intro: { title: string; p1: string; p2: string };
    rules: { title: string; items: string[] };
    tips: { title: string; items: string[] };
    faq: { title: string; items: FaqItem[] };
  };
  locale?: string;
  currentGame?: GameKey;
};

export default function GameDescription({ description, locale = 'en', currentGame }: GameDescriptionProps) {
  const { intro, rules, tips, faq } = description;
  const relatedGames = currentGame
    ? ALL_GAMES.filter((g) => g.key !== currentGame)
    : [];

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

      <section className="mb-8">
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

      {relatedGames.length > 0 && (
        <section>
          <h2 className="font-game text-xl font-black text-black mb-4">
            {RELATED_TITLE[locale] || RELATED_TITLE.en}
          </h2>
          <div className="flex flex-wrap gap-3">
            {relatedGames.map((game) => (
              <a
                key={game.key}
                href={`/${locale}/games/${game.key}`}
                className="font-game text-sm font-bold text-black/80 border border-black/15 rounded-lg px-4 py-2.5 hover:bg-black/5 transition-colors"
              >
                {game.emoji} {game.names[locale] || game.names.en}
              </a>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
