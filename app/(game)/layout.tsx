'use client';

import '@/app/globals.css';
import '@/styles/main-design.css';

import { Orbitron, Rajdhani } from 'next/font/google';
import { useEffect, useState } from 'react';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700', '900'] });
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['300', '400', '500', '700'] });

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
          <a href="/" className="logo-link">
            <span className={`${orbitron.className} logo-text`}>iZombie</span>
          </a>

          <div className={`menu-toggle ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <li>
              <a href="#game">Round # 7</a>
            </li>
            <li>
              <a href="#awards">Awards</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>
      </nav>
      {children}
    </>
  );
}
