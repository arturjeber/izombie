"use client"; // necessário no Next.js 13+ se estiver em app directory
import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: string; // ex: "2025-10-10T18:30:00"
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

	const target = new Date(targetDate).getTime();
	const now = new Date().getTime();
  const difference = target - now;

  useEffect(() => {
  
    const interval = setInterval(() => {
			
			const now = new Date().getTime();
			const difference = target - now;
    
      setTimeLeft(difference > 0 ? difference : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // Converter milissegundos para dias, horas, minutos e segundos
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

	
	if(timeLeft <= 0 && difference > 0) return <>countdown</>
  return (
    <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "2rem" }}>
      {days} days <br />{hours}h {minutes}m {seconds}s
    </div>
  );
}
