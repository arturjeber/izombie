'use client';

import '@/app/globals.css';
import '@/styles/main-design.css';

import { Orbitron } from 'next/font/google';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700', '900'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.title = 'iZombie';
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <div className="nav-container">
          <Link href="http://izombie.live" className="logo-link">
            <span className={`${orbitron.className} logo-text`}>iZombie</span>
          </Link>

          <Link href="/status" className="box-title !text-base nav-link">
            back to game
          </Link>
        </div>
      </nav>
      {children}
    </>
  );
}
