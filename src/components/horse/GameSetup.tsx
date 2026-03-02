'use client';

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import HowToPlay from '@/components/ui/HowToPlay';
import TagInput from '@/components/ui/TagInput';
import { parseNames, validateParticipantNames, MAX_PARTICIPANTS } from '@/utils/horse';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type GameSetupProps = {
  onStart: (names: string[]) => void;
};

export default function GameSetup({ onStart }: GameSetupProps) {
  const { t } = useTranslation();
  const [input, setInput] = useLocalStorage('participants');
  const [error, setError] = useState<string>('');

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
      setError(
        validation.error
          ? t(
              validation.error === 'max'
                ? 'horse.error.max'
                : `common.error.${validation.error}`
            )
          : ''
      );
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
            <svg
              width="56"
              height="50"
              viewBox="0 0 40 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto mb-2 md:mb-4"
            >
              <ellipse cx="14" cy="20" rx="9" ry="6" fill="#166534" />
              <ellipse cx="14" cy="22" rx="5.5" ry="3" fill="white" opacity="0.15" />
              <path d="M20,16 C23,13 25,11 28,12 C27,16 24,19 21,19 Z" fill="#166534" />
              <ellipse cx="32" cy="10" rx="6" ry="4.5" fill="#166534" />
              <ellipse cx="30" cy="9" rx="3" ry="2" fill="white" opacity="0.1" />
              <ellipse cx="37" cy="13.5" rx="2.8" ry="2" fill="#166534" />
              <circle cx="38.8" cy="13" r="0.5" fill="rgba(0,0,0,0.3)" />
              <circle cx="38.8" cy="14.2" r="0.4" fill="rgba(0,0,0,0.2)" />
              <ellipse cx="30" cy="9" rx="2" ry="2.5" fill="white" />
              <ellipse cx="30.3" cy="9.2" rx="1.3" ry="1.6" fill="#1a1a2e" />
              <circle cx="30.8" cy="8.5" r="0.6" fill="white" opacity="0.9" />
              <circle cx="30" cy="9.8" r="0.3" fill="white" opacity="0.6" />
              <ellipse cx="35" cy="11.5" rx="1.5" ry="1" fill="#f9a8d4" opacity="0.4" />
              <path d="M28.5,5.5 L29.5,1 L31,5.2" fill="#166534" stroke="rgba(0,0,0,0.1)" strokeWidth="0.3" />
              <path d="M29,4.8 L29.7,1.8 L30.5,4.7" fill="#f9a8d4" opacity="0.35" />
              <path d="M31,6 L32.2,2 L33.5,5.8" fill="#166534" stroke="rgba(0,0,0,0.1)" strokeWidth="0.3" />
              <path d="M31.5,5.5 L32.3,2.8 L33,5.4" fill="#f9a8d4" opacity="0.35" />
              <path d="M28,3.5 Q24,7 22,12 Q21,15 20,17" stroke="rgba(0,0,0,0.2)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M30,3.5 Q28,5 27,7" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M36.5,15 Q37.5,16 39,15" stroke="#1a1a2e" strokeWidth="0.5" fill="none" opacity="0.4" />
              <rect x="18" y="25" width="2.5" height="5" rx="1.2" fill="#166534" />
              <rect x="22" y="25" width="2.5" height="5" rx="1.2" fill="#166534" />
              <rect x="7" y="25" width="2.5" height="5" rx="1.2" fill="#166534" />
              <rect x="11" y="25" width="2.5" height="5" rx="1.2" fill="#166534" />
              <path d="M5,17 Q1,12 0,16 Q-1,21 4,19" stroke="#166534" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
            <h2 className="font-game text-3xl font-black text-black mb-2">
              {t('horse.title')}
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
                {t('horse.minMax')}
              </p>
            </div>

            <Button type="submit" variant="primary" className="w-full lowercase">
              {t('common.start')}
            </Button>
          </form>
        </Card>
      </div>

      <HowToPlay stepsKey="horse.howToPlay.steps" />
    </div>
  );
}
