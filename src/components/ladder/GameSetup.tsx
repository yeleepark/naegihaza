'use client';

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import HowToPlay from '@/components/ui/HowToPlay';
import TagInput from '@/components/ui/TagInput';
import { parseNames, validateLadderInput } from '@/utils/ladder';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { WavesLadder } from 'lucide-react';

type GameSetupProps = {
  onStart: (participants: string[], results: string[]) => void;
};

export default function GameSetup({ onStart }: GameSetupProps) {
  const { t } = useTranslation();
  const [participantsInput, setParticipantsInput] = useLocalStorage('participants');
  const [resultsInput, setResultsInput] = useLocalStorage('ladder-results');
  const [error, setError] = useState('');

  const participantTags = useMemo(() => parseNames(participantsInput), [participantsInput]);
  const resultTags = useMemo(() => parseNames(resultsInput), [resultsInput]);

  const handleParticipantsChange = (newTags: string[]) => {
    setParticipantsInput(newTags.join(', '));
    setError('');
  };

  const handleResultsChange = (newTags: string[]) => {
    setResultsInput(newTags.join(', '));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateLadderInput(participantTags, resultTags);

    if (!validation.valid) {
      const key = `ladder.setup.error${validation.error!.charAt(0).toUpperCase() + validation.error!.slice(1)}`;
      setError(t(key));
      return;
    }

    setError('');
    onStart(participantTags, resultTags);
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex-1 flex items-center justify-center w-full">
      <Card className="w-full max-w-2xl">
        <div className="text-center mb-4 md:mb-8">
          <WavesLadder className="w-10 h-10 md:w-14 md:h-14 stroke-[2.5] mx-auto mb-2 md:mb-4 text-green-800" />
          <h2 className="font-game text-3xl font-black text-black mb-2">
            {t('ladder.title')}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-game block text-sm font-bold text-black mb-2">
                {t('ladder.setup.participants')}
              </label>
              <TagInput
                tags={participantTags}
                onTagsChange={handleParticipantsChange}
                placeholder={t('ladder.setup.participantsPlaceholder')}
                maxTags={10}
              />
            </div>
            <div>
              <label className="font-game block text-sm font-bold text-black mb-2">
                {t('ladder.setup.results')}
              </label>
              <TagInput
                tags={resultTags}
                onTagsChange={handleResultsChange}
                placeholder={t('ladder.setup.resultsPlaceholder')}
                maxTags={10}
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
      </div>

      <HowToPlay stepsKey="ladder.howToPlay.steps" />
    </div>
  );
}
