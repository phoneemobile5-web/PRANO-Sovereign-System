
'use client';

import { useState } from 'react';
import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { useWorkbenchStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Terminal, Play, Send, RefreshCw, Cpu, Layers } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { testAIProjectResponses } from '@/ai/flows/test-ai-project-responses';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

export default function PlaygroundPage() {
  const { projects, addSession, isLoaded } = useWorkbenchStore();
  const { toast } = useToast();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = async () => {
    if (!selectedProjectId || !input) return;
    const project = projects.find(p => p.id === selectedProjectId);
    if (!project) return;

    setIsLoading(true);
    try {
      const result = await testAIProjectResponses({ 
        prompt: `${project.prompt}\n\nUser: ${input}` 
      });
      setOutput(result.response);
      addSession(project.id, input, result.response);
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate response.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarNav projects={projects} onAddProject={() => {}} />
      <Toaster />
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b flex items-center justify-between px-6 bg-card/20 shrink-0">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-bold">Interactive Playground</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-muted-foreground" />
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger className="w-64 h-9">
                  <SelectValue placeholder="Select a project configuration" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button size="sm" onClick={() => { setInput(''); setOutput(''); }} variant="outline">Reset</Button>
          </div>
        </header>

        <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 grid gap-6 md:grid-cols-2 min-h-0">
            {/* Input Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">User Input</span>
              </div>
              <div className="flex-1 relative">
                <Textarea 
                  placeholder="Ask the AI something based on your selected project configuration..."
                  className="h-full resize-none p-6 text-base font-body bg-secondary/10 focus:bg-secondary/20 transition-all border-dashed"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button 
                  className="absolute bottom-4 right-4 gap-2" 
                  disabled={isLoading || !input || !selectedProjectId}
                  onClick={handleRun}
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Generate
                </Button>
              </div>
            </div>

            {/* Output Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Generated Intelligence</span>
                {selectedProjectId && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                    <Cpu className="w-3 h-3 text-primary" />
                    <span className="text-[10px] text-primary uppercase font-bold tracking-tight">
                      {projects.find(p => p.id === selectedProjectId)?.model}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 bg-card/30 border border-primary/20 rounded-xl p-8 overflow-y-auto font-code text-sm leading-relaxed text-foreground/90 selection:bg-primary/20">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
                    <RefreshCw className="w-8 h-8 animate-spin opacity-30" />
                    <p className="animate-pulse text-xs tracking-widest uppercase">Synthesizing output...</p>
                  </div>
                ) : output ? (
                  <div className="whitespace-pre-wrap">{output}</div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground text-center opacity-40">
                    <Layers className="w-12 h-12 mb-2" />
                    <p>Ready for prompt execution</p>
                    <p className="text-[10px] max-w-[200px]">Select a project configuration and enter a query to see the AI output.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
