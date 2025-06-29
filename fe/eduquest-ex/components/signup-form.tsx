"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "./auth-layout"
import { validateEmail, validatePassword } from "@/lib/validation"

export function SignUpForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [formError, setFormError] = useState("")

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lowercaseEmail = e.target.value.toLowerCase()
    setEmail(lowercaseEmail)
    setEmailError(validateEmail(lowercaseEmail) ? "" : "Please enter a valid email address")
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setPasswordError(
      validatePassword(e.target.value)
        ? ""
        : "Password must be at least 8 characters long and include a number, a lowercase and an uppercase letter",
    )
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setFormError("")
    if (!validateEmail(email) || !validatePassword(password)) {
      return
    }
    setIsLoading(true)

    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
        credentials: "include",
      })
      const data = await res.json()
      if (res.ok && data.success) {
        router.push("/dashboard")
      } else {
        setFormError(data.message || "Signup failed")
      }
    } catch (err) {
      setFormError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Google Auth handler
  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:3001/api/auth/google"
  }

  return (
    <AuthLayout
      title="SIGN UP"
      illustration="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-X4rnAhB1G1Fby2z2jutbdK5PZQTMw8.png"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Name
          </Label>
          <Input
            id="name"
            placeholder="Enter your name"
            type="text"
            value={name}
            onChange={handleNameChange}
            disabled={isLoading}
            className="bg-[#3A4B69] border-0 text-white placeholder:text-gray-400"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">
            Email
          </Label>
          <Input
            id="email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            disabled={isLoading}
            className="bg-[#3A4B69] border-0 text-white placeholder:text-gray-400"
            required
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">
            Password
          </Label>
          <Input
            id="password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            disabled={isLoading}
            className="bg-[#3A4B69] border-0 text-white placeholder:text-gray-400"
            required
          />
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
        </div>
        {formError && <div className="text-red-500 text-sm text-center">{formError}</div>}
        <Button type="submit" className="w-full bg-white text-[#2B3B57] hover:bg-gray-100" disabled={isLoading}>
          {isLoading ? "Signing up..." : "SIGN UP"}
        </Button>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="mx-2 text-gray-400 text-xs">OR</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        <Button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center bg-white text-[#2B3B57] hover:bg-gray-100 border border-gray-200"
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
            alt="Google"
            width={20}
            height={20}
            className="mr-2"
          />
          Continue with Google
        </Button>
        <div className="text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link href="/login" className="text-yellow-500 hover:text-yellow-400">
            Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}

