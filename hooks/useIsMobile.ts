import { useState, useEffect } from 'react';

export const useIsMobile = () => {
  // ブレークポイントを768pxに変更：スマートフォンのみをモバイル扱いに
  // タブレット（iPad: 768px以上）はデスクトップUIを使用
  // モバイル: ~767px (スマートフォン)
  // デスクトップ: 768px~ (タブレット、ノートPC、デスクトップ)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};