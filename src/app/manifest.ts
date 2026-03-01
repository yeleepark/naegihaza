import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RandomGame.zip - 랜덤게임.zip',
    short_name: 'RandomGame.zip',
    description: '친구들과 함께 즐기는 무료 온라인 랜덤 게임 플랫폼',
    start_url: '/',
    display: 'standalone',
    background_color: '#fef3e2',
    theme_color: '#fef3e2',
    icons: [
      {
        src: '/icon',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['games', 'entertainment'],
    lang: 'ko',
    dir: 'ltr',
    orientation: 'portrait',
  };
}
