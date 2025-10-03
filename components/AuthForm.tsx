"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthForm() {
  const { data: session } = useSession();
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [isRegister, setIsRegister] = useState(false);

  if (session) {
    return (
      <div>
        <p>Olá, {session.user?.name || session.user?.email}</p>
        <button onClick={() => signOut()}>Logout</button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegister) {
      await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
    }

    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {isRegister && (
        <input
          type="text"
          placeholder="Nome"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Senha"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">{isRegister ? "Registrar" : "Entrar"}</button>
      <button type="button" onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Já tenho conta" : "Criar conta"}
      </button>
      <button type="button" onClick={() => signIn("google")}>
        Login com Google
      </button>
    </form>
  );
}
