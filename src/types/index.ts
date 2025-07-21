export type Material = {
  id: string;
  title: string;
  category: 'Anatomy' | 'Physiology' | 'Neurology' | string;
  type: 'video' | 'pdf' | 'infographic' | 'text';
  source: string;
  progress: number;
  bookmarked: boolean;
  coverImage: string;
  dataAiHint: string;
};

export type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
};

export type Quiz = {
  id:string;
  title: string;
  topic: string;
  questions: Question[];
};

export type Announcement = {
  id: string;
  title: string;
  date: string;
  content: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  message: string;
};
