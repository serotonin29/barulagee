"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const data = [
  { name: 'Anatomy', progress: 75, opened: 12, quizzes: 3, score: 88 },
  { name: 'Physiology', progress: 50, opened: 8, quizzes: 2, score: 75 },
  { name: 'Neurology', progress: 100, opened: 15, quizzes: 4, score: 95 },
];

const chartConfig = {
  progress: {
    label: "Progress",
    color: "hsl(var(--primary))",
  },
};

export function ProgressOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progres Belajar</CardTitle>
        <CardDescription>Visualisasi materi yang sudah Anda pelajari.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} accessibilityLayer margin={{ top: 20 }}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip
                cursor={{ fill: 'hsl(var(--accent))', radius: 'var(--radius)' }}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="progress" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
                <p className="text-2xl font-bold">{data.reduce((acc, item) => acc + item.opened, 0)}</p>
                <p className="text-sm text-muted-foreground">Materi Dibuka</p>
            </div>
            <div>
                <p className="text-2xl font-bold">{data.reduce((acc, item) => acc + item.quizzes, 0)}</p>
                <p className="text-sm text-muted-foreground">Kuis Selesai</p>
            </div>
            <div>
                <p className="text-2xl font-bold">
                    {(data.reduce((acc, item) => acc + item.score, 0) / data.length).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">Skor Rata-rata</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
