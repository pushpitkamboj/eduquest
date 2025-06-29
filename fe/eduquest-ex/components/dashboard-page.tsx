"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Book, Home, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

function CircularProgress({ value, strokeWidth = 8 }: { value: number; strokeWidth?: number }) {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <svg className="w-full h-full" viewBox="0 0 100 100">
      <circle className="stroke-slate-200" strokeWidth={strokeWidth} fill="none" cx="50" cy="50" r={radius} />
      <circle
        className="stroke-[#1a2c48] transition-all duration-500 ease-in-out"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        cx="50"
        cy="50"
        r={radius}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 50 50)"
      />
    </svg>
  )
}

export function DashboardPage() {
  const router = useRouter()
  const [avatar, setAvatar] = useState("/images/avatars/male.png")

  useEffect(() => {
    // Load avatar from localStorage
    const savedSettings = localStorage.getItem("userSettings")
    if (savedSettings) {
      const { avatar } = JSON.parse(savedSettings)
      setAvatar(avatar)
    }
  }, [])

  const handleContinue = () => {
    router.push("/subjects/Databases")
  }

  // Logout handler that calls backend and then redirects
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (err) {
      // Optionally handle error
    } finally {
      router.push("/")
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      {/* Sidebar */}
      <div className="w-24 bg-[#1a2c48] flex flex-col items-center py-8 space-y-8">
        <div className="relative w-16 h-16 rounded-full overflow-hidden">
          <Image src={avatar || "/placeholder.svg"} alt="Profile picture" className="object-cover" fill />
        </div>
        <Button variant="ghost" className="text-white text-sm w-full">
          My Profile
        </Button>
        <nav className="flex flex-col items-center space-y-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-white h-12 w-12">
              <Home className="h-8 w-8" />
            </Button>
          </Link>
          <Link href="/subjects">
            <Button variant="ghost" size="icon" className="text-white h-12 w-12">
              <Book className="h-8 w-8" />
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="text-white h-12 w-12">
              <Settings className="h-8 w-8" />
            </Button>
          </Link>
        </nav>
        <div className="mt-auto">
          <Button
            variant="ghost"
            size="icon"
            className="text-white h-12 w-12"
            onClick={handleLogout}
          >
            <LogOut className="h-8 w-8" />
          </Button>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-8 space-y-8">
        <h1 className="text-2xl font-bold mb-6">DASHBOARD</h1>

        {/* Welcome Card */}
        <div className="bg-[#7BA5B9] rounded-2xl p-8 flex justify-between items-center relative overflow-hidden">
          <div className="space-y-2 z-10">
            <h2 className="text-3xl font-bold text-slate-900"> Welcome, Future Achiever!!</h2>
            <p className="text-slate-800 max-w-md">
              "From practice to perfection, we've got your back.
              <br />
              Let's make every question count!"
            </p>
            <div className="mt-6">
              <Button variant="default" className="bg-[#1a2c48] hover:bg-[#2a3c58] text-white px-6" asChild>
                <Link href="/subjects">Let's Practice →</Link>
              </Button>
            </div>
          </div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2">
            <Image
              src="/images/student-dashboard.png"
              alt="Student studying"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* DBMS Progress */}
          <div className="bg-[#7BA5B9] rounded-2xl p-8 flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">DBMS</h3>
            <div className="relative w-32 h-32">
              <CircularProgress value={75} strokeWidth={10} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">75%</span>
              </div>
            </div>
            <p className="mt-4 text-slate-800">Keep it up!</p>
            <Button
              variant="default"
              className="w-1/2 mt-4 bg-[#1a2c48] hover:bg-[#2a3c58] text-white"
              onClick={handleContinue}
            >
              CONTINUE →
            </Button>
          </div>

          {/* Performance Check */}
          <div className="bg-[#7BA5B9] rounded-2xl p-8 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-4">DBMS PERFORMANCE</h3>
              <p className="text-slate-800 mb-6">CHECK FOR :</p>
              <div className="space-y-2">
                <Button
                  variant="default"
                  className="w-full bg-[#1a2c48] hover:bg-[#2a3c58] text-white"
                  onClick={() => router.push("/subjects/Algorithms")}
                >
                  Algorithms
                </Button>
                <Button
                  variant="default"
                  className="w-full bg-[#1a2c48] hover:bg-[#2a3c58] text-white"
                  onClick={() => router.push("/subjects/Data Structures")}
                >
                  DSA
                </Button>
                <Button
                  variant="default"
                  className="w-full bg-[#1a2c48] hover:bg-[#2a3c58] text-white"
                  onClick={() => router.push("/subjects")}
                >
                  Others →
                </Button>
              </div>
            </div>
            <Image
              src="/images/performance-graph.png"
              alt="Performance Graph"
              width={150}
              height={100}
              className="object-contain ml-4"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

