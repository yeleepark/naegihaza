'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { parseParticipantNames, validateScratchSetup } from '@/utils/scratch';
import { useTranslation } from 'react-i18next';
import HowToPlay from '@/components/ui/HowToPlay';

type GameSetupProps = {
  onStart: (names: string[], winnerCount: number) => void;
};

export default function GameSetup({ onStart }: GameSetupProps) {
  const [input, setInput] = useState<string>('');
  const [winnerCount, setWinnerCount] = useState<string>('1');
  const [error, setError] = useState<string>('');
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const names = parseParticipantNames(input);
    const winners = parseInt(winnerCount, 10);
    const validation = validateScratchSetup(names, isNaN(winners) ? 0 : winners);

    if (!validation.valid) {
      setError(t(validation.error || 'common.error.min'));
      return;
    }

    setError('');
    onStart(names, winners);
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex-1 flex items-center justify-center w-full">
      <Card className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎟️</div>
          <h2 className="font-game text-3xl font-black text-black mb-2">
            {t('scratch.title')}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-game block text-sm font-bold text-black mb-2">
              {t('common.participants')}
            </label>
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(''); }}
              placeholder={t('common.placeholder')}
              className="font-game w-full px-4 py-3 rounded-lg bg-white border-2 border-black text-black placeholder-neutral-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 text-sm resize-none"
              rows={5}
            />
          </div>

          <div>
            <label className="font-game block text-sm font-bold text-black mb-2">
              {t('scratch.winnerCount')}
            </label>
            <input
              type="number"
              min={1}
              value={winnerCount}
              onChange={(e) => { setWinnerCount(e.target.value); setError(''); }}
              className="font-game w-full px-4 py-3 rounded-lg bg-white border-2 border-black text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 text-sm"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-bold -mt-2">{error}</p>
          )}
          <p className="font-game text-black/50 text-xs -mt-4">
            {t('scratch.minMax')}
          </p>

          <Button type="submit" variant="primary" className="w-full lowercase">
            {t('common.start')}
          </Button>
        </form>

      </Card>
      </div>

      <HowToPlay stepsKey="scratch.howToPlay.steps" />
    </div>
  );
}
