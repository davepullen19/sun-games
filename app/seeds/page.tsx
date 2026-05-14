'use client';

import { useEffect } from 'react';
import { initGame, cleanupGame } from './game';
import './seeds.css';

export default function SeedsPage() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.background = '#07070f';
    initGame();
    return () => {
      cleanupGame();
      document.body.style.overflow = '';
      document.body.style.background = '';
    };
  }, []);

  return <div id="app" />;
}
