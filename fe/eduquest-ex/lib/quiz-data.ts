import type { QuizQuestion } from "@/types/quiz"

export const quizData: Record<string, Record<string, QuizQuestion[]>> = {
  Databases: {
    "ER-Model": [
      {
        question: "What is an entity in ER model?",
        options: ["A real-world object", "A database table", "A relationship", "An attribute"],
        correctAnswer: 0,
        level: "EASY",
      },
      // Add more questions
    ],
    "Normal Forms": [
      {
        question: "Which normal form is considered adequate for normal relational database design?",
        options: ["3 N F", "5 N F", "2 N F", "4 N F"],
        correctAnswer: 0,
        level: "EASY",
      },
      // Add more questions
    ],
    // Add other Database topics
  },
  "Data Structures": {
    Arrays: [
      {
        question: "What is the time complexity of accessing an element in an array?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        level: "EASY",
      },
      // Add more questions
    ],
    // Add other Data Structures topics
  },
  // Add other subjects
}

