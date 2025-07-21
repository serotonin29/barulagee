"use client";

import { BookOpen, HelpCircle, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const data = [
  { name: 'Anatomy', progress: 75, opened: 12, quizzes: 3, score: 88 },
  { name: 'Physiology', progress: 50, opened: 8, quizzes: 2, score: 75 },
  { name: 'Neurology', progress: 100, opened: 15, quizzes: 4, score: 95 },
];

export function ProgressOverview() {
  const totalOpened = data.reduce((acc, item) => acc + item.opened, 0);
  const totalQuizzes = data.reduce((acc, item) => acc + item.quizzes, 0);
  const averageScore = data.length > 0 ? (data.reduce((acc, item) => acc + item.score, 0) / data.length) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progres Belajar</CardTitle>
        <CardDescription>Ringkasan kemajuan Anda di berbagai mata pelajaran.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
            {data.map((item) => (
                <div key={item.name}>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground">{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                </div>
            ))}
        </div>
        <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t">
            <div className="flex flex-col items-center gap-1">
                <BookOpen className="h-6 w-6 text-muted-foreground"/>
                <p className="text-xl font-bold">{totalOpened}</p>
                <p className="text-xs text-muted-foreground">Materi Dibuka</p>
            </div>
            <div className="flex flex-col items-center gap-1">
                <HelpCircle className="h-6 w-6 text-muted-foreground"/>
                <p className="text-xl font-bold">{totalQuizzes}</p>
                <p className="text-xs text-muted-foreground">Kuis Selesai</p>
            </div>
            <div className="flex flex-col items-center gap-1">
                <Trophy className="h-6 w-6 text-muted-foreground"/>
                <p className="text-xl font-bold">{averageScore.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Skor Rata-rata</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
