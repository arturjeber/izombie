'use client';

import Providers from '@/lib/providers';

import '@/styles/main-design.css';
import './globals.css';

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
