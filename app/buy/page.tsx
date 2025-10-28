'use client';

import { trpc } from '@/lib/trpcClient';
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

  const [activeTab, setActiveTab] = useState('Food');
  const [messageSent, setMessageSent] = useState(false);

  const sendMsg = trpc.message.create.useMutation();

  const submitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: ((formData.get('price') as string) + ' - ' + formData.get('address')) as string,
      origen: 'Buy Page',
    };

    try {
      sendMsg.mutateAsync(data, {
        onSuccess: () => {
          setMessageSent(true);
          form.reset();
        },
      });
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
      id: 'Food',
      price: '4.99 USD',
      label: 'Food & Survival',
      icon: '/handWhite.png',
      text: `<p>Space stocked with essential food and renewable resources each week.</p>
							<p><b>Benefit:</b></p>
							<ul>
								<li>- Guaranteed weekly supply of water, snacks, ice cream, and energy boosters.</li>	
							</ul>`,
    },
    {
      id: 'Workshop',
      price: '7.99 USD',
      label: 'Workshop',
      icon: '/diceWhite.png',
      text: `<p>Craft, upgrade, and repair weapons, traps, and survival gear.</p>
			<p><b>Benefits:</b></p>
			<ul>
				<li>- Access to rare itens unavailable elsewhere.</li>
				<li>- Upgrade weapons and traps for better efficiency against zombies.</li>
				<li>- Boost your combat stats with custom gear.</li>
			</ul>
			`,
    },
    {
      id: 'Medical',
      price: '6.99 USD',
      label: 'Medical Hub',
      icon: '/zombieWhite.png',
      text: `
					<p>Recover health, cure infections, and stock essential medical supplies.</p>
					<p><b>Benefits:</b></p>
         <ul>
           <li>- Access to medicines that boost your energy.</li>
           <li>- Exclusive medical kits for rare situations.</li>
           <li>- Some light weapons may be available.</li>
         </ul>
			`,
    },

    {
      id: 'ObservationTower',
      price: '9.99 USD',
      label: 'Observation Tower',
      icon: '/survivorWhite.png',
      text: `<p>Gain strategic vision over surrounding areas and detect zombie threats early.</p>
							<p><b>Benefits:</b></p>
							<ul>
								<li>- Reveal hidden zombie spawns or ambushes on the map.</li>
								<li>- Increase chance of finding rare loot in nearby areas.</li>
								<li>- Coordinate attacks and defenses more effectively with allies.</li>
							</ul>
			`,
    },
  ];

  return (
    <>
      {/* Features Section */}
      <section className="features" id="game">
        <h2 className="section-title">Become A special PLACE</h2>
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
                <br />
                <br />
                <Link href="#check" className="submit-btn mt-20">
                  Buy
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="check">
        <h2 className="section-title">Define your location</h2>
        <div className={!messageSent ? 'contact-container' : ''}>
          <div className="contact-form">
            {messageSent ? (
              <div className="contact-info">
                <h3>Checking Availability... we will get back to you soon.</h3>
              </div>
            ) : (
              <>
                <form onSubmit={submitMessage}>
                  <div className="form-group">
                    <label htmlFor="name">Location name</label>
                    <input type="text" id="name" name="name" required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <textarea id="address" name="address" required></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required />
                  </div>
                  <input
                    type="hidden"
                    id="price"
                    name="price"
                    value={featureTabs.find((tab) => tab.id === activeTab)?.price}
                  />

                  <button type="submit" className="submit-btn">
                    Check Availability
                  </button>
                </form>
              </>
            )}
          </div>

          {!messageSent && (
            <div className="contact-info">
              <h3>{featureTabs.find((tab) => tab.id === activeTab)?.price}</h3>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
