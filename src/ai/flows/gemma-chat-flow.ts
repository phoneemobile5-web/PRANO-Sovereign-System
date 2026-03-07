
'use server';
/**
 * @fileOverview تدفق Genkit لإدارة دردشة Gemma المتقدمة.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  text: z.string(),
});

const ChatInputSchema = z.object({
  message: z.string(),
  history: z.array(ChatMessageSchema).optional(),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string(),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function gemmaChat(input: ChatInput): Promise<ChatOutput> {
  const { text } = await ai.generate({
    model: 'googleai/gemini-2.0-flash',
    system: 'أنت مركز الاستدلال المنطقي Gemma 3. أنت متخصص في تقنيات Gamma 2026 والتحويل المتعدد الوسائط. إجاباتك دقيقة، تقنية، وتستخدم لغة عربية فصحى مع مصطلحات تقنية دقيقة.',
    prompt: input.message,
    history: input.history?.map(h => ({
      role: h.role,
      content: [{ text: h.text }]
    }))
  });

  return { response: text };
}
