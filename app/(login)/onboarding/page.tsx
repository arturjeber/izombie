'use client';

import Countdown10 from '@/components/Countdown10';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = localStorage.getItem('pendingEmail');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      pass: formData.get('password') as string,
      code: formData.get('code') as string,
    };

    if (data.pass?.length < 6) return setError('Password with minimum 6 characters.');
    if (data.code?.length !== 6) return setError('Invalid validation code.');

    const res = await signIn('email-code', {
      email,
      ...data,
      redirect: false, // vamos controlar o redirect manualmente
    });

    if (!res || res.error) {
      setError('Código inválido ou expirado.');
    } else {
      // ✅ login completo, sessão criada
      localStorage.removeItem('pendingEmail'); // apaga apenas o 'token'
      document.cookie = 'pendingEmail=; path=/; max-age=0';
      router.replace('/status'); // ou /home, etc
      setError('');
    }
  }

  const newCode = async () => {
    if (loading) return;
    const email = localStorage.getItem('pendingEmail');

    setLoading(true);
    signIn('email-custom', { email, redirect: false });
  };

  // Gera apenas uma vez ao montar o componente
  const randomName = useMemo(() => {
    const randomNum = Math.floor(100000 + Math.random() * 900000); // 6 dígitos (100000–999999)
    return `Survivor ${randomNum}`;
  }, []);

  return (
    <section className="contact" id="login">
      <h2 className="section-title">Welcome</h2>
      <div className="contact-form">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name">Player name (public name)</label>
            <input type="text" id="name" name="name" required defaultValue={randomName} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <div className="form-group">
            <label htmlFor="code">
              Verification code ( check your e-mail)
              <span className="text-white text-xs" onClick={() => newCode()}>
                <Countdown10 onFinish={() => setLoading(false)} />
              </span>
            </label>
            <input type="text" id="code" name="code" required />
          </div>

          <button type="submit" className="submit-btn mb-12">
            Start
          </button>

          <div className="text-2xl text-center mt-4">
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </form>
      </div>
    </section>
  );
}
