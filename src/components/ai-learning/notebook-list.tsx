"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, LayoutGrid, List, MoreVertical, Book, Dna, Microscope } from "lucide-react"

const notebooks = [
  {
    id: 1,
    title: "Untitled notebook",
    date: "Jul 18, 2025",
    sources: 0,
    icon: <Book className="w-16 h-16 text-purple-400" />,
    color: "bg-purple-100/50 dark:bg-purple-900/20"
  },
  {
    id: 2,
    title: "Selubung Nukleus: Pelindung DNA Sel...",
    date: "Jul 16, 2025",
    sources: 1,
    icon: <Dna className="w-16 h-16 text-pink-400" />,
    color: "bg-pink-100/50 dark:bg-pink-900/20"
  },
  {
    id: 3,
    title: "Ringkasan Biologi Sel: Struktur & Fungsi",
    date: "Jul 13, 2025",
    sources: 1,
    icon: <Microscope className="w-16 h-16 text-green-400" />,
    color: "bg-green-100/50 dark:bg-green-900/20"
  },
]

export function NotebookList() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Selamat datang di NeuroZsis Notebook</h1>
      </header>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <Button size="lg" className="flex-shrink-0">
          <Plus className="mr-2 h-5 w-5" />
          Buat Notebook Baru
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border bg-card p-1">
            <Button variant="ghost" size="icon" className="bg-accent text-accent-foreground">
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <List className="h-5 w-5" />
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-between">
                Most recent
                <List className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Terbaru</DropdownMenuItem>
              <DropdownMenuItem>Terlama</DropdownMenuItem>
              <DropdownMenuItem>A-Z</DropdownMenuItem>
              <DropdownMenuItem>Z-A</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {notebooks.map((notebook) => (
          <Card key={notebook.id} className="group flex flex-col justify-between overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 flex-grow">
              <div className={`flex items-center justify-center w-full h-32 rounded-lg mb-6 ${notebook.color}`}>
                {notebook.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2 truncate">{notebook.title}</h3>
              <p className="text-sm text-muted-foreground">{notebook.date} • {notebook.sources} sources</p>
            </CardContent>
             <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
