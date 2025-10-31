'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const email = formData.get('email');

    signIn('email-request', { email, redirect: false });
    localStorage.setItem('pendingEmail', email as string);
    document.cookie = `pendingEmail=${email}; path=/;`;
    router.replace('/onboarding');
    setError('');
    setLoading(false);
  }

  return (
    <section className="contact" id="login">
      <h2 className="section-title">Do you best or died trying...</h2>
      <div className="contact-form">
        <button type="button" className="submit-btn">
          {`Let's survive`}
        </button>
      </div>
    </section>
  );
}
