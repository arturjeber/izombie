'use client';

export default function TermsOfUse() {
  return (
    <div className="container mx-auto px-4 py-10 m-20 p-20 text-gray-400">
      <h1 className="text-3xl font-bold text-center mb-6">
        iZombie – Global Terms of Use and Privacy Policy
      </h1>

      <section>
        <h3 className="text-2xl font-semibold mb-2">1. Introduction</h3>
        <p>
          Welcome to iZombie (“the Game,” “we,” “our,” or “us”). These Terms of Use and Privacy
          Policy (“Terms”) govern your access and use of the iZombie platform, website, and mobile
          applications (collectively, the “Service”). By accessing or using the Service, you agree
          to these Terms.
        </p>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-2">2. Eligibility and Account</h3>
        <p>
          Users must be at least 13 years old or have parental consent to play. You are responsible
          for maintaining the confidentiality of your login credentials and all activities under
          your account. iZombie may block, suspend, or delete any account at any time, for any
          reason, including misuse or violation of these Terms.
        </p>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-2">3. Gameplay and Content</h3>
        <p>
          iZombie is a geolocation-based experience that combines virtual and real-world
          interactions. Players may collect items, interact with virtual zones, and compete with
          others. You agree not to use the Service for unlawful or harmful purposes. All in-game
          assets are virtual and have no monetary value outside the platform.
        </p>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-2">4. Data Collection and Privacy</h3>
        <p>
          iZombie collects personal and usage data as described in this Privacy Policy. This
          includes geolocation, device data, and gameplay behavior. Data processing follows the
          Brazilian General Data Protection Law (Lei nº 13.709/2018 – LGPD), as well as applicable
          international regulations such as GDPR (EU), CCPA (USA), and Chile’s Ley 19.628.
        </p>
        <p>
          Personal data is used for gameplay features, analytics, fraud prevention, and platform
          improvements. Data may be shared with third-party providers that support essential
          operations (e.g., hosting, analytics, support), always under strict confidentiality.
        </p>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-2">5. User Rights (LGPD / GDPR)</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Access and confirmation of personal data processing.</li>
          <li>Correction of inaccurate or outdated data.</li>
          <li>Deletion or anonymization of personal data.</li>
          <li>Portability to another service provider.</li>
          <li>Withdrawal of consent at any time.</li>
        </ul>
        <p>Requests can be made through the official support form within the game.</p>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-2">6. Communication</h3>
        <p>
          All communication with iZombie must be carried out exclusively through the official
          support form within the game or via the email address provided above. Messages sent
          through other channels will not be considered valid.
        </p>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-2">7. Account Suspension and Termination</h3>
        <p>
          iZombie reserves the right to block, suspend, or delete any player’s participation at any
          time, at its sole discretion, without prior notice, particularly in cases of misconduct,
          violation of Terms, or harmful behavior toward the community or system.
        </p>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-2">8. Modifications and Updates</h3>
        <p>
          These Terms may be updated periodically. Updates will be announced on the official website
          and/or in the app interface. Continued use of the Service after any update constitutes
          acceptance of the new Terms.
        </p>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-2">9. Limitation of Liability</h3>
        <p>
          The iZombie platform is provided “as is,” without warranties of any kind. We are not
          liable for damages arising from misuse, technical failures, or unauthorized access. Users
          are responsible for ensuring their own safety when interacting in real-world locations
          associated with the Game.
        </p>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-2">10. Legal Compliance</h3>
        <p>
          This agreement is governed by the laws of the Federative Republic of Brazil, including the
          Brazilian Civil Code and the General Data Protection Law (LGPD). Any disputes shall be
          resolved in the courts of São Paulo, Brazil, and users expressly consent to this
          jurisdiction.
        </p>
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-2">11. Contact Information</h3>
        <p>
          For questions, complaints, or requests regarding these Terms or our Privacy Policy, please
          contact:
        </p>
        <p className="font-semibold">
          iZombie Support Team <br />
          Website:{' '}
          <a href="https://www.izombie.live" className="text-blue-600 underline">
            https://www.izombie.live
          </a>
        </p>
      </section>

      <footer className="text-sm text-center text-gray-500 pt-6 border-t mt-8">
        <p>Version 1.0 – Last updated: October 2025</p>
        <p>© 2025 iZombie. All rights reserved.</p>
      </footer>
    </div>
  );
}
