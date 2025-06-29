"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { QuizQuestion, QuizLevel } from "@/types/quiz"

interface QuizPageProps {
  subject: string
  topic: string
  questions: QuizQuestion[]
  level: QuizLevel
}

export function QuizPage({ subject, topic, questions, level }: QuizPageProps) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)

  const question = questions[currentQuestion]
  const totalQuestions = questions.length
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  function handleNext() {
    if (selectedAnswer === null) return

    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)

    if (currentQuestion + 1 < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      setShowResult(true)
    }
  }

  function calculateScore() {
    const correctAnswers = answers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0)
    }, 0)
    return Math.round((correctAnswers / totalQuestions) * 100)
  }

  function handleRetry() {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setAnswers([])
    setShowResult(false)
  }

  function handleNextLevel() {
    const nextLevel = level === "EASY" ? "MEDIUM" : "HARD"
    router.push(`/subjects/${encodeURIComponent(subject)}/${encodeURIComponent(topic)}/quiz/${nextLevel.toLowerCase()}`)
  }

  if (showResult) {
    const score = calculateScore()
    const passed = score > 70

    return (
      <div className="min-h-screen bg-[#7BA5B9] p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href={`/subjects/${encodeURIComponent(subject)}`}>
              <Button variant="ghost" size="icon" className="text-[#1a2c48]">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h2 className="text-[#1a2c48] font-semibold">
              RESULT FOR {topic.toUpperCase()} - {level}
            </h2>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-white/30 rounded-full mb-12">
            <div className="h-full bg-white rounded-full" style={{ width: "100%" }} />
          </div>

          {/* Result Circle */}
          <div className="flex flex-col items-center gap-8 mb-12">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="stroke-white/30" strokeWidth="8" fill="none" cx="50" cy="50" r="46" />
                <circle
                  className="stroke-[#1a2c48] transition-all duration-1000"
                  strokeWidth="8"
                  fill="none"
                  cx="50"
                  cy="50"
                  r="46"
                  strokeDasharray={`${score * 2.89}, 289`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-[#1a2c48]">{score}%</span>
              </div>
            </div>
            <div className="text-[#1a2c48] font-semibold">LEVEL : {level}</div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            <Button onClick={handleRetry} className="bg-[#1a2c48] text-white hover:bg-[#2a3c58]">
              RETRY
            </Button>
            {passed && level !== "HARD" && (
              <Button onClick={handleNextLevel} className="bg-[#1a2c48] text-white hover:bg-[#2a3c58]">
                NEXT LEVEL
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#7BA5B9] p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href={`/subjects/${encodeURIComponent(subject)}`}>
            <Button variant="ghost" size="icon" className="text-[#1a2c48]">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h2 className="text-[#1a2c48] font-semibold">LEVEL : {level}</h2>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-white/30 rounded-full mb-12">
          <div className="h-full bg-white rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        {/* Question */}
        <div className="space-y-8 mb-12">
          <h3 className="text-[#1a2c48] text-lg font-medium">
            {currentQuestion + 1}. {question.question}
          </h3>
          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => setSelectedAnswer(Number.parseInt(value))}
            className="space-y-4"
          >
            {question.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-white/10 p-4 rounded-lg cursor-pointer hover:bg-white/20"
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                  className="border-[#1a2c48] text-[#1a2c48]"
                />
                <Label htmlFor={`option-${index}`} className="text-[#1a2c48] font-medium cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Next Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="bg-[#1a2c48] text-white hover:bg-[#2a3c58]"
          >
            NEXT
          </Button>
        </div>
      </div>
    </div>
  )
}

