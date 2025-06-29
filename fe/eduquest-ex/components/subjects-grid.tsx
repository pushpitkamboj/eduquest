"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from 'lucide-react'
import { subjectTopics } from "@/lib/data"

export function SubjectsGrid() {
  return (
    <div className="min-h-screen bg-[#fdfbf2] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold ml-6 text-slate-800">SUBJECTS</h1>
        </div>

        {/* Main content */}
        <div className="flex gap-8 items-start">
          {/* Grid of subjects */}
          <div className="grid grid-cols-4 gap-4 flex-[2]">
            {Object.keys(subjectTopics).map((subject, index) => (
              <Link key={index} href={`/subjects/${encodeURIComponent(subject)}`}>
                <div
                  className={`
                    aspect-square rounded-lg p-4 flex items-center justify-center text-center
                    bg-[#7BA5B9] hover:bg-[#6B95A9] cursor-pointer text-white
                    transition-all duration-200 ease-in-out
                    transform hover:scale-[1.02] shadow-sm hover:shadow-md
                  `}
                >
                  <span className="text-sm font-medium">{subject}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Illustration */}
          <div className=" flex justify-center ">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-06-27%20193824-9vUmuZtuiizySxLgGDFZ7lAJMB0pBX.png"
              alt="Student studying with papers and laptop"
              width={500}
              height={500}
              className="object-contain drop-shadow-sm"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}