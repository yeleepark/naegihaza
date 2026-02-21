import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Naegihaza - 내기하자',
    short_name: 'Naegihaza',
    description: '친구들과 함께 즐기는 무료 온라인 내기 게임 플랫폼',
    start_url: '/',
    display: 'standalone',
    background_color: '#fef3e2',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    categories: ['games', 'entertainment'],
    lang: 'ko',
    dir: 'ltr',
    orientation: 'any',
  };
}
