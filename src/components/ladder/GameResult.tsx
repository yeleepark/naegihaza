'use client';

import { useTranslation } from 'react-i18next';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { LADDER_COLORS } from '@/utils/ladder';

type GameResultProps = {
  participants: string[];
  resultItems: string[];
  resultMap: number[]; // resultMap[startCol] = endCol
  onPlayAgain: () => void;
  onReset: () => void;
};

export default function GameResult({
  participants,
  resultItems,
  resultMap,
  onPlayAgain,
  onReset,
}: GameResultProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center w-full py-8">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🪜</div>
          <h2 className="font-game text-2xl font-black text-black">
            {t('ladder.result.title')}
          </h2>
        </div>

        <div className="space-y-3 mb-6">
          {participants.map((name, startCol) => {
            const endCol = resultMap[startCol];
            const result = resultItems[endCol] ?? '';
            const color = LADDER_COLORS[startCol % LADDER_COLORS.length];

            return (
              <div
                key={startCol}
                className="flex items-stretch rounded-xl border-4 border-black overflow-hidden"
                style={{ boxShadow: '4px 4px 0 black' }}
              >
                {/* 참가자 이름 */}
                <div
                  className="flex items-center justify-center px-4 py-3 font-game text-base font-black text-black min-w-0 flex-1"
                  style={{ backgroundColor: color }}
                >
                  <span className="truncate">{name}</span>
                </div>

                {/* 화살표 */}
                <div className="flex items-center justify-center px-3 bg-black text-white font-black text-base shrink-0">
                  →
                </div>

                {/* 결과 */}
                <div className="flex items-center justify-center px-4 py-3 bg-white font-game text-base font-black text-black min-w-0 flex-1">
                  <span className="truncate">{result}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          <Button onClick={onPlayAgain} variant="primary" className="w-full">
            {t('common.playAgain')}
          </Button>
          <Button onClick={onReset} variant="secondary" className="w-full">
            {t('common.reset')}
          </Button>
        </div>
      </Card>
    </div>
  );
}
