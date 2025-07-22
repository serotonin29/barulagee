import type { Material, Quiz, Announcement, ForumThread, ForumReply, DriveItem } from '@/types';

export const driveItems: DriveItem[] = [
  // Root level folders
  { id: 'folder-anatomi', name: 'Anatomi', type: 'folder', parentId: null },
  { id: 'folder-fisiologi', name: 'Fisiologi', type: 'folder', parentId: null },
  { id: 'folder-neurologi', name: 'Neurologi', type: 'folder', parentId: null },

  // Root level file
  { id: 'file-kurikulum', name: 'Kurikulum 2024.pdf', type: 'file', fileType: 'pdf', parentId: null },

  // Inside Anatomi
  { id: 'folder-anatomi-kepala', name: 'Kepala & Leher', type: 'folder', parentId: 'folder-anatomi' },
  { id: 'file-anatomi-umum', name: 'Pengantar Anatomi Umum.mp4', type: 'file', fileType: 'video', parentId: 'folder-anatomi' },

  // Inside Fisiologi
  { id: 'file-fisiologi-sel', name: 'Fisiologi Sel.pdf', type: 'file', fileType: 'pdf', parentId: 'folder-fisiologi' },
  { id: 'file-sistem-kardio', name: 'Infografik Kardiovaskular.png', type: 'file', fileType: 'image', parentId: 'folder-fisiologi', coverImage: 'https://placehold.co/600x400', dataAiHint: 'cardiovascular system' },

  // Inside Anatomi > Kepala & Leher
  { id: 'file-anatomi-otak', name: 'Struktur Otak.pdf', type: 'file', fileType: 'pdf', parentId: 'folder-anatomi-kepala' },
];


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

export const forumReplies: ForumReply[] = [
  {
    id: 'rep-001',
    threadId: 'thr-001',
    authorId: 'user-002',
    authorName: 'Dosen Budi',
    authorAvatar: 'https://placehold.co/32x32',
    content: 'Pertanyaan bagus! Saraf kranial adalah 12 pasang saraf yang berasal langsung dari otak, bukan dari sumsum tulang belakang. Mereka bertanggung jawab untuk fungsi sensorik dan motorik di kepala dan leher.',
    createdAt: '2024-07-20T11:00:00Z',
    upvotes: 15,
    isVerified: true,
  },
  {
    id: 'rep-002',
    threadId: 'thr-001',
    authorId: 'user-003',
    authorName: 'Mahasiswa Chandra',
    authorAvatar: 'https://placehold.co/32x32',
    content: 'Terima kasih, Pak Budi. Apakah nervus vagus termasuk di dalamnya?',
    createdAt: '2024-07-20T11:30:00Z',
    upvotes: 3,
    isVerified: false,
  },
   {
    id: 'rep-003',
    threadId: 'thr-002',
    authorId: 'user-004',
    authorName: 'Mahasiswa Dini',
    authorAvatar: 'https://placehold.co/32x32',
    content: 'Siklus Krebs terjadi di dalam mitokondria. Ini adalah bagian penting dari respirasi seluler untuk menghasilkan ATP.',
    createdAt: '2024-07-21T09:00:00Z',
    upvotes: 8,
    isVerified: false,
  },
];

export const forumThreads: ForumThread[] = [
  {
    id: 'thr-001',
    title: 'Perbedaan Saraf Kranial dan Saraf Spinal',
    topic: 'Anatomy',
    content: 'Selamat pagi, saya masih bingung mengenai perbedaan fundamental antara saraf kranial dan saraf spinal. Apakah ada yang bisa menjelaskan dengan sederhana?',
    authorId: 'user-001',
    authorName: 'Mahasiswa Ani',
    authorAvatar: 'https://placehold.co/32x32',
    createdAt: '2024-07-20T10:30:00Z',
    upvotes: 12,
    isAnswered: true,
    replyCount: 2,
    replies: forumReplies.filter(r => r.threadId === 'thr-001'),
  },
  {
    id: 'thr-002',
    title: 'Lokasi Siklus Krebs',
    topic: 'Physiology',
    content: 'Di mana tepatnya siklus Krebs berlangsung di dalam sel? Apakah ada kondisi khusus yang diperlukan?',
    authorId: 'user-004',
    authorName: 'Mahasiswa Dini',
    authorAvatar: 'https://placehold.co/32x32',
    createdAt: '2024-07-21T08:45:00Z',
    upvotes: 5,
    isAnswered: false,
    replyCount: 1,
    replies: forumReplies.filter(r => r.threadId === 'thr-002'),
  },
    {
    id: 'thr-003',
    title: 'Penggunaan Obat Beta-Blocker',
    topic: 'Pharmacology',
    content: 'Kapan kita seharusnya meresepkan beta-blocker untuk pasien hipertensi? Apa saja kontraindikasinya?',
    authorId: 'user-005',
    authorName: 'Mahasiswa Eka',
    authorAvatar: 'https://placehold.co/32x32',
    createdAt: '2024-07-22T14:00:00Z',
    upvotes: 8,
    isAnswered: false,
    replyCount: 0,
    replies: [],
  },
];
