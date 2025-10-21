'use client';
import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  duration?: number; // em segundos
  onFinish?: (result: string) => void;
}

export default function Countdown10({ duration = 10 * 60, onFinish }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const startCountdown = () => {
    setTimeLeft(duration);
    setIsRunning(true);
  };

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          onFinish?.('ok'); // 💡 chama callback com "ok"
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onFinish]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return ` ${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} to validate code`;
  };

  return timeLeft == 0 ? (
    <span className={timeLeft == 0 ? 'cursor-pointer' : ''} onClick={() => startCountdown()}>
      {' '}
      Click here to get a new code
    </span>
  ) : (
    formatTime(timeLeft)
  );
}
