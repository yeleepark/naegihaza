import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WaveCurtain from '@/components/layout/WaveCurtain';
import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-static';

export default function Home() {
  return (
    <div className="min-h-screen w-screen flex flex-col bg-[#fef3e2]">
      <Header />

      <div className="relative flex-1 flex flex-col">
        <WaveCurtain />

        <main className="relative z-10 flex-1 flex items-center justify-center p-8 md:p-12">
          <HomeClient />
        </main>

        <Footer />
      </div>
    </div>
  );
}
