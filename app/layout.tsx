'use client';

import './globals.css';
import '@/styles/main-design.css';

import { useState, useEffect } from 'react';
import { Orbitron, Rajdhani } from 'next/font/google';
import Providers from '@/lib/providers';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700', '900'] });
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['300', '400', '500', '700'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Background */}
        <div className="grid-bg"></div>
        <div className="gradient-overlay"></div>
        <div className="scanlines"></div>
        <div className="shapes-container">
          <div className="shape shape-circle"></div>
          <div className="shape shape-triangle"></div>
          <div className="shape shape-square"></div>
        </div>

        {/* Conteúdo da página */}
        <Providers>{children}</Providers>

        {/* Footer
        <footer className="fixed bottom-0 w-full">
          <div className="footer-content">
            <p className="copyright">© 2025 iZombie. All rights reserved.</p>
          </div>
        </footer>
				*/}
      </body>
    </html>
  );
}
