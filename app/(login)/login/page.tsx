"use client"

import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState("")

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		setError("")
    e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);
		const data = {
			email: formData.get("email"),
			password: formData.get("password")
		};

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false, 
			callbackUrl: "/status", // página para redirecionar
    })
		if(res?.error) setError("Invalid login.")
		else redirect("/status")
  }

  return (
		<section className="contact" id="login">
			<h2 className="section-title">Login</h2>
			<div className="contact-form">
				<form onSubmit={handleSubmit} className="form">
					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input type="email" id="email" name="email" required />
					</div>

					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input type="password" id="password" name="password" required />
					</div>
					
					<button type="submit" className="submit-btn">I'm back</button>
					<div className="text-2xl text-center mt-4">{error && <p className="text-red-500">{error}</p>}</div>
				</form>
			</div>
    </section>
  )
}
