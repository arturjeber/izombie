'use client';

import Providers from '@/lib/providers';
import { useEffect } from 'react';
import Smartlook from 'smartlook-client';

import '@/styles/main-design.css';
import Script from 'next/script';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Inicializa Smartlook apenas uma vez
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      Smartlook.init('1d2ce0412ca3552d319fc46a32e798a15ca4f141');
      Smartlook.record({ emails: true, ips: true });
    }
  }, []);

  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-K7S2S7D8');`,
          }}
        />
      </head>
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
