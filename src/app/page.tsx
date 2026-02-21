'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GameCard from '@/components/GameCard';

export default function Home() {
  return (
    <div className="min-h-screen w-screen flex flex-col bg-pink-400">
      <Header />

      <main className="flex-1 flex items-center justify-center p-8 md:p-12">
        <div className="max-w-5xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="font-[family-name:var(--font-inter)] text-7xl md:text-8xl font-black text-white mb-6 lowercase tracking-tight">
              naegihaza
            </h1>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 게임 카드들이 여기에 추가됩니다 */}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
