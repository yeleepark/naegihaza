import { MetadataRoute } from 'next';
import { locales } from '@/i18n/settings';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://naegihaza.com';
  const currentDate = new Date();

  const routes = ['', '/games/roulette', '/games/dice', '/games/ladder'];

  const sitemap: MetadataRoute.Sitemap = [];

  // Generate entries for all locales
  locales.forEach((locale) => {
    routes.forEach((route) => {
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
  });

  return sitemap;
}
