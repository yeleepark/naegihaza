'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('pwa-install-dismissed');
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    setDeferredPrompt(null);
    sessionStorage.setItem('pwa-install-dismissed', '1');
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm animate-slide-up">
      <div className="flex items-center gap-3 rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-xl">
          🍀
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-game text-sm font-bold text-black">
            {t('install.title')}
          </p>
          <p className="font-game text-xs text-neutral-600 mt-0.5">
            {t('install.description')}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={handleInstall}
            className="flex items-center gap-1 rounded-lg border-2 border-black bg-orange-400 px-3 py-1.5 font-game text-xs font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-orange-500 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
          >
            <Download size={14} />
            {t('install.button')}
          </button>
          <button
            onClick={handleDismiss}
            className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
