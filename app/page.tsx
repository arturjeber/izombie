'use client';

import Countdown from '@/components/Countdown';
import { trpc } from '@/lib/trpcClient';
import { launchDate } from '@/lib/utils';
import { Orbitron } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700', '900'] });

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [activeTab, setActiveTab] = useState('origin');
  const [messageSent, setMessageSent] = useState(false);

  const sendMsg = trpc.message.create.useMutation();

  const submitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };

    try {
      sendMsg.mutateAsync(
        { name: data.name, email: data.email, message: data.message },
        {
          onSuccess: () => {
            setMessageSent(true);
            form.reset();
          },
        },
      );
    } catch (error) {
      console.log(error);
      alert('An error occurred while sending the message.');
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    const element = document.getElementById('content');
    if (element) {
      const yOffset = -80; // altura do header fixo
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const featureTabs = [
    {
      id: 'origin',
      label: 'Origin - Round #7',
      icon: '/handWhite.png',
      text: `<p>Santiago will never be the same. In the streets of Barrio Italia, Vitacura, and Las Condes, an unknown infection has turned ordinary people into flesh-hungry zombies.</p>
						 <p><b>You are a survivor.</b></p>
						 <p>Every step, every QR code you scan, could save your life or doom you to transformation. There are hidden weapons, food to maintain your strength, and dangerous zones where hordes await. But beware: not everything is as it seems — false clues could cost you your life.</p>
						 <p><b>Do you have the courage to survive iZombie?</b></p>`,
    },
    {
      id: 'rules',
      label: 'How to play? (Rules)',
      icon: '/diceWhite.png',
      text: `
					<p>The goal of the game is to survive or, in the case of zombies, to infect other players.</p>
					<p>The map is composed of scattered QR codes; each QR code may contain food, traps, zombies, or strategic opportunities.</p>
					<p>The game has high-risk areas, contaminated QR codes, and strategic locations that require planning and cooperation.</p>
					<p><b>At the end of the countdown, one player is randomly chosen as patient zero (the first infected).</b></p>
			`,
    },
    {
      id: 'zumbis',
      label: 'Zombies (Infected)',
      icon: '/zombieWhite.png',
      text: `
					<p>Zombies are players who have been infected and now seek to infect others.</p>
					<p>Any QR code scanned by a zombie becomes dangerous for survivors.</p>
					<p>Staying still does not affect zombies. Hunger doesn’t affect them, and there is no cure.</p>
					<p>If a zombie is killed by a survivor (weapon, ambush, or other combat rule), they become a round observer — they can watch the game but no longer participate in attacks or contagion.</p>
			`,
    },
    {
      id: 'survivor',
      label: 'Survivor',
      icon: '/survivorWhite.png',
      text: `
					<p>Survivors who don’t interact with the game (don’t scan at least one QR code every 24h*) lose energy until they die of starvation and become zombies.</p>
					<p>*Having food in the backpack increases the time they can go without scanning a QR code.</p>
					<p>Hunger reaching 100% + not eating for 1 hour → turns into a zombie.</p>
	
					<p><b>If you scan a QR code already read by a zombie, you must choose: <br /></b>
						- use a weapon (if you have one) and try to kill the zombie, or; <br />
						- find another QR code within the given time to escape.
					</p>
	
					<p>If you fail to kill the zombie or escape, you immediately become a zombie.</p>
					<p>Some food may be contaminated and reduce energy or increase hunger.</p>
	
					<p>Some fake QR codes may disguise traps or zombies.</p>
	
					<p><b>Each QR code scan moves the player to the location of that QR code.</b></p>
			`,
    },
    {
      id: 'engagement',
      label: 'Engagement',
      icon: '/engagementWhite.png',
      text: `
					<p>A player remains at the location of the QR code until scanning another one.</p>
	
					<p><b>If a zombie scans a QR code right before or after a survivor (or vice versa), a confrontation occurs.</b></p>
	
					<p><b>Cumulative Strength -</b> More than one player from the same team scanning the same QR code combines their strength: <br />
					- Zombies together → more power to infect survivors. <br />
					- Survivors together → more power to resist or defeat zombies.
					</p>
	
					<p>The player or group with less strength is defeated: <br />
					- Defeated survivors → become zombies. <br />
					- Defeated zombies → die and become observers.
					</p>
			`,
    },
    {
      id: 'end',
      label: 'The End',
      icon: '/endWhite.png',
      text: `
					<p>The game ends when only one survivor or zombie remains standing.</p>
					<p>The winners will be crowned and will receive their rewards.</p>
			`,
    },
  ];

  return (
    <>
      {/* Navbar */}
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <div className="nav-container">
          <Link href="/" className="logo-link">
            <span className={`${orbitron.className} logo-text`}>iZombie</span>
          </Link>

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

      {/* Counter */}
      <section className="hero" id="counter">
        <div className="hero-content">
          <h1 className={`${orbitron.className} glitch-text`}>
            <Countdown targetDate={launchDate} />
          </h1>
        </div>
        <div className="cta-container">
          <a href="/join" className="cta-button cta-primary">
            Join
          </a>
          <a href="#game" className="cta-button cta-secondary">
            the game
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="game">
        <h2 className="section-title">The Game</h2>
        <div className="features-container">
          <div className="feature-tabs">
            {featureTabs.map((tab) => (
              <div
                key={tab.id}
                className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.id)}
              >
                <span className="tab-icon">
                  <Image
                    className="dark:invert"
                    src={tab.icon}
                    alt="zombie hand"
                    width={40}
                    height={40}
                    priority
                  />
                </span>
                <span>{tab.label}</span>
              </div>
            ))}
          </div>
          <div id="content" className="feature-content">
            {featureTabs.map((tab) => (
              <div
                className={`content-panel ${activeTab === tab.id ? 'active' : ''}`}
                id={tab.id}
                key={tab.id}
              >
                <h3>{tab.label}</h3>
                <div dangerouslySetInnerHTML={{ __html: tab.text || '' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="awards">
        <h2 className="section-title">Awards</h2>
        <div className="about-content">
          <div className="about-text">
            <p>For the last Zombie or Survivor Standing</p>
            <h2>USD 100</h2>
            <p>For the most Zombie kills</p>
            <h2>USD 100</h2>
            <p>For the most Survivor kills</p>
            <h2>USD 100</h2>
          </div>
          <div className="about-visual">
            <div className="about-graphic">
              <Image
                className="dark:invert"
                src="/endWhite.png"
                alt="zombie hand"
                width={80}
                height={80}
                priority
              />
            </div>
          </div>
        </div>

        <div className="about-content" style={{ marginTop: '80px' }}>
          <div className="about-visual">
            <div className="about-graphic-alt">
              <Image
                className="dark:invert"
                src="/diceWhite.png"
                alt="zombie hand"
                width={60}
                height={60}
                priority
              />

              <div className="hexagon"></div>
              <div className="hexagon"></div>
            </div>
          </div>
          <div className="about-text">
            <h2>Last rounds</h2>
            <p className="flex items-center gap-3">
              <Image
                className="dark:invert"
                src="/handWhite.png"
                alt="zombie hand"
                width={30}
                height={30}
                priority
              />
              Round #7 - Santiago - TBD
            </p>
            <p className="flex items-center gap-3">
              <Image
                className="dark:invert"
                src="/survivorWhite.png"
                alt="zombie hand"
                width={30}
                height={30}
                priority
              />
              Round #6 - Survivor wins - Rio de Janeiro - 4154 participants
            </p>
            <p className="flex items-center gap-3">
              <Image
                className="dark:invert"
                src="/zombieWhite.png"
                alt="zombie hand"
                width={30}
                height={30}
                priority
              />
              Round #5 - Zombie wins - São Paulo - 2543 participants
            </p>
            <p className="flex items-center gap-3">
              <Image
                className="dark:invert"
                src="/survivorWhite.png"
                alt="zombie hand"
                width={30}
                height={30}
                priority
              />
              Round #4 - Survivors wins - Chicago - 3478 participants
            </p>
            <p className="flex items-center gap-3">
              <Image
                className="dark:invert"
                src="/survivorWhite.png"
                alt="zombie hand"
                width={30}
                height={30}
                priority
              />
              Round #3 - Survivors wins - Boston - 1566 participants
            </p>
            <p className="flex items-center gap-3">
              <Image
                className="dark:invert"
                src="/zombieWhite.png"
                alt="zombie hand"
                width={30}
                height={30}
                priority
              />
              Round #2 - Zombie wins - San Francisco - 1208 participants
            </p>
            <p className="flex items-center gap-3">
              <Image
                className="dark:invert"
                src="/zombieWhite.png"
                alt="zombie hand"
                width={30}
                height={30}
                priority
              />
              Round #1 - Zombie wins - Los Angeles - 1053 participants
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <h2 className="section-title">Get In Touch</h2>
        <div className="contact-container">
          <div className="contact-form">
            {messageSent ? (
              <div className="success-message">
                <p>{`Thank you for reaching out! We'll get back to you soon.`}</p>
              </div>
            ) : (
              <>
                <h3>Send Us a Message</h3>
                <form onSubmit={submitMessage}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea id="message" name="message" required></textarea>
                  </div>
                  <button type="submit" className="submit-btn">
                    Send Message
                  </button>
                </form>
              </>
            )}
          </div>

          <div className="contact-info">
            <h3>Connect With Us</h3>

            <div className="info-item">
              <div className="info-icon">📍</div>
              <div className="info-details">
                <h4>Location</h4>
                <p>Songdo, South Korea</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
