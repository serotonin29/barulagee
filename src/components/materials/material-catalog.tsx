"use client";

import { useState, useMemo } from 'react';
import type { Material } from '@/types';
import { allMaterials } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MaterialCard } from '@/components/shared/material-card';

export function MaterialCatalog() {
  const [materials, setMaterials] = useState<Material[]>(allMaterials);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(materials.map((m) => m.category));
    return ['All', ...Array.from(uniqueCategories)];
  }, [materials]);

  const handleBookmarkToggle = (id: string) => {
    setMaterials((prevMaterials) =>
      prevMaterials.map((material) =>
        material.id === id ? { ...material, bookmarked: !material.bookmarked } : material
      )
    );
  };
  
  const filterMaterials = (category: string) => {
    if (category === 'All') return materials;
    return materials.filter((m) => m.category === category);
  };

  return (
    <Tabs defaultValue="All" className="w-full">
      <TabsList>
        {categories.map((category) => (
          <TabsTrigger key={category} value={category}>
            {category}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((category) => (
        <TabsContent key={category} value={category}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filterMaterials(category).map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
