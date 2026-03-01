import { MetadataRoute } from 'next';
import { locales } from '@/i18n/settings';

const baseUrl = 'https://naegihaza.com';
const gameRoutes = ['', '/games/roulette', '/games/breakout', '/games/slot', '/games/bomb'];
const legalRoutes = ['/privacy', '/terms'];

export async function generateSitemaps() {
  return locales.map((locale) => ({ id: locale }));
}

export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  const locale = id;
  const currentDate = new Date();

  const entries: MetadataRoute.Sitemap = [];

  gameRoutes.forEach((route) => {
    entries.push({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: route === '' ? 1.0 : 0.9,
      alternates: {
        languages: {
          ...Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}${route}`]),
          ),
          'x-default': `${baseUrl}/en${route}`,
        },
      },
    });
  });

  legalRoutes.forEach((route) => {
    entries.push({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
      alternates: {
        languages: {
          ...Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}${route}`]),
          ),
          'x-default': `${baseUrl}/en${route}`,
        },
      },
    });
  });

  return entries;
}
