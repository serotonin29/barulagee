"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Placeholder data, replace with data from Firestore
const leaderboardData = [
  { rank: 1, name: "Mahasiswa A", points: 1250, avatar: "https://placehold.co/40x40" },
  { rank: 2, name: "Mahasiswa B", points: 1180, avatar: "https://placehold.co/40x40" },
  { rank: 3, name: "Mahasiswa C", points: 1120, avatar: "https://placehold.co/40x40" },
  { rank: 4, name: "Mahasiswa D", points: 1050, avatar: "https://placehold.co/40x40" },
  { rank: 5, name: "Mahasiswa E", points: 980, avatar: "https://placehold.co/40x40" },
  { rank: 6, name: "Mahasiswa F", points: 920, avatar: "https://placehold.co/40x40" },
  { rank: 7, name: "Mahasiswa G", points: 850, avatar: "https://placehold.co/40x40" },
  { rank: 8, name: "Mahasiswa H", points: 810, avatar: "https://placehold.co/40x40" },
  { rank: 9, name: "Mahasiswa I", points: 780, avatar: "https://placehold.co/40x40" },
  { rank: 10, name: "Mahasiswa J", points: 750, avatar: "https://placehold.co/40x40" },
];

export function LeaderboardTable() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Papan Peringkat</CardTitle>
            <CardDescription>Peringkat mahasiswa berdasarkan poin aktivitas.</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="all-time">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="weekly">Mingguan</TabsTrigger>
                    <TabsTrigger value="monthly">Bulanan</TabsTrigger>
                    <TabsTrigger value="all-time">Semua</TabsTrigger>
                </TabsList>
                <TabsContent value="weekly">
                    <p className="p-8 text-center text-muted-foreground">Data mingguan akan segera tersedia.</p>
                </TabsContent>
                <TabsContent value="monthly">
                    <p className="p-8 text-center text-muted-foreground">Data bulanan akan segera tersedia.</p>
                </TabsContent>
                <TabsContent value="all-time" className="mt-4">
                    <div className="overflow-x-auto">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[80px] text-center">Peringkat</TableHead>
                            <TableHead>Nama Mahasiswa</TableHead>
                            <TableHead className="text-right">Total Poin</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaderboardData.map((user) => (
                            <TableRow key={user.rank}>
                                <TableCell className="font-medium text-center">
                                    {user.rank <= 3 ? 
                                        <Badge variant={user.rank === 1 ? 'default' : 'secondary'} className="text-lg w-8 h-8 flex items-center justify-center">{user.rank}</Badge> : 
                                        user.rank
                                    }
                                </TableCell>
                                <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                    <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="student avatar" />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium truncate">{user.name}</span>
                                </div>
                                </TableCell>
                                <TableCell className="text-right font-bold text-primary">{user.points.toLocaleString()}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </CardContent>
    </Card>
  )
}
