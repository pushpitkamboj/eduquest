"use client"
// @ts-nocheck

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FaGoogle, FaApple } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "./auth-layout"
import { validateEmail, validatePassword } from "@/lib/validation"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setFormError("")
    if (!validateEmail(email) || !validatePassword(password)) {
      return
    }
    setIsLoading(true)

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })
      const data = await res.json()
      if (res.ok && data.success) {
        // Optionally store token: localStorage.setItem("token", data.token)
        router.push("/dashboard")
      } else {
        setFormError(data.message || "Login failed")
      }
    } catch (err) {
      setFormError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="LOGIN"
      illustration="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-X4rnAhB1G1Fby2z2jutbdK5PZQTMw8.png"
    >
      <form onSubmit={onSubmit} className="space-y-6">
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
        <div className="text-right">
          <Link href="/forgot-password" className="text-yellow-500 hover:text-yellow-400 text-sm">
            Forget password?
          </Link>
        </div>
        <Button type="submit" className="w-full bg-white text-[#2B3B57] hover:bg-gray-100" disabled={isLoading}>
          {isLoading ? "Logging in..." : "PROCEED"}
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-500" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#2B3B57] px-2 text-gray-400">OR</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="bg-[#3A4B69] text-white border-0 hover:bg-[#465B82] flex items-center gap-2"
            type="button"
          >
            <FaGoogle className="text-xl text-red-500" />
            google
          </Button>
          <Button
            variant="outline"
            className="bg-[#3A4B69] text-white border-0 hover:bg-[#465B82] flex items-center gap-2"
            type="button"
          >
            <FaApple className="text-xl" />
            apple
          </Button>
        </div>
        <div className="text-center text-sm text-gray-300">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-yellow-500 hover:text-yellow-400">
            signup
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}