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

export function generateSiteNavSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: '내기하자 게임 메뉴',
    url: 'https://naegihaza.com',
    hasPart: [
      { '@type': 'WebPage', name: '룰렛', url: 'https://naegihaza.com/ko/games/roulette' },
      { '@type': 'WebPage', name: '사다리타기', url: 'https://naegihaza.com/ko/games/ladder' },
      { '@type': 'WebPage', name: '주사위', url: 'https://naegihaza.com/ko/games/dice' },
      { '@type': 'WebPage', name: '폭탄 게임', url: 'https://naegihaza.com/ko/games/bomb' },
      { '@type': 'WebPage', name: '슬롯머신', url: 'https://naegihaza.com/ko/games/slot' },
      { '@type': 'WebPage', name: '벽돌깨기', url: 'https://naegihaza.com/ko/games/breakout' },
    ],
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
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  };
}
