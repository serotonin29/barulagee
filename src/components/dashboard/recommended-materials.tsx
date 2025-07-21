"use client";
import { useState, useEffect } from 'react';
import type { Material } from '@/types';
import { materials } from '@/lib/data';
import { MaterialCard } from '@/components/shared/material-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function RecommendedMaterials() {
  const [recommended, setRecommended] = useState<Material[]>([]);

  useEffect(() => {
    // In a real app, this would be based on user data.
    // Here we just take a slice of the mock data.
    setRecommended(materials.slice(0, 4));
  }, []);

  const handleBookmarkToggle = (id: string) => {
    setRecommended((prev) =>
      prev.map((material) =>
        material.id === id ? { ...material, bookmarked: !material.bookmarked } : material
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rekomendasi Materi</CardTitle>
        <CardDescription>Materi pilihan untuk membantu studi Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-1">
            {recommended.map((material) => (
                <div key={material.id} className="flex items-center gap-4 p-2 rounded-lg border">
                    <div className="flex-grow">
                        <p className="font-semibold">{material.title}</p>
                        <p className="text-sm text-muted-foreground">{material.category}</p>
                    </div>
                    <Button>Mulai</Button>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
