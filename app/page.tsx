"use client"

import Countdown from "@/components/Countdown";
import { useCreateMessage } from "@/schemas/message";
import { Orbitron, Rajdhani } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";
import { launchDate } from "@/lib/utils";

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400','700','900'] })
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['300','400','500','700'] })


export default function HomePage() {
	
  const textSets = [
    { title: "FUTURE IS NOW", subtitle: "Enter the next dimension of digital innovation" },
    { title: "BEYOND LIMITS", subtitle: "Where technology meets infinite possibilities" },
    { title: "ELECTRIC DREAMS", subtitle: "Powering tomorrow's digital revolution today" },
  ]

  const [currentText, setCurrentText] = useState(0)
  const [activeTab, setActiveTab] = useState("origin")
  const [messageSent, setMessageSent] = useState(false);

	const { mutate: sendMsg } = useCreateMessage();
	
	const submitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);
		const data = {
			name: formData.get("name"),
			email: formData.get("email"),
			message: formData.get("message"),
		};

		try {
			sendMsg(data as { name: string; email: string; message: string; },
				{onSuccess: () => {
					setMessageSent(true)
					form.reset()
				}}
			);
		} 
		catch (error) {
			alert("An error occurred while sending the message.");
		}
	};

	const handleTabClick = (tabId: string) => {
		setActiveTab(tabId);
		const element = document.getElementById("content");
    if (element) {
			const yOffset = -80; // altura do header fixo
			const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
			window.scrollTo({ top: y, behavior: "smooth" });
		}
	}

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % textSets.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])


  const featureTabs = [
    { id: "origin", label: "Origin - Round #7", icon: "/handWhite.png", 
			text:`<p>Santiago will never be the same. In the streets of Barrio Italia, Vitacura, and Las Condes, an unknown infection has turned ordinary people into flesh-hungry zombies. </p> 
						<p><b>You are a survivor.</b></p>
						<p>Every step, every QR code you scan, could save your life or doom you to transformation.There are hidden weapons, food to maintain your strength, and dangerous zones where hordes await. But beware: not everything is as it seems — false clues could cost you your life.</p>
						<p><b>Do you have the courage to survive iZombie?</b></p>
		`},
    { id: "rules", label: "How to play? (Rules)", icon: "/diceWhite.png", 
			text:`
				<p>O objetivo do jogo é sobreviver ou, no caso dos zumbis, infectar outros jogadores.</p>
				<p>O mapa é composto por QR codes espalhados; cada QR code pode conter comida, armadilhas, zumbis ou oportunidades estratégicas.</p>
				<p>O jogo possui áreas de alto risco, QR codes contaminados e locais estratégicos que exigem planejamento e cooperação.</p>
				<p><b>Ao fim do countdown, um jogador é escolhido aleatoriamente como paciente zero. ( primeiro infectado )</b></p>
		`},
    { id: "zumbis", label: "Zumbis (Infectados)", icon: "/zombieWhite.png", 
			text:`
				<p>Zumbis são jogadores que foram infectados e agora buscam infectar outros.</p>
				<p>Qualquer QR code lido por um zumbi se torna perigoso para os sobreviventes.</p>
				<p>Permanecer parado não afeta o zumbi. A fome não os afeta e não tem cura.</p>
				<p>Se um zumbi for morto por um sobrevivente (arma, emboscada ou outra regra de combate), ele torna-se observador do round, podendo acompanhar o jogo, mas não participa mais de ataques ou contágio.</p>
		`},
    { id: "survivor", label: "Survivor", icon: "/survivorWhite.png", 
			text:`
			<p>Sobreviventes que não interagirem com o jogo (não ler pelo menos 1 QR code a cada 24h*) perdem energia até morrer por inanição e se tornam Zumbies.</p>
			<p>*Ter comida na mochila aumenta o tempo que podem ficar sem escanear QR code.</p>
			<p>Fome atingindo 100% + não comer em 1 hora → vira zumbi.</p>

			<p><b>Se ler um QR code já lido por um zumbi, deve escolher: <br /></b>
				- usar arma (se possuídas) e tentar matar o zumbi ou; <br />
				- buscar outro QR code em tempo determinado para fugir
			</p>

			<p>Se falhar ao matar o zumbi ou fugir, torna-se zumbi imediatamente.</p>
			<p>Algumas comidas podem estar contaminadas e reduzem a energia ou aumentam fome</p>

			<p>Alguns QR codes falsos podem disfarçar armadilhas ou zumbis.</p>

			<p><b>Cada leitura de QR code move o jogador para o local do QR code.</b></p>
			

		`},
    { id: "engagement", label: "Engagement", icon: "/engagementWhite.png", 
			text:`
			<p>Um jogador permanece no local do QR code até ler outro QR code.</p>

			

			
			<p><b>Se um zumbi lê um QR code seguido por um sobrevivente (ou vice-versa), ocorre um confronto.</b></p>

			<p><b>Força Acumulativa -</b> Mais de um jogador do mesmo time lendo o mesmo QR code soma forças: <br />
			- Zumbis juntos → mais poder para infectar sobreviventes. <br />
			- Sobreviventes juntos → mais poder para resistir ou derrotar zumbis.
			</p>


			<p>O jogador ou grupo com menor força é derrotado: <br />
			- Sobreviventes derrotados → viram zumbis <br />
			- Zumbis derrotados → mortos, tornam-se observadores
			</p>
			
			
			
		`},
		{ id: "end", label: "The end", icon: "/endWhite.png", 
			text:`
			<p>O jogo termina quando um único sobrevivente ou zumbi permanece de pé.</p>
			<p>Os vencedores serão coroados e receberão suas recompensas.</p>
		`}
  ]

  return (
    <>

			{/* Counter */}
      <section className="hero" id="counter">
        <div className="hero-content">
					<h1 className={`${orbitron.className} glitch-text`}><Countdown targetDate={launchDate} /></h1>
        </div>
        <div className="cta-container">
          <a href="/join" className="cta-button cta-primary">Join</a>
          <a href="#game" className="cta-button cta-secondary">the game</a>
        </div>
      </section>


      {/* Features Section */}
      <section className="features" id="game">
        <h2 className="section-title">The Game</h2>
        <div className="features-container">
          <div className="feature-tabs">
            {featureTabs.map(tab => (
              <div
                key={tab.id}
                className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => handleTabClick(tab.id)}
              >
                <span className="tab-icon">
									 <Image className="dark:invert" 
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
            {featureTabs.map(tab => (
              <div  className={`content-panel ${activeTab === tab.id ? "active" : ""}`} id={tab.id} key={tab.id}>
                <h3>{tab.label}</h3>
								<div dangerouslySetInnerHTML={{ __html: tab.text || ""}} />
                	
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="awards">
        <h2 className="section-title">Awards</h2>
        <div className="about-content">
          <div className="about-text" >
						<p>For the last Zombie or Survivor Standing</p><h2>USD 100</h2>
						<p>For the most Zombie kills</p><h2>USD 100</h2>
						<p>For the most Survivor kills</p><h2>USD 100</h2>
          </div>
          <div className="about-visual">
            <div className="about-graphic">
							<Image className="dark:invert" 
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
						<Image className="dark:invert" 
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
							<Image className="dark:invert" 
								src="/handWhite.png"
								alt="zombie hand"
								width={30}
								height={30}
								priority
							/>
							Round #7 - Santiago - TBD
						</p>
						<p className="flex items-center gap-3">
							<Image className="dark:invert" 
								src="/survivorWhite.png"
								alt="zombie hand"
								width={30}
								height={30}
								priority
							/>
							Round #6 - Survivor wins - Rio de Janeiro - 4154 participants 
						</p>
						<p className="flex items-center gap-3">
							<Image className="dark:invert" 
								src="/zombieWhite.png"
								alt="zombie hand"
								width={30}
								height={30}
								priority
							/>
							Round #5 - Zombie wins - São Paulo - 2543 participants 
						</p>
						<p className="flex items-center gap-3">
							<Image className="dark:invert" 
								src="/survivorWhite.png"
								alt="zombie hand"
								width={30}
								height={30}
								priority
							/>
							Round #4 - Survivors wins - Chicago - 3478 participants 
						</p>
						<p className="flex items-center gap-3">
							<Image className="dark:invert" 
								src="/survivorWhite.png"
								alt="zombie hand"
								width={30}
								height={30}
								priority
							/>
							Round #3 - Survivors wins - Boston - 1566 participants 
						</p>
            <p className="flex items-center gap-3">
							<Image className="dark:invert" 
								src="/zombieWhite.png"
								alt="zombie hand"
								width={30}
								height={30}
								priority
							/>
							Round #2 - Zombie wins - San Francisco - 1208 participants 
						</p>
						<p className="flex items-center gap-3">
							<Image className="dark:invert" 
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
								<p>Thank you for reaching out! We'll get back to you soon.</p>
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
									<button type="submit" className="submit-btn">Send Message</button>
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
  )
}
