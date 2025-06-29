import { SubjectTopics } from "@/components/subject-topics"
import { subjectTopics } from "@/lib/data"
import { notFound } from "next/navigation"

export default function SubjectPage({ params }: { params: { subject: string } }) {
  const subject = decodeURIComponent(params.subject)
  const topics = subjectTopics[subject as keyof typeof subjectTopics]

  if (!topics) {
    notFound()
  }

  return <SubjectTopics subject={subject} topics={topics} />
}

