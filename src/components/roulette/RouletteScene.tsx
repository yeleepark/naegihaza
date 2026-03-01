'use client';

import { WheelSegment, SpinConfig, Participant } from '@/types/roulette';
import { useRouletteWheel } from '@/hooks/useRouletteWheel';

type RouletteSceneProps = {
  segments: WheelSegment[];
  participants: Participant[];
  spinConfig?: SpinConfig;
  onSpinComplete: () => void;
  onSegmentCross?: () => void;
};

export default function RouletteScene(props: RouletteSceneProps) {
  const { canvasRef } = useRouletteWheel(props);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      style={{ backgroundColor: '#fef9c3' }}
    />
  );
}
