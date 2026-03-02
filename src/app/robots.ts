import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [
      'https://www.freerandomgame.com/sitemap/ko.xml',
      'https://www.freerandomgame.com/sitemap/en.xml',
      'https://www.freerandomgame.com/sitemap/zh.xml',
      'https://www.freerandomgame.com/sitemap/es.xml',
    ],
  };
}
