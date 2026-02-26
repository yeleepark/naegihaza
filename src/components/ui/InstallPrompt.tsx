'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, X, Share } from 'lucide-react';

const DISMISS_KEY = 'naegihaza-install-dismissed';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as unknown as { standalone: boolean }).standalone === true)
  );
}

function isDismissed(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (Number.isNaN(ts)) return false;
    return Date.now() - ts < DISMISS_DURATION;
  } catch {
    return false;
  }
}

export default function InstallPrompt() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [showIOS, setShowIOS] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isStandalone() || isDismissed()) return;

    // iOS Safari — show manual guide
    if (isIOS()) {
      const timer = setTimeout(() => {
        setShowIOS(true);
        setVisible(true);
        requestAnimationFrame(() => setAnimateIn(true));
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Android / Chrome — beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => {
        setVisible(true);
        requestAnimationFrame(() => setAnimateIn(true));
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    setVisible(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setAnimateIn(false);
    setTimeout(() => {
      setVisible(false);
      setDeferredPrompt(null);
      try {
        localStorage.setItem(DISMISS_KEY, String(Date.now()));
      } catch {
        // localStorage not available
      }
    }, 300);
  };

  if (!visible) return null;

  // iOS Safari guide
  if (showIOS) {
    return (
      <div
        className={`fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md transition-transform duration-300 ease-out ${
          animateIn ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="px-4 py-3 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="font-game text-sm font-black text-black">
              {t('common.installApp')}
            </p>
            <button
              onClick={handleDismiss}
              className="shrink-0 p-1 rounded-lg hover:bg-black/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-2">{t('common.installDesc')}</p>
          <ol className="space-y-1 text-xs text-black">
            <li className="flex items-center gap-2">
              <Share className="w-4 h-4 shrink-0 text-blue-500" />
              <span>{t('common.iosInstallStep1')}</span>
            </li>
            <li className="flex items-center gap-2">
              <Download className="w-4 h-4 shrink-0" />
              <span>{t('common.iosInstallStep2')}</span>
            </li>
          </ol>
        </div>
      </div>
    );
  }

  // Android / Chrome native prompt
  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md transition-transform duration-300 ease-out ${
        animateIn ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <button
          onClick={handleInstall}
          className="flex-1 flex items-center gap-2 font-game text-sm font-black text-black"
        >
          <Download className="w-5 h-5 stroke-[2.5] shrink-0" />
          <div className="text-left">
            <span className="block">{t('common.installApp')}</span>
            <span className="block text-xs font-normal text-gray-500">{t('common.installDesc')}</span>
          </div>
        </button>
        <button
          onClick={handleDismiss}
          className="shrink-0 p-1 rounded-lg hover:bg-black/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
