
'use client';

import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { useWorkbenchStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Trash2, Star, Filter, Search, Clock, ExternalLink, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function HistoryPage() {
  const { projects, sessions, isLoaded, toggleBookmark, deleteSession } = useWorkbenchStore();
  const [filter, setFilter] = useState<'all' | 'bookmarked'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isLoaded) return null;

  const filteredSessions = sessions.filter(session => {
    const matchesFilter = filter === 'all' || session.isBookmarked;
    const matchesSearch = session.input.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          session.output.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarNav projects={projects} onAddProject={() => {}} />
      
      <main className="flex-1 flex flex-col min-w-0 bg-card/10">
        <header className="h-20 border-b flex items-center justify-between px-8 bg-card/20 backdrop-blur-md shrink-0">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold tracking-tight">Interaction History</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Automatic experiment archival</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search outputs..." 
                className="pl-10 bg-secondary/30 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex bg-secondary/30 rounded-md p-1 border">
              <Button 
                variant={filter === 'all' ? 'secondary' : 'ghost'} 
                size="sm" 
                className="h-7 text-xs px-4"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button 
                variant={filter === 'bookmarked' ? 'secondary' : 'ghost'} 
                size="sm" 
                className="h-7 text-xs px-4"
                onClick={() => setFilter('bookmarked')}
              >
                Bookmarked
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredSessions.length > 0 ? (
              filteredSessions.map(session => (
                <div key={session.id} className="group bg-card/30 border rounded-xl overflow-hidden hover:border-primary/30 transition-all">
                  <div className="p-4 border-b flex items-center justify-between bg-muted/20">
                    <div className="flex items-center gap-3">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">
                        {new Date(session.timestamp).toLocaleString()}
                      </span>
                      <Badge variant="outline" className="text-[10px] h-5">
                        {projects.find(p => p.id === session.projectId)?.name || 'Project'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-accent"
                        onClick={() => toggleBookmark(session.id)}
                      >
                        <Star className={cn("w-4 h-4", session.isBookmarked && "fill-accent text-accent")} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteSession(session.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/projects/${session.projectId}`}>
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="p-5 grid gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Input Query</p>
                      <p className="text-sm font-medium">{session.input}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Model Response</p>
                      <div className="bg-secondary/10 rounded-lg p-3 text-sm font-code leading-relaxed text-muted-foreground whitespace-pre-wrap border border-secondary/20">
                        {session.output}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto">
                  <History className="w-8 h-8 text-muted/40" />
                </div>
                <h3 className="text-xl font-semibold">No interactions found</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">Try refining your search or create some sessions in the playground.</p>
                <Button variant="outline" asChild>
                  <Link href="/playground">Open Playground</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
