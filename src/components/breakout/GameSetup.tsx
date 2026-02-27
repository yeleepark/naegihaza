'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { parseNames, validateParticipantNames } from '@/utils/breakout';
import { useTranslation } from 'react-i18next';
import HowToPlay from '@/components/ui/HowToPlay';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { BrickWall, Siren, Trophy } from 'lucide-react';
import { BreakoutMode } from '@/types/breakout';

type GameSetupProps = {
  onStart: (names: string[], mode: BreakoutMode) => void;
};

export default function GameSetup({ onStart }: GameSetupProps) {
  const [input, setInput] = useLocalStorage('participants');
  const [error, setError] = useState<string>('');
  const [mode, setMode] = useState<BreakoutMode>('penalty');
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const names = parseNames(input);
    const validation = validateParticipantNames(names);

    if (!validation.valid) {
      setError(t(validation.error || 'common.error.min'));
      return;
    }

    setError('');
    onStart(names, mode);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setError('');
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex-1 flex items-center justify-center w-full">
        <Card className="max-w-md w-full">
          <div className="text-center mb-4 md:mb-8">
            <BrickWall className="w-10 h-10 md:w-14 md:h-14 stroke-[2.5] mx-auto mb-2 md:mb-4 text-cyan-800" />
            <h2 className="font-game text-3xl font-black text-black mb-2">
              {t('breakout.title')}
            </h2>
          </div>

          <div className="flex gap-3 mb-4 md:mb-6">
            <button
              type="button"
              onClick={() => setMode('penalty')}
              className={`font-game flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${
                mode === 'penalty'
                  ? 'border-2 border-black bg-orange-100 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'border-2 border-black/20 bg-white text-black/40'
              }`}
            >
              <Siren className="w-4 h-4 inline-block mr-1 -mt-0.5" />
              {t('breakout.mode.penalty')}
            </button>
            <button
              type="button"
              onClick={() => setMode('winner')}
              className={`font-game flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${
                mode === 'winner'
                  ? 'border-2 border-black bg-orange-100 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'border-2 border-black/20 bg-white text-black/40'
              }`}
            >
              <Trophy className="w-4 h-4 inline-block mr-1 -mt-0.5" />
              {t('breakout.mode.winner')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label className="font-game block text-sm font-bold text-black mb-2">
                {t('common.participants')}
              </label>
              <textarea
                value={input}
                onChange={handleInputChange}
                placeholder={t('common.placeholder')}
                className="font-game w-full px-4 py-3 rounded-lg bg-white border-2 border-black text-black placeholder-neutral-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 text-sm resize-none"
                rows={6}
              />
              {error && (
                <p className="text-red-500 text-sm font-bold mt-2">{error}</p>
              )}
              <p className="font-game text-black/50 text-xs mt-2">
                {t('breakout.minMax')}
              </p>
            </div>

            <Button type="submit" variant="primary" className="w-full lowercase">
              {t('common.start')}
            </Button>
          </form>
        </Card>
      </div>

      <HowToPlay stepsKey="breakout.howToPlay.steps" />
    </div>
  );
}
