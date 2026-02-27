import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TermsContent from '@/components/legal/TermsContent';
import { type Locale } from '@/i18n/settings';
import { createPageMetadata } from '@/lib/metadata';

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = 'force-static';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata(locale as Locale, 'terms', '/terms');
}

export default async function TermsPage({ params }: Props) {
  await params;
  return (
    <div className="min-h-screen w-screen flex flex-col bg-[#fef3e2]">
      <Header />

      <div className="relative flex-1 flex flex-col">
        <main className="relative z-10 flex-1 p-6 md:p-12">
          <TermsContent />
        </main>

        <Footer />
      </div>
    </div>
  );
}
