'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WaveCurtain from '@/components/layout/WaveCurtain';
import GameCard from '@/components/GameCard';

export default function Home() {
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
                title="랜덤 룰렛"
                description="누가 걸릴지 아무도 모른다! 운명의 룰렛을 돌려보세요"
                icon="🎰"
                bgColor="bg-yellow-300"
                href="/games/roulette"
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
