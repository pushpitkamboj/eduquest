export type QuizLevel = "EASY" | "MEDIUM" | "HARD"

export type QuizQuestion = {
  question: string
  options: string[]
  correctAnswer: number
  level: QuizLevel
}

