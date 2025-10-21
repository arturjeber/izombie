'use client'; // necessário no Next.js 13+ se estiver em app directory
import { time } from 'console';
import { useEffect, useRef, useState } from 'react';
import { Orbitron, Rajdhani } from 'next/font/google';
import { useRouter } from 'next/navigation';
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['300', '400', '500', '700'] });

interface CountdownProps {
  targetDate: string; // ex: "2025-10-10T18:30:00"
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const difference = target - now;

  useEffect(() => {
    if (!targetDate) return;

    const target = new Date(targetDate).getTime();
    const now = Date.now();

    if (target - now < 0) return;

    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const difference = target - now;

        if (difference > 0) setTimeLeft(difference);
        else {
          if (intervalRef.current != null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            window.location.reload();
          }
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // [] → executa apenas uma vez
  }, []);

  // Converter milissegundos para dias, horas, minutos e segundos
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  if (timeLeft <= 0 && difference < 0)
    return (
      <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2rem' }}>Round #7 is ON!</div>
    );

  return (
    <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2rem' }}>
      {days} days <br />
      {hours}h {minutes}m {seconds}s
      <div className={`${rajdhani.className} subtitle`}>to next round</div>
    </div>
  );
}
