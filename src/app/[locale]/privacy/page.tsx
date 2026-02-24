import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PrivacyContent from '@/components/legal/PrivacyContent';
import { type Locale } from '@/i18n/settings';
import { getMetadata } from '@/i18n/get-translations';

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = 'force-static';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = getMetadata(locale as Locale);
  const baseUrl = 'https://naegihaza.com';

  return {
    title: meta.privacy.title,
    description: meta.privacy.description,
    alternates: {
      canonical: `${baseUrl}/${locale}/privacy`,
      languages: {
        ko: `${baseUrl}/ko/privacy`,
        en: `${baseUrl}/en/privacy`,
        zh: `${baseUrl}/zh/privacy`,
        es: `${baseUrl}/es/privacy`,
        'x-default': `${baseUrl}/ko/privacy`,
      },
    },
  };
}

export default async function PrivacyPage({ params }: Props) {
  await params;
  return (
    <div className="min-h-screen w-screen flex flex-col bg-[#fef3e2]">
      <Header />

      <div className="relative flex-1 flex flex-col">
        <main className="relative z-10 flex-1 p-6 md:p-12">
          <PrivacyContent />
        </main>

        <Footer />
      </div>
    </div>
  );
}
