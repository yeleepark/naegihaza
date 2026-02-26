'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { parseNames, validateParticipantNames } from '@/utils/bomb';
import { useTranslation } from 'react-i18next';
import HowToPlay from '@/components/ui/HowToPlay';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Bomb } from 'lucide-react';

type GameSetupProps = {
  onStart: (names: string[]) => void;
};

export default function GameSetup({ onStart }: GameSetupProps) {
  const [input, setInput] = useLocalStorage('participants');
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
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex-1 flex items-center justify-center w-full">
      <Card className="max-w-md w-full">
        <div className="text-center mb-8">
          <Bomb className="w-14 h-14 stroke-[2.5] mx-auto mb-4 text-red-800" />
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

      <HowToPlay stepsKey="bomb.howToPlay.steps" />
    </div>
  );
}
