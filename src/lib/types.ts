export type Subject = "nahwu" | "sharaf";
export type UserRole = "student" | "admin";

export type ContentBlock = {
  heading?: string;
  body: string;
  arabic?: string;
  translation?: string;
};

export type Lesson = {
  id: string;
  slug: string;
  title: string;
  subject: Subject;
  level: string;
  summary: string;
  content: ContentBlock[];
  published: boolean;
  order_no: number;
  created_at: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
};

export type Quiz = {
  id: string;
  lesson_id: string;
  title: string;
  questions: QuizQuestion[];
  published: boolean;
};

export type QuizAttempt = {
  id: string;
  quiz_id: string;
  score: number;
  total: number;
  created_at: string;
};
