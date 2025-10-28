'use client';

import '@/app/globals.css';
import '@/styles/main-design.css';
import { signOut } from 'next-auth/react';

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

  const logout = async () => {
    signOut({
      callbackUrl: '/', // para onde redirecionar depois do logout
    });
  };

  return (
    <>
      {/* Navbar */}
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <div className="nav-container">
          <Link href="http://izombie.live" className="logo-link">
            <span className={`${orbitron.className} logo-text`}>iZombie</span>
          </Link>

          <Link href="/" className="box-title !text-base nav-link">
            go back
          </Link>
        </div>
      </nav>
      {children}
    </>
  );
}
