
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { useWorkbenchStore, AIProject } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  Play, 
  Wand2, 
  Settings2, 
  Code, 
  Database, 
  ChevronRight, 
  Share2,
  Check,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { refinePromptsWithAI } from '@/ai/flows/refine-prompts-with-ai';
import { testAIProjectResponses } from '@/ai/flows/test-ai-project-responses';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function ProjectEditor() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { projects, addProject, updateProject, isLoaded, addSession } = useWorkbenchStore();
  const [project, setProject] = useState<AIProject | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');

  useEffect(() => {
    if (isLoaded) {
      const found = projects.find(p => p.id === id);
      if (found) {
        setProject({ ...found });
      } else {
        router.push('/');
      }
    }
  }, [id, projects, isLoaded, router]);

  const handleSave = () => {
    if (project) {
      updateProject(project.id, project);
      toast({
        title: "Project Saved",
        description: "All configurations updated successfully.",
      });
    }
  };

  const handleRefinePrompt = async () => {
    if (!project?.prompt) return;
    setIsRefining(true);
    try {
      const result = await refinePromptsWithAI({ prompt: project.prompt });
      setProject({ ...project, prompt: result.refinedPrompt });
      toast({
        title: "Prompt Refined",
        description: "AI has optimized your instructions using best practices.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Refinement Failed",
        description: "Could not refine prompt at this time.",
      });
    } finally {
      setIsRefining(false);
    }
  };

  const handleRunTest = async () => {
    if (!project || !testInput) return;
    setIsRunning(true);
    setTestOutput('');
    try {
      // Combining prompt and input for a simple test response
      const combinedPrompt = `${project.prompt}\n\nUser input: ${testInput}`;
      const result = await testAIProjectResponses({ prompt: combinedPrompt });
      setTestOutput(result.response);
      addSession(project.id, testInput, result.response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Run Failed",
        description: "Encountered an error while generating response.",
      });
    } finally {
      setIsRunning(false);
    }
  };

  if (!isLoaded || !project) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarNav projects={projects} onAddProject={() => {}} />
      <Toaster />
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b flex items-center justify-between px-6 bg-card/30 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-sm flex items-center gap-1">
              Projects <ChevronRight className="w-3 h-3" />
            </span>
            <input 
              value={project.name}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
              className="bg-transparent font-semibold text-lg border-none focus:ring-0 focus:outline-none focus:bg-muted/10 rounded px-2 transition-colors min-w-[200px]"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" /> Share
            </Button>
            <Button size="sm" className="gap-2" onClick={handleSave}>
              <Save className="w-4 h-4" /> Save Configuration
            </Button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Editor Panel */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 border-r">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-bold">System Prompt</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary hover:text-primary/80 gap-2 h-8 px-2"
                  onClick={handleRefinePrompt}
                  disabled={isRefining}
                >
                  {isRefining ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {isRefining ? 'Optimizing...' : 'Refine with AI'}
                </Button>
              </div>
              <div className="relative group">
                <Textarea 
                  value={project.prompt}
                  onChange={(e) => setProject({ ...project, prompt: e.target.value })}
                  placeholder="Enter your AI system instructions here..."
                  className="min-h-[300px] font-code text-sm leading-relaxed bg-secondary/20 focus:bg-secondary/40 border-primary/20 transition-all resize-none p-4"
                />
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Code className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                Source Code Pro — Monospaced Optimized
              </p>
            </div>

            <Tabs defaultValue="playground" className="w-full">
              <TabsList className="bg-secondary/30">
                <TabsTrigger value="playground" className="gap-2"><Play className="w-3.5 h-3.5" /> Playground</TabsTrigger>
                <TabsTrigger value="schema" className="gap-2"><Database className="w-3.5 h-3.5" /> Schemas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="playground" className="pt-4 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Input Test Case</Label>
                    <Textarea 
                      placeholder="Type a query to test your configuration..."
                      className="min-h-[150px] bg-muted/20"
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                    />
                    <Button 
                      className="w-full gap-2 mt-2" 
                      onClick={handleRunTest}
                      disabled={isRunning || !testInput}
                    >
                      {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                      {isRunning ? 'Processing...' : 'Run Simulation'}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Generated Output</Label>
                    <div className="min-h-[150px] bg-muted/10 border rounded-md p-4 text-sm font-code whitespace-pre-wrap overflow-y-auto max-h-[150px]">
                      {testOutput || <span className="text-muted-foreground italic">Simulation results will appear here...</span>}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="schema" className="pt-4 grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Input Schema (JSON)</Label>
                  <Textarea 
                    className="font-code h-[200px]" 
                    placeholder="{ ... }"
                    value={project.inputSchema}
                    onChange={(e) => setProject({ ...project, inputSchema: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Output Schema (JSON)</Label>
                  <Textarea 
                    className="font-code h-[200px]" 
                    placeholder="{ ... }"
                    value={project.outputSchema}
                    onChange={(e) => setProject({ ...project, outputSchema: e.target.value })}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar: Model Settings */}
          <aside className="w-80 bg-card/20 overflow-y-auto p-6 shrink-0 border-l space-y-8">
            <div className="flex items-center gap-2 mb-2">
              <Settings2 className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm uppercase tracking-wider">Model Config</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs">Model Version</Label>
                <Select 
                  value={project.model}
                  onValueChange={(val) => setProject({ ...project, model: val })}
                >
                  <SelectTrigger className="bg-secondary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                    <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                    <SelectItem value="gemini-1.0-pro">Gemini 1.0 Pro</SelectItem>
                    <SelectItem value="text-embedding-004">Text Embedding 004</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-xs">Temperature</Label>
                  <span className="text-xs font-mono text-primary">{project.temperature}</span>
                </div>
                <Slider 
                  value={[project.temperature]} 
                  min={0} max={2} step={0.1} 
                  onValueChange={([val]) => setProject({ ...project, temperature: val })}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-xs">Top P</Label>
                  <span className="text-xs font-mono text-primary">{project.topP}</span>
                </div>
                <Slider 
                  value={[project.topP]} 
                  min={0} max={1} step={0.01} 
                  onValueChange={([val]) => setProject({ ...project, topP: val })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Max Output Tokens</Label>
                <Input 
                  type="number" 
                  value={project.maxTokens} 
                  onChange={(e) => setProject({ ...project, maxTokens: parseInt(e.target.value) })}
                  className="bg-secondary/20 h-8 text-sm"
                />
              </div>

              <div className="pt-4">
                <Label className="text-xs mb-2 block">Project Description</Label>
                <Textarea 
                  className="text-xs bg-secondary/20 min-h-[80px]" 
                  value={project.description}
                  onChange={(e) => setProject({ ...project, description: e.target.value })}
                  placeholder="Describe what this AI configuration is for..."
                />
              </div>
            </div>

            <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="text-xs font-bold flex items-center gap-2 text-primary mb-2">
                <Wand2 className="w-3.5 h-3.5" /> Pro Tip
              </h4>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Higher temperature values lead to more creative but potentially less predictable responses. For coding tasks, try 0.1 - 0.3.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
