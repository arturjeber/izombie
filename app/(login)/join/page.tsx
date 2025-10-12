"use client"

import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation"


export default function LoginPage() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

	const router = useRouter()

	
	

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);
		
		const email = formData.get("email");
		
		signIn("email-request", {email, redirect: false})
		localStorage.setItem("pendingEmail", email as string)
		document.cookie = `pendingEmail=${email}; path=/;`
		router.replace("/onboarding")
  }

	if(loading) return (
		<section className="contact" id="login">
			<h2 className="section-title">sending verification code...</h2>
			</section>
		)
  return (
		<section className="contact" id="login">
			<h2 className="section-title">join</h2>
			<div className="contact-form">
				<form onSubmit={handleSubmit} className="form">
					<div className="form-group">
						<label htmlFor="email">Email* ( Can <b>not</b> be changed later )</label>
						<input type="email" id="email" name="email" required />
					</div>
					
					<button type="submit" className="submit-btn">I'm a survivor</button>
					<div className="text-2xl text-center mt-4">{error && <p className="text-red-500">{error}</p>}</div>
				</form>
			</div>
    </section>
  )
}
