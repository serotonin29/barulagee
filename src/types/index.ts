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

export type DriveItem = {
  id: string;
  name: string;
  type: 'folder' | 'file';
  parentId: string | null;
  // File-specific properties
  fileType?: 'video' | 'pdf' | 'infographic' | 'text' | 'image';
  source?: string; // URL or identifier
  sourceType?: 'youtube' | 'firebase-storage' | 'external';
  coverImage?: string;
  dataAiHint?: string;
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

export type ForumReply = {
    id: string;
    threadId: string;
    content: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    createdAt: string;
    upvotes: number;
    isVerified: boolean;
};

export type ForumThread = {
    id: string;
    title: string;
    topic: string;
    content: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    createdAt: string;
    upvotes: number;
    isAnswered: boolean;
    replyCount: number;
    replies: ForumReply[];
};
