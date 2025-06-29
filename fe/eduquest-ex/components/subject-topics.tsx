"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SubjectTopicsProps {
  subject: string
  topics: string[]
}

export function SubjectTopics({ subject, topics }: SubjectTopicsProps) {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null)

  const toggleTopic = (topic: string) => {
    if (expandedTopic === topic) {
      setExpandedTopic(null)
    } else {
      setExpandedTopic(topic)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a2c48] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center ">
            <Link href="/subjects">
              <Button variant="ghost" size="icon" className="text-white">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div className="bg-white text-[#1a2c48] px-8 py-2 rounded-full font-semibold text-lg">
              {subject.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-2 gap-4 max-w-[800px]">
          {topics.map((topic, index) => (
            <div key={index} className="space-y-2">
              <Button
                variant="ghost"
                className={`w-full bg-[#B5C7B7] hover:bg-[#A5B7A7] text-[#1a2c48] justify-between h-auto py-4 px-6 font-medium ${
                  expandedTopic === topic ? "rounded-t-lg" : "rounded-lg"
                }`}
                onClick={() => toggleTopic(topic)}
              >
                <span>{topic}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${expandedTopic === topic ? "rotate-180" : ""}`}
                />
              </Button>
              {expandedTopic === topic && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-[#B5C7B7] rounded-b-lg">
                  <Button
                    className="bg-white text-[#1a2c48] hover:bg-gray-100 font-semibold"
                    onClick={() => {
                      console.log(`Downloading PDF for ${topic}`)
                    }}
                  >
                    PDF
                  </Button>
                  <Link
                    href={`/subjects/${encodeURIComponent(subject)}/${encodeURIComponent(topic)}/quiz/easy`}
                    className="w-full"
                  >
                    <Button className="bg-white text-[#1a2c48] hover:bg-gray-100 font-semibold w-full">QUIZ</Button>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Student Illustration */}
        <div className="fixed right-4 center">
          <Image
            src="/images/student-studying.png"
            alt="Student illustration"
            width={300}
            height={600}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}

