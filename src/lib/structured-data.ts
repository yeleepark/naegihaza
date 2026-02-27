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
  roulette: { ko: '룰렛', en: 'Roulette', zh: '转盘', es: 'Ruleta' },
  ladder:   { ko: '사다리타기', en: 'Ladder', zh: '爬梯游戏', es: 'Escalera' },
  dice:     { ko: '주사위', en: 'Dice', zh: '骰子', es: 'Dados' },
  bomb:     { ko: '폭탄 게임', en: 'Bomb Pick', zh: '抽炸弹', es: 'Bomba' },
  slot:     { ko: '슬롯머신', en: 'Slot Machine', zh: '老虎机', es: 'Tragamonedas' },
  breakout: { ko: '벽돌깨기', en: 'Breakout', zh: '打砖块', es: 'Breakout' },
};

const siteNavMenuName: Record<string, string> = {
  ko: '내기하자 게임 메뉴',
  en: 'Naegihaza Game Menu',
  zh: 'Naegihaza 游戏菜单',
  es: 'Menú de Juegos Naegihaza',
};

export function generateSiteNavSchema(locale: string = 'en') {
  const games = ['roulette', 'ladder', 'dice', 'bomb', 'slot', 'breakout'];
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
