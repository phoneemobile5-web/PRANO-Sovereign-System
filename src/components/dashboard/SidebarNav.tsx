
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
  FolderOpen,
  LogIn,
  LogOut,
  User,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AIProject } from '@/lib/store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser, useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarNavProps {
  projects: AIProject[];
  onAddProject: () => void;
}

export function SidebarNav({ projects, onAddProject }: SidebarNavProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const auth = useAuth();

  const handleLogin = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  const navItems = [
    { name: 'الرئيسية', icon: LayoutDashboard, href: '/' },
    { name: 'مختبر Gemma', icon: Sparkles, href: '/chat' },
    { name: 'المختبر التفاعلي', icon: Terminal, href: '/playground' },
    { name: 'السجل', icon: History, href: '/history' },
  ];

  return (
    <div className="flex flex-col w-64 h-full border-l bg-card/50 backdrop-blur-sm" dir="rtl">
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
                  'w-full justify-start gap-3 px-3 transition-all text-right',
                  pathname === item.href ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className="w-4 h-4 ml-2" />
                {item.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 px-4 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-3 mb-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">مشاريعي</h2>
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
                    'w-full justify-start gap-3 px-3 py-6 h-auto text-sm transition-all group text-right',
                    pathname === `/projects/${project.id}` 
                      ? 'bg-secondary text-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  )}
                >
                  <FolderOpen className={cn(
                    "w-4 h-4 shrink-0 transition-colors ml-2",
                    pathname === `/projects/${project.id}` ? "text-primary" : "text-muted-foreground"
                  )} />
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="truncate w-full font-medium">{project.name}</span>
                    <span className="text-[10px] text-muted-foreground truncate w-full">
                      {project.model}
                    </span>
                  </div>
                </Button>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="p-4 border-t mt-auto space-y-2">
        {user ? (
          <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-secondary/50 border border-border/50">
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={user.photoURL || ''} />
              <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 mr-3">
              <span className="text-xs font-medium truncate">{user.displayName || 'User'}</span>
              <button onClick={handleLogout} className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-1">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <Button variant="outline" className="w-full justify-start gap-3 text-muted-foreground" onClick={handleLogin}>
            Login to Sync
          </Button>
        )}
      </div>
    </div>
  );
}
