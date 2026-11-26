import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    // Wait for the page transition and the mobile menu collapse to finish (framer-motion
    // resets the scroll position while measuring height: 'auto'), then retry briefly
    // until the target section exists.
    const id = decodeURIComponent(hash.slice(1));
    let attempts = 0;
    let timer: number | undefined;

    const scrollToTarget = () => {
      const target = document.getElementById(id);
      if (target) {
        const offset = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        return;
      }
      if (attempts++ < 20) {
        timer = window.setTimeout(scrollToTarget, 50);
      }
    };

    timer = window.setTimeout(scrollToTarget, 350);
    return () => window.clearTimeout(timer);
  }, [pathname, hash, key]);

  return null;
};

export default ScrollToTop;
