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
  const [expanded, setExpanded] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isStandalone() || isDismissed()) return;

    if (isIOS()) {
      const timer = setTimeout(() => {
        setShowIOS(true);
        setVisible(true);
        requestAnimationFrame(() => setAnimateIn(true));
      }, 3000);
      return () => clearTimeout(timer);
    }

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
      setExpanded(false);
      try {
        localStorage.setItem(DISMISS_KEY, String(Date.now()));
      } catch {
        // localStorage not available
      }
    }, 300);
  };

  if (!visible) return null;

  // iOS — expanded tooltip with steps
  if (showIOS && expanded) {
    return (
      <div className="fixed bottom-20 right-4 z-50">
        <div
          className={`w-56 px-3 py-2.5 rounded-xl border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ease-out origin-bottom-right ${
            animateIn ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <p className="font-game text-xs font-black text-black">{t('common.installApp')}</p>
            <button
              onClick={handleDismiss}
              className="shrink-0 p-0.5 rounded hover:bg-black/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
          <ol className="space-y-1 text-[11px] text-black">
            <li className="flex items-center gap-1.5">
              <Share className="w-3.5 h-3.5 shrink-0 text-blue-500" />
              <span>{t('common.iosInstallStep1')}</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>{t('common.iosInstallStep2')}</span>
            </li>
          </ol>
        </div>
      </div>
    );
  }

  // Floating button (FAB)
  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ease-out ${
        animateIn ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}
    >
      <button
        onClick={showIOS ? () => setExpanded(true) : handleInstall}
        className="relative w-12 h-12 flex items-center justify-center rounded-full border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all"
        aria-label={t('common.installApp')}
      >
        <Download className="w-5 h-5 stroke-[2.5] text-black" />
      </button>
      <button
        onClick={handleDismiss}
        className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full border border-black bg-white hover:bg-gray-100 transition-colors"
        aria-label="Close"
      >
        <X className="w-3 h-3 stroke-[2.5]" />
      </button>
    </div>
  );
}
