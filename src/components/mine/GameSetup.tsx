'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TagInput from '@/components/ui/TagInput';
import { parseNames, validateParticipantNames, MAX_PARTICIPANTS } from '@/utils/mine';
import { useTranslation } from 'react-i18next';
import HowToPlay from '@/components/ui/HowToPlay';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Grid3x3 } from 'lucide-react';

type GameSetupProps = {
  onStart: (names: string[]) => void;
};

export default function GameSetup({ onStart }: GameSetupProps) {
  const [input, setInput] = useLocalStorage('participants');
  const [error, setError] = useState<string>('');
  const { t } = useTranslation();

  const tags = useMemo(() => parseNames(input), [input]);

  const handleTagsChange = (newTags: string[]) => {
    setInput(newTags.join(', '));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const names = tags;
    const validation = validateParticipantNames(names);

    if (!validation.valid) {
      setError(t(validation.error || 'common.error.min'));
      return;
    }

    setError('');
    onStart(names);
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex-1 flex items-center justify-center w-full">
        <Card className="max-w-md w-full">
          <div className="text-center mb-4 md:mb-8">
            <Grid3x3 className="w-10 h-10 md:w-14 md:h-14 stroke-[2.5] mx-auto mb-2 md:mb-4 text-purple-800" />
            <h2 className="font-game text-3xl font-black text-black mb-2">
              {t('mine.title')}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label className="font-game block text-sm font-bold text-black mb-2">
                {t('common.participants')}
              </label>
              <TagInput
                tags={tags}
                onTagsChange={handleTagsChange}
                placeholder={t('common.placeholder')}
                maxTags={MAX_PARTICIPANTS}
              />
              {error && (
                <p className="text-red-500 text-sm font-bold mt-2">{error}</p>
              )}
              <p className="font-game text-black/50 text-xs mt-2">
                {t('mine.minMax')}
              </p>
            </div>

            <Button type="submit" variant="primary" className="w-full lowercase">
              {t('common.start')}
            </Button>
          </form>
        </Card>
      </div>

      <HowToPlay stepsKey="mine.howToPlay.steps" />
    </div>
  );
}
