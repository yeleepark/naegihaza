'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const { t } = useTranslation();

  // 홈은 /[locale] 형태
  const isHome = pathname === `/${locale}` || pathname === '/';

  return (
    <header className="relative z-10 bg-black text-white py-4 px-6 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2 w-fit hover:opacity-80 transition-opacity">
          <span className="font-pixel text-sm font-black lowercase tracking-wider">
            naegihaza
          </span>
        </Link>

        {!isHome && (
          <Link
            href={`/${locale}`}
            className="font-game text-sm hover:text-pink-400 transition-colors"
          >
            ← {t('header.backToList')}
          </Link>
        )}
      </div>
    </header>
  );
}
