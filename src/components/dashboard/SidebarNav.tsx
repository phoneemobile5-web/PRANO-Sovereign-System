
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Plus, 
  Terminal, 
  History, 
  Settings, 
  Code,
  Zap,
  ChevronRight,
  FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AIProject } from '@/lib/store';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarNavProps {
  projects: AIProject[];
  onAddProject: () => void;
}

export function SidebarNav({ projects, onAddProject }: SidebarNavProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Playground', icon: Terminal, href: '/playground' },
    { name: 'History', icon: History, href: '/history' },
  ];

  return (
    <div className="flex flex-col w-64 h-full border-r bg-card/50 backdrop-blur-sm">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
          <Zap className="w-5 h-5 fill-current" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground font-headline">AI Workbench</h1>
      </div>

      <div className="px-4 py-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 px-3 transition-all',
                  pathname === item.href ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 px-4 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-3 mb-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">My Projects</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-muted-foreground hover:text-primary"
            onClick={onAddProject}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="space-y-1 px-1">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-3 px-3 py-6 h-auto text-sm transition-all group',
                    pathname === `/projects/${project.id}` 
                      ? 'bg-secondary text-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  )}
                >
                  <FolderOpen className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    pathname === `/projects/${project.id}` ? "text-primary" : "text-muted-foreground"
                  )} />
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="truncate w-full font-medium">{project.name}</span>
                    <span className="text-[10px] text-muted-foreground truncate w-full">
                      {project.model}
                    </span>
                  </div>
                  <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
            ))}
            {projects.length === 0 && (
              <div className="px-3 py-4 text-center">
                <p className="text-xs text-muted-foreground italic">No projects yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="p-4 border-t mt-auto">
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}
