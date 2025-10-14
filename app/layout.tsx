"use client"

import "./globals.css"
import '@/styles/main-design.css'

import { useState, useEffect } from "react"
import { Orbitron, Rajdhani } from 'next/font/google'
import Providers from "@/lib/providers"

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400','700','900'] })
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['300','400','500','700'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleMenu = () => setMenuOpen(!menuOpen)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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

        {/* Navbar */}
        <nav id="navbar" className={scrolled ? "scrolled" : ""}>
          <div className="nav-container">
            <a href="/" className="logo-link">
              <span className={`${orbitron.className} logo-text`}>iZombie</span>
							
            </a>
            <div className={`menu-toggle ${menuOpen ? "active" : ""}`} onClick={toggleMenu}>
              <span></span><span></span><span></span>
            </div>
            <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
              <li><a href="#game">Round # 7</a></li>
              <li><a href="#awards">Awards</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </nav>


        {/* Conteúdo da página */}
				<Providers>
					
					{children}
					
        	
				</Providers>

        {/* Footer */}
        <footer className="fixed bottom-0 w-full">
          <div className="footer-content">
            <p className="copyright">© 2025 iZombie. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
