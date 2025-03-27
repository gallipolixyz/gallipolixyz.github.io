import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const useGoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = "https://www.googletagmanager.com/gtag/js?id=G-QWGSJB3DHZ";
    document.head.appendChild(script1);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-QWGSJB3DHZ');
    window.gtag = gtag;

    return () => {
      document.head.removeChild(script1);
    };
  }, []);

  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-QWGSJB3DHZ', {
        page_path: location.pathname + location.search
      });
    }
  }, [location]);
};