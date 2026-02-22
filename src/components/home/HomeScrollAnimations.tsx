'use client';

import { useEffect } from 'react';
import reactScrollAnimations from 'react-scroll-animations';
import 'react-scroll-animations/dist/css/index.css';

type HomeScrollAnimationsProps = {
  children: React.ReactNode;
};

const FADE_DISTANCE = '80';

export default function HomeScrollAnimations({ children }: HomeScrollAnimationsProps) {
  useEffect(() => {
    const scrollRoot = document.querySelector('main[data-scroll-root]');
    if (!scrollRoot) return;

    // React doesn't pass custom attributes like sa-fade-distance to DOM; set from client
    document.querySelectorAll('.sa-animation.sa-fade-up').forEach((el) => {
      el.setAttribute('sa-fade-distance', FADE_DISTANCE);
    });

    reactScrollAnimations.init({
      duration: 600,
      delay: 0,
      intersectionObserverOptions: {
        root: scrollRoot,
        rootMargin: '0px 0px -5% 0px',
        threshold: 0.1,
      },
    });
  }, []);

  return <>{children}</>;
}
