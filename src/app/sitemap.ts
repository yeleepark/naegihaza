import { MetadataRoute } from 'next';
import { locales } from '@/i18n/settings';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://naegihaza.com';
  const currentDate = new Date();

  const gameRoutes = ['', '/games/roulette', '/games/dice', '/games/ladder', '/games/bomb', '/games/breakout'];
  const legalRoutes = ['/privacy', '/terms'];

  const sitemap: MetadataRoute.Sitemap = [];

  // Generate entries for all locales - game pages
  locales.forEach((locale) => {
    gameRoutes.forEach((route) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: route === '' ? 1.0 : 0.9,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}${route}`])
          ),
        },
      });
    });

    // Legal pages with lower priority
    legalRoutes.forEach((route) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.3,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}${route}`])
          ),
        },
      });
    });
  });

  return sitemap;
}
