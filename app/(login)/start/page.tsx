'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  async function start() {
    router.replace('/status');
  }

  useEffect(() => {
    localStorage.removeItem('pendingEmail'); // apaga apenas o 'token'
    document.cookie = 'pendingEmail=; path=/; max-age=0';
  }, []);

  return (
    <section className="contact" id="login">
      <h2 className="section-title">Do your best or die trying...</h2>
      <div className="contact-form">
        <button onClick={start} type="button" className="submit-btn">
          {`Let's survive!`}
        </button>
      </div>
    </section>
  );
}
