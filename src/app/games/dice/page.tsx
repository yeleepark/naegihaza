import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WaveCurtain from '@/components/layout/WaveCurtain';
import DiceGameClient from '@/components/dice/DiceGameClient';

export const dynamic = 'force-static';

export default function DicePage() {
  return (
    <div className="min-h-screen md:h-screen w-screen flex flex-col bg-[#fef3e2] overflow-auto md:overflow-hidden">
      <Header />

      <div className="relative flex-1 min-h-0 flex flex-col">
        <WaveCurtain />

        <main className="relative z-10 flex-1 min-h-0 flex items-center justify-center p-4 md:p-8">
          <DiceGameClient />
        </main>

        <Footer />
      </div>
    </div>
  );
}
