import type React from "react"
import Image from "next/image"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  illustration: string
}

export function AuthLayout({ children, title, illustration }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="bg-[#2B3B57] p-6 md:p-10 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-white mb-2">{title}</h1>
          </div>
          {children}
        </div>
      </div>
      <div className="hidden md:flex flex-col items-center justify-center p-10 bg-[#fdfbf2]">
        <div className="relative w-full max-w-md aspect-square">
          <Image
            src={illustration || "/placeholder.svg"}
            alt="Student illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}

