'use client';

import { useState, useMemo, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TagInput from '@/components/ui/TagInput';
import { parseNames, validateParticipantNames } from '@/utils/breakout';
import { useTranslation } from 'react-i18next';
import HowToPlay from '@/components/ui/HowToPlay';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { BrickWall } from 'lucide-react';

const MOBILE_MAX = 10;
const DESKTOP_MAX = 100;

type GameSetupProps = {
  onStart: (names: string[]) => void;
};

export default function GameSetup({ onStart }: GameSetupProps) {
  const [input, setInput] = useLocalStorage('participants');
  const [error, setError] = useState<string>('');
  const [maxParticipants, setMaxParticipants] = useState(DESKTOP_MAX);
  const { t } = useTranslation();

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setMaxParticipants(mq.matches ? MOBILE_MAX : DESKTOP_MAX);
    const handler = (e: MediaQueryListEvent) =>
      setMaxParticipants(e.matches ? MOBILE_MAX : DESKTOP_MAX);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const tags = useMemo(() => parseNames(input), [input]);

  const handleTagsChange = (newTags: string[]) => {
    setInput(newTags.join(', '));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const names = tags;
    const validation = validateParticipantNames(names, maxParticipants);

    if (!validation.valid) {
      setError(t(validation.error || 'common.error.min', { max: maxParticipants }));
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
            <BrickWall className="w-10 h-10 md:w-14 md:h-14 stroke-[2.5] mx-auto mb-2 md:mb-4 text-cyan-800" />
            <h2 className="font-game text-3xl font-black text-black mb-2">
              {t('breakout.title')}
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
                maxTags={maxParticipants}
              />
              {error && (
                <p className="text-red-500 text-sm font-bold mt-2">{error}</p>
              )}
              <p className="font-game text-black/50 text-xs mt-2">
                {t('breakout.minMax', { max: maxParticipants })}
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
