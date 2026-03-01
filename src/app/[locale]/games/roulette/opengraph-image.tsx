import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Roulette - RandomGame.zip';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fef9c3',
          gap: '16px',
        }}
      >
        <span style={{ fontSize: 120 }}>🎯</span>
        <span
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#1a1a1a',
            letterSpacing: '-0.02em',
          }}
        >
          Roulette
        </span>
        <span
          style={{
            fontSize: 36,
            color: '#555555',
          }}
        >
          RandomGame.zip
        </span>
      </div>
    ),
    { ...size },
  );
}
