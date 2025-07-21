"use client";

import { useState, useEffect } from 'react';
import type { Material } from '@/types';
import { materials as allMaterials } from '@/lib/data';
import { MainLayout } from '@/components/layout/main-layout';
import { MaterialCard } from '@/components/shared/material-card';

export default function BookmarksPage() {
  const [bookmarkedMaterials, setBookmarkedMaterials] = useState<Material[]>([]);

  useEffect(() => {
    // In a real app, this would be fetched from a user's data
    setBookmarkedMaterials(allMaterials.filter((m) => m.bookmarked));
  }, []);

  const handleBookmarkToggle = (id: string) => {
    // This will remove the item from the bookmarks page instantly
    setBookmarkedMaterials((prev) => prev.filter((material) => material.id !== id));
    // In a real app, you'd also update the global state or refetch
  };

  return (
    <MainLayout pageTitle="My Bookmarks">
      {bookmarkedMaterials.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bookmarkedMaterials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center py-16">
          <h2 className="text-2xl font-semibold">No Bookmarks Yet</h2>
          <p className="text-muted-foreground mt-2">
            You can bookmark materials from the catalog to find them here later.
          </p>
        </div>
      )}
    </MainLayout>
  );
}
