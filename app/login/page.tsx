"use client"

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

	const { data: session } = useSession();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    console.log("Tentando login...")
    const res = await signIn("credentials", {
      email: username,
      password,
      redirect: false, // evita redirecionamento automático
    })

	
    if (res?.error) {
      setError("Login falhou")
    } else {
			console.log("Login bem-sucedido")
      //window.location.href = "/" // redireciona manualmente
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-64">
      <input
        type="text"
        placeholder="Usernames"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2">
        Entrar
      </button>
      {error && <p className="text-red-500">{error}</p>}
			{session && <p>Usuário logado: {session.user?.email}</p>}

    </form>
  )
}
