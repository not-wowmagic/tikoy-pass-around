'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  expiresAt: number; // Unix ms
  onExpired?: () => void;
}

export default function CountdownTimer({ expiresAt, onExpired }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const calc = () => {
      const diff = expiresAt - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, expired: true });
        onExpired?.();
        return;
      }
      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        expired: false,
      });
    };

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpired]);

  if (timeLeft.expired) {
    return (
      <div className="text-center text-red-500 font-semibold">
        This Tikoy has expired
      </div>
    );
  }

  // Color coding: green > 12hr, yellow 1-12hr, red < 1hr
  const isUrgent = timeLeft.hours < 1;
  const isWarning = timeLeft.hours < 12 && !isUrgent;

  const colorClass = isUrgent
    ? 'text-red-600 bg-red-50 border-red-200'
    : isWarning
    ? 'text-yellow-600 bg-yellow-50 border-yellow-200'
    : 'text-green-600 bg-green-50 border-green-200';

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-mono font-semibold text-sm ${colorClass}`}>
      <span>{isUrgent ? '🔴' : isWarning ? '🟡' : '🟢'}</span>
      <span>
        {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s remaining
      </span>
    </div>
  );
}
