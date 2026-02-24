'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import HowToPlay from '@/components/ui/HowToPlay';
import GameDescription from '@/components/ui/GameDescription';
import { parseNames, validateLadderInput } from '@/utils/ladder';

type GameSetupProps = {
  onStart: (participants: string[], results: string[]) => void;
};

export default function GameSetup({ onStart }: GameSetupProps) {
  const { t } = useTranslation();
  const [participantsInput, setParticipantsInput] = useState('');
  const [resultsInput, setResultsInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const participants = parseNames(participantsInput);
    const results = parseNames(resultsInput);
    const validation = validateLadderInput(participants, results);

    if (!validation.valid) {
      const key = `ladder.setup.error${validation.error!.charAt(0).toUpperCase() + validation.error!.slice(1)}`;
      setError(t(key));
      return;
    }

    setError('');
    onStart(participants, results);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full py-8">
      <Card className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🪜</div>
          <h2 className="font-game text-3xl font-black text-black mb-2">
            {t('ladder.title')}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-game block text-sm font-bold text-black mb-2">
                {t('ladder.setup.participants')}
              </label>
              <textarea
                value={participantsInput}
                onChange={(e) => {
                  setParticipantsInput(e.target.value);
                  setError('');
                }}
                placeholder={t('ladder.setup.participantsPlaceholder')}
                className="font-game w-full px-4 py-3 rounded-lg bg-white border-2 border-black text-black placeholder-neutral-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 text-sm resize-none"
                rows={6}
              />
            </div>
            <div>
              <label className="font-game block text-sm font-bold text-black mb-2">
                {t('ladder.setup.results')}
              </label>
              <textarea
                value={resultsInput}
                onChange={(e) => {
                  setResultsInput(e.target.value);
                  setError('');
                }}
                placeholder={t('ladder.setup.resultsPlaceholder')}
                className="font-game w-full px-4 py-3 rounded-lg bg-white border-2 border-black text-black placeholder-neutral-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 text-sm resize-none"
                rows={6}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm font-bold text-center">{error}</p>
          )}

          <p className="font-game text-black/50 text-xs text-center">
            {t('ladder.setup.minMax')}
          </p>

          <Button type="submit" variant="primary" className="w-full">
            {t('ladder.setup.start')}
          </Button>
        </form>

      </Card>

      <GameDescription gameKey="ladder" />
      <HowToPlay stepsKey="ladder.howToPlay.steps" />
    </div>
  );
}
