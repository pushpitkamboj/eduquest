import { QuizPage } from "@/components/quiz-page"
import { getQuizForTopic } from "@/lib/quiz-generator"
import { notFound } from "next/navigation"

export default async function Quiz({ params }: { params: { subject: string; topic: string; level: string } }) {
  const subject = decodeURIComponent(params.subject)
  const topic = decodeURIComponent(params.topic)
  const level = params.level.toUpperCase() as "EASY" | "MEDIUM" | "HARD"

  const questions = await getQuizForTopic(subject, topic, level)

  if (!questions || questions.length === 0) {
    notFound()
  }

  return <QuizPage subject={subject} topic={topic} questions={questions} level={level} />
}

