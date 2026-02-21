'use client';

import { useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';

export default function I18nProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  // 번역 리소스가 모두 사전 로드되어 있으므로 렌더 전 동기적으로 언어 변경 가능
  useMemo(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
