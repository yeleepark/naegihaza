export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Naegihaza',
    alternateName: '내기하자',
    url: 'https://naegihaza.com',
    description: '친구들과 함께 즐기는 무료 온라인 내기 게임 플랫폼. 랜덤 룰렛과 주사위 굴리기',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    creator: {
      '@type': 'Person',
      name: 'Seoyoon Park',
      email: 'dev.yelee@gmail.com',
    },
    inLanguage: ['ko', 'en', 'zh', 'es'],
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '1.0.0',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
