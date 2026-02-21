'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WaveCurtain from '@/components/layout/WaveCurtain';
import GameCard from '@/components/GameCard';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-screen flex flex-col bg-[#fef3e2]">
      <Header />

      <div className="relative flex-1 flex flex-col">
        <WaveCurtain />

        <main className="relative z-10 flex-1 flex items-center justify-center p-8 md:p-12">
          <div className="max-w-5xl w-full">
            {/* Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GameCard
                title={t('home.roulette.title')}
                description={t('home.roulette.description')}
                icon="🎰"
                bgColor="bg-yellow-300"
                href="/games/roulette"
              />
              <GameCard
                title={t('home.dice.title')}
                description={t('home.dice.description')}
                icon="🎲"
                bgColor="bg-blue-300"
                href="/games/dice"
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
