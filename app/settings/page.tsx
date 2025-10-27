'use client';

import { trpc } from '@/lib/trpcClient';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';

export default function StatusPage() {
  const { data: player } = trpc.user.loaduser.useQuery();
  const { data: session, update } = useSession();
  const updateUser = trpc.user.updateUser.useMutation();
  const sendMessage = trpc.message.create.useMutation();

  console.log('OOOOO', player);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmitUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // lógica de submissão do formulário
    if (!session?.user) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get('name');
    const pass = formData.get('password') as string;
    const pass2 = formData.get('password2');

    if (session.user.name?.localeCompare(name as string)) {
      console.log('updating name to:', name);
      updateUser.mutateAsync({ name: name as string });
      await update({ user: { name: name as string } });
    }

    if (pass !== null && pass !== '' && pass.localeCompare(pass2 as string) === 0) {
      console.log('updating password vvv', pass, pass2);
      updateUser.mutateAsync({ password: pass as string });
    }
    form.reset();

    setError('Updated successfully');
  };

  const handleSubmitSupport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // lógica de submissão do formulário
    if (!session?.user) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const message = formData.get('message');
    sendMessage.mutateAsync({
      name: session.user.name as string,
      email: session.user.email as string,
      message: message as string,
      origen: 'support',
    });

    form.reset();
  };

  console.log('settings page player:', player);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  ">
      <section className="contact" id="login">
        <div className="contact-form">
          <h2 className="box-title2 truncate">settings</h2>
          <form onSubmit={handleSubmitUser} className="form">
            <div className="form-group">
              <label htmlFor="name">Player name (public name)</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                onFocus={() => setError('')}
                defaultValue={session?.user?.name as string}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">New password</label>
              <input type="password" onFocus={() => setError('')} id="password" name="password" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Repeat new password</label>
              <input type="password" onFocus={() => setError('')} id="password2" name="password2" />
            </div>

            <button type="submit" className="submit-btn mb-12">
              Update
            </button>

            <div className="text-2xl text-center mt-4">
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </form>
        </div>
      </section>
      <section className="contact" id="login">
        <div className="contact-form">
          <h2 className="box-title2 truncate">Support</h2>
          <form onSubmit={handleSubmitSupport} className="form">
            <div className="form-group">
              <label htmlFor="Message">Message</label>
              <textarea id="message" name="message" required></textarea>
            </div>

            <button type="submit" className="submit-btn mb-12">
              Send
            </button>

            <div className="text-2xl text-center mt-4"></div>
          </form>
        </div>
      </section>
      <section className="contact" id="login">
        <div className="contact-form">
          <h2 className="box-title2 truncate">Strikes</h2>
          <form onSubmit={handleSubmitSupport} className="form">
            {player?.strikes == 0 ? 'You have no strikes, good job!' : 'llll'}
            <div className="text-2xl text-center mt-4"></div>
          </form>
        </div>
      </section>
      <section className="contact" id="login">
        <h2 className="box-title2 truncate">Bye bye</h2>
        <button type="button" onClick={() => signOut()} className="submit-btn mb-12">
          Log out
        </button>
      </section>
    </div>
  );
}
