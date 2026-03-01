export function generateFAQSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

const siteNavNames: Record<string, Record<string, string>> = {
  roulette: { ko: '룰렛돌리기', en: 'Roulette', zh: '转盘', es: 'Ruleta' },
  slot:     { ko: '슬롯머신', en: 'Slot Machine', zh: '老虎机', es: 'Tragamonedas' },
  breakout: { ko: '벽돌깨기', en: 'Breakout', zh: '打砖块', es: 'Breakout' },
  bomb:     { ko: '폭탄돌리기', en: 'Bomb Pass', zh: '传炸弹', es: 'Pasa la Bomba' },
};

const siteNavMenuName: Record<string, string> = {
  ko: '랜덤게임.zip 게임 메뉴',
  en: 'RandomGame.zip Game Menu',
  zh: 'RandomGame.zip 游戏菜单',
  es: 'Menú de Juegos RandomGame.zip',
};

export function generateSiteNavSchema(locale: string = 'en') {
  const games = ['roulette', 'slot', 'breakout', 'bomb'];
  return {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: siteNavMenuName[locale] || siteNavMenuName.en,
    url: 'https://naegihaza.com',
    hasPart: games.map((game) => ({
      '@type': 'WebPage',
      name: siteNavNames[game][locale] || siteNavNames[game].en,
      url: `https://naegihaza.com/${locale}/games/${game}`,
    })),
  };
}

export function generateGameSchema(
  name: string,
  description: string,
  url: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url,
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web Browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
}
