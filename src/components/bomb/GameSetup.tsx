'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { parseNames, validateParticipantNames } from '@/utils/bomb';
import { useTranslation } from 'react-i18next';
import HowToPlay from '@/components/ui/HowToPlay';
import GameDescription from '@/components/ui/GameDescription';

type GameSetupProps = {
  onStart: (names: string[]) => void;
};

export default function GameSetup({ onStart }: GameSetupProps) {
  const [input, setInput] = useState<string>('');
  const [error, setError] = useState<string>('');
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
    onStart(names);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setError('');
  };

  return (
    <div className="flex flex-col w-full">
      <div className="min-h-[100dvh] snap-start snap-always flex items-center justify-center p-4 md:p-8">
      <Card className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">💣</div>
          <h2 className="font-game text-3xl font-black text-black mb-2">
            {t('bomb.title')}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              {t('bomb.minMax')}
            </p>
          </div>

          <Button type="submit" variant="primary" className="w-full lowercase">
            {t('common.start')}
          </Button>
        </form>

      </Card>
      </div>

      <GameDescription gameKey="bomb" />
      <HowToPlay stepsKey="bomb.howToPlay.steps" />
    </div>
  );
}
