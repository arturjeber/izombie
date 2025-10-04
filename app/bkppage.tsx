"use client"

import { useEffect, useState } from "react"
import { Orbitron, Rajdhani } from "next/font/google"

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400','700','900'] })
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['300','400','500','700'] })

export default function HomePage() {
	
  const textSets = [
    { title: "FUTURE IS NOW", subtitle: "Enter the next dimension of digital innovation" },
    { title: "BEYOND LIMITS", subtitle: "Where technology meets infinite possibilities" },
    { title: "ELECTRIC DREAMS", subtitle: "Powering tomorrow's digital revolution today" },
  ]

  const [currentText, setCurrentText] = useState(0)
  const [activeTab, setActiveTab] = useState("performance")

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % textSets.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const featureTabs = [
    { id: "performance", label: "Performance", icon: "⚡" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "network", label: "Network", icon: "🌐" },
    { id: "analytics", label: "Analytics", icon: "📊" },
    { id: "integration", label: "Integration", icon: "🔧" },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <div className="text-rotator">
            <h1 className={`${orbitron.className} glitch-text`}>{textSets[currentText].title}</h1>
            <p className={`${rajdhani.className} subtitle`}>{textSets[currentText].subtitle}</p>
          </div>
        </div>
        <div className="cta-container">
          <a href="#features" className="cta-button cta-primary">Get Started</a>
          <a href="#about" className="cta-button cta-secondary">Learn More</a>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <h2 className="section-title">Core Features</h2>
        <div className="features-container">
          <div className="feature-tabs">
            {featureTabs.map(tab => (
              <div
                key={tab.id}
                className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
            ))}
          </div>
          <div className="feature-content">
            {featureTabs.map(tab => (
              <div
                key={tab.id}
                className={`content-panel ${activeTab === tab.id ? "active" : ""}`}
                id={tab.id}
              >
                <h3>{tab.label}</h3>
                <p>Detalhes sobre {tab.label}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <ul className="feature-list">
                  <li>Exemplo 1</li>
                  <li>Exemplo 2</li>
                  <li>Exemplo 3</li>
                  <li>Exemplo 4</li>
                  <li>Exemplo 5</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <h2 className="section-title">About Electric Xtra</h2>
        <div className="about-content">
          <div className="about-text">
            <h2>Pioneering the Digital Frontier</h2>
            <p>At ELECTRIC XTRA, we're not just building technology – we're crafting the future. Our mission is to bridge the gap between human potential and digital innovation.</p>
            <p>Founded by visionaries who saw beyond the limitations of current technology, ELECTRIC XTRA represents a quantum leap in digital infrastructure.</p>
          </div>
          <div className="about-visual">
            <div className="about-graphic"></div>
          </div>
        </div>

        <div className="about-content" style={{ marginTop: '80px' }}>
          <div className="about-visual">
            <div className="about-graphic-alt">
              <div className="hexagon"></div>
              <div className="hexagon"></div>
              <div className="hexagon"></div>
            </div>
          </div>
          <div className="about-text">
            <h2>Innovation at Every Level</h2>
            <p>Our commitment to excellence drives us to push boundaries and challenge conventions.</p>
            <p>From quantum computing to neural networks, from blockchain to AI, we're at the forefront of every technological revolution.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-container">
          <div className="contact-form">
            <form onSubmit={(e) => { e.preventDefault(); alert("Message sent!"); e.currentTarget.reset() }}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" required></textarea>
              </div>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>

          <div className="contact-info">
            <h3>Connect With Us</h3>
            <div className="info-item">
              <div className="info-icon">📧</div>
              <div className="info-details">
                <h4>Email</h4>
                <p>contact@electricxtra.tech</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📱</div>
              <div className="info-details">
                <h4>Phone</h4>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div className="info-details">
                <h4>Location</h4>
                <p>Neo Tokyo, Sector 7</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
