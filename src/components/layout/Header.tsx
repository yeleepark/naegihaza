'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import NavMenu from './NavMenu';

export default function Header() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  // 홈은 /[locale] 형태
  const isHome = pathname === `/${locale}` || pathname === '/';

  return (
    <header className="relative z-40 bg-black text-white py-4 px-6 md:px-8">
      <div className="flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2 w-fit hover:opacity-80 transition-opacity">
          <span className={`text-sm font-black lowercase tracking-wider ${
            locale === 'ko' || locale === 'zh' ? 'font-game text-base' : 'font-pixel'
          }`}>
            {t('header.title')}
          </span>
        </Link>

        <div className="relative">
          {!isHome && (
            <>
              <button
                onClick={() => setMenuOpen(true)}
                className="p-2 hover:text-pink-400 transition-colors"
                aria-label={t('header.backToList')}
              >
                <Menu className="w-5 h-5" />
              </button>

              {menuOpen && <NavMenu onClose={() => setMenuOpen(false)} />}
            </>
          )}
          {isHome && <div className="p-2"><div className="w-5 h-5" /></div>}
        </div>
      </div>
    </header>
  );
}
