import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const useGoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-QWGSJB3DHZ', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
};