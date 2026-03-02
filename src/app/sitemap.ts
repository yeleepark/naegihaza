import { MetadataRoute } from 'next';
import { locales } from '@/i18n/settings';

const baseUrl = 'https://www.freerandomgame.com';
const gameRoutes = ['', '/games/roulette', '/games/breakout', '/games/slot', '/games/bomb', '/games/horse'];
const legalRoutes = ['/privacy', '/terms'];

const lastModifiedDates: Record<string, Date> = {
  '': new Date('2026-03-02'),
  '/games/roulette': new Date('2026-03-02'),
  '/games/breakout': new Date('2026-03-02'),
  '/games/slot': new Date('2026-03-02'),
  '/games/bomb': new Date('2026-03-02'),
  '/games/horse': new Date('2026-03-02'),
  '/privacy': new Date('2025-01-15'),
  '/terms': new Date('2025-01-15'),
};

export async function generateSitemaps() {
  return locales.map((locale) => ({ id: locale }));
}

export default async function sitemap(
  props: Promise<{ id: string }>,
): Promise<MetadataRoute.Sitemap> {
  const { id } = await props;
  const locale = id;

  const entries: MetadataRoute.Sitemap = [];

  gameRoutes.forEach((route) => {
    entries.push({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: lastModifiedDates[route],
      changeFrequency: 'weekly',
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
      lastModified: lastModifiedDates[route],
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
