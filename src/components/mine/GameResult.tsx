'use client';

import { useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { MineResult } from '@/types/mine';
import { useTranslation } from 'react-i18next';
import { useSound } from '@/hooks/useSound';

type GameResultProps = {
  result: MineResult;
  onPlayAgain: () => void;
  onReset: () => void;
};

export default function GameResult({
  result,
  onPlayAgain,
  onReset,
}: GameResultProps) {
  const { t } = useTranslation();
  const { playBreakoutWin } = useSound();

  useEffect(() => {
    playBreakoutWin();
  }, [playBreakoutWin]);

  return (
    <div className="flex items-center justify-center h-full relative">
      <Card className="max-w-md w-full relative z-10 animate-result-appear">
        <div className="text-center">
          <h2 className="font-game text-2xl font-black text-black mb-6">
            {t('common.resultTitle')}
          </h2>
          <div
            className="rounded-xl p-8 mb-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-result-glow"
            style={{ backgroundColor: result.loserColor }}
          >
            <p className="font-game text-4xl md:text-5xl font-black text-black break-words">
              {result.loserName}
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onPlayAgain}
              variant="primary"
              className="w-full lowercase"
            >
              {t('common.playAgain')}
            </Button>
            <Button
              onClick={onReset}
              variant="secondary"
              className="w-full lowercase"
            >
              {t('common.reset')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
