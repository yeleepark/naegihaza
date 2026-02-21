'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { t } = useTranslation();

  return (
    <header className="relative z-10 bg-black text-white py-4 px-6 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 w-fit hover:opacity-80 transition-opacity">
          <span className="font-pixel text-sm font-black lowercase tracking-wider">
            naegihaza
          </span>
        </Link>

        {!isHome && (
          <Link
            href="/"
            className="font-game text-sm hover:text-pink-400 transition-colors"
          >
            ← {t('header.backToList')}
          </Link>
        )}
      </div>
    </header>
  );
}
