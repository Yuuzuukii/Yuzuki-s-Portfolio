import { useState, useEffect } from 'react';

export const useIsMobile = () => {
  // Increased breakpoint to 1280px to include most tablets in landscape mode (e.g. iPad Pro 12.9 is 1366px, but iPad Air is 1180px)
  // This ensures a touch-first experience on tablet devices.
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1280 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1280);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};