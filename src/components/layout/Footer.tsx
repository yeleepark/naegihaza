'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const params = useParams();
  const locale = params?.locale || 'ko';
  const { t } = useTranslation();

  return (
    <footer className="bg-black text-white py-8 px-6 md:px-8">
      <div className="mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            <a
              href={`/${locale}/privacy`}
              className="font-game text-xs text-white/60 hover:text-pink-400 transition-colors"
            >
              {t('footer.privacy')}
            </a>
            <a
              href={`/${locale}/terms`}
              className="font-game text-xs text-white/60 hover:text-pink-400 transition-colors"
            >
              {t('footer.terms')}
            </a>
            <a
              href="mailto:Seoyoon Park <dev.yelee@gmail.com>"
              className="font-game text-xs text-white/60 hover:text-pink-400 transition-colors"
            >
              {t('footer.contact')}
            </a>
          </div>

          <div className="font-game text-xs text-white/60">
            © 2026 Seoyoon Park. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
