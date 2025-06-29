import { QuizPage } from "@/components/quiz-page"
import { getQuizForTopic } from "@/lib/quiz-generator"
import { notFound } from "next/navigation"

export default async function Quiz({ params }: { params: { subject: string; topic: string } }) {
  const subject = decodeURIComponent(params.subject)
  const topic = decodeURIComponent(params.topic)

  const questions = await getQuizForTopic(subject, topic)

  if (!questions || questions.length === 0) {
    notFound()
  }

  return <QuizPage subject={subject} topic={topic} questions={questions} />
}

