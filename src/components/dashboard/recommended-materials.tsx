"use client";
import { useState, useEffect } from 'react';
import type { Material } from '@/types';
import { materials } from '@/lib/data';
import { MaterialCard } from '@/components/shared/material-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function RecommendedMaterials() {
  const [recommended, setRecommended] = useState<Material[]>([]);

  useEffect(() => {
    // In a real app, this would be based on user data.
    // Here we just take a slice of the mock data.
    setRecommended(materials.slice(0, 2));
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
        <CardTitle>Recommended For You</CardTitle>
        <CardDescription>Materials picked to help you with your studies.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
            {recommended.map((material) => (
                <MaterialCard
                key={material.id}
                material={material}
                onBookmarkToggle={handleBookmarkToggle}
                />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
