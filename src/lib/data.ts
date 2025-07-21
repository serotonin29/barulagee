import type { Material, Quiz, Announcement } from '@/types';

export const materials: Material[] = [
  {
    id: 'mat-001',
    title: 'Introduction to Human Anatomy',
    category: 'Anatomy',
    type: 'video',
    source: 'youtube.com',
    progress: 75,
    bookmarked: true,
    coverImage: 'https://placehold.co/600x400',
    dataAiHint: 'anatomy illustration',
  },
  {
    id: 'mat-002',
    title: 'The Endocrine System',
    category: 'Physiology',
    type: 'pdf',
    source: 'coursera.org',
    progress: 50,
    bookmarked: false,
    coverImage: 'https://placehold.co/600x400',
    dataAiHint: 'endocrine system',
  },
  {
    id: 'mat-003',
    title: 'Basics of Neurology',
    category: 'Neurology',
    type: 'infographic',
    source: 'study.com',
    progress: 100,
    bookmarked: true,
    coverImage: 'https://placehold.co/600x400',
    dataAiHint: 'brain neurons',
  },
  {
    id: 'mat-004',
    title: 'Cardiovascular System Explained',
    category: 'Physiology',
    type: 'video',
    source: 'youtube.com',
    progress: 20,
    bookmarked: false,
    coverImage: 'https://placehold.co/600x400',
    dataAiHint: 'heart anatomy',
  },
  {
    id: 'mat-005',
    title: 'Skeletal Structure and Bones',
    category: 'Anatomy',
    type: 'pdf',
    source: 'textbook.com',
    progress: 0,
    bookmarked: false,
    coverImage: 'https://placehold.co/600x400',
    dataAiHint: 'human skeleton',
  },
  {
    id: 'mat-006',
    title: 'Synaptic Transmission',
    category: 'Neurology',
    type: 'video',
    source: 'khanacademy.org',
    progress: 0,
    bookmarked: false,
    coverImage: 'https://placehold.co/600x400',
    dataAiHint: 'neural synapse',
  },
];

export const quizzes: Quiz[] = [
  {
    id: 'quiz-01',
    title: 'Anatomy Basics Quiz',
    topic: 'Anatomy',
    questions: [
      {
        id: 'q1',
        text: 'What is the largest organ in the human body?',
        options: ['Liver', 'Skin', 'Heart', 'Brain'],
        correctAnswer: 'Skin',
      },
      {
        id: 'q2',
        text: 'How many bones are in the adult human body?',
        options: ['206', '210', '195', '250'],
        correctAnswer: '206',
      },
    ],
  },
  {
    id: 'quiz-02',
    title: 'Physiology Fundamentals',
    topic: 'Physiology',
    questions: [
      {
        id: 'q1',
        text: 'Which hormone is known as the "stress hormone"?',
        options: ['Insulin', 'Cortisol', 'Glucagon', 'Thyroxine'],
        correctAnswer: 'Cortisol',
      },
      {
        id: 'q2',
        text: 'Where does most of the nutrient absorption occur?',
        options: ['Stomach', 'Large Intestine', 'Small Intestine', 'Esophagus'],
        correctAnswer: 'Small Intestine',
      },
    ],
  },
];

export const announcements: Announcement[] = [
  {
    id: 'ann-01',
    title: 'Final Exams Schedule',
    date: '2024-07-20',
    content: 'The final exam schedule for the semester has been posted. Please check the student portal for details.',
  },
  {
    id: 'ann-02',
    title: 'New Course Available',
    date: '2024-07-18',
    content: 'A new advanced course on Neuropharmacology is now available for enrollment.',
  },
];
