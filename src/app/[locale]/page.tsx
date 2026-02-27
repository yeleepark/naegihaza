import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WaveCurtain from '@/components/layout/WaveCurtain';
import HomeClient from '@/components/HomeClient';
import HomeAbout from '@/components/home/HomeAbout';
import HomeScrollAnimations from '@/components/home/HomeScrollAnimations';
import { type Locale } from '@/i18n/settings';
import { createPageMetadata } from '@/lib/metadata';

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = 'force-static';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata(locale as Locale, 'home', '', { xDefault: 'en', openGraph: true, alternateLocale: true });
}

export default async function Home({ params }: Props) {
  await params; // Ensure params is resolved
  return (
    <div className="h-screen h-[100dvh] w-screen flex flex-col overflow-hidden bg-[#fef3e2]">
      <Header />

      <div className="relative flex-1 flex flex-col min-h-0 min-w-0">
        <WaveCurtain />

        <main
          data-scroll-root
          className="home-scroll-main relative z-10 flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden scroll-smooth"
        >
          <HomeScrollAnimations>
            <section className="min-h-screen min-h-[100dvh] h-screen h-[100dvh] flex items-center justify-center p-4 md:p-12 snap-start snap-always sa-animation sa-fade-up">
              <HomeClient />
            </section>
            <HomeAbout />
            <Footer />
          </HomeScrollAnimations>
        </main>
      </div>
    </div>
  );
}
