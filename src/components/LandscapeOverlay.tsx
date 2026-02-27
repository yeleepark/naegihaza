'use client';

import { useTranslation } from 'react-i18next';
import { ScreenShareOff } from 'lucide-react';

export default function LandscapeOverlay() {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-[9999] bg-[#fef3e2] items-center justify-center p-8 hidden landscape:flex md:landscape:hidden">
      <div className="text-center space-y-4">
        <ScreenShareOff className="w-16 h-16 mx-auto text-black/70" />
        <p className="font-game text-lg font-black text-black">
          {t('common.landscapeWarning')}
        </p>
      </div>
    </div>
  );
}
