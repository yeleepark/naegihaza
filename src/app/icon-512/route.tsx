import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fef3e2',
          borderRadius: '100px',
          fontSize: 360,
        }}
      >
        🍀
      </div>
    ),
    { width: 512, height: 512 },
  );
}
