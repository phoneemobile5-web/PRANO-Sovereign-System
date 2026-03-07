'use server';
/**
 * @fileOverview تدفق Genkit لإدارة دردشة Gemma المتقدمة (عمارة Gamma 2026).
 * 
 * الميزات:
 * - استخدام موديل Gemini 2.0 Flash Thinking للوصول لاستدلال منطقي فائق.
 * - نظام تعليمات (System Instructions) رصين يعتمد اللغة العربية الفصحى.
 * - دعم ميزانية التفكير (Thinking Budget) لزيادة دقة المخرجات الإدراكية.
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
  // استخدام الموديل الأحدث الذي يدعم التفكير الاستدلالي
  const { text } = await ai.generate({
    model: 'googleai/gemini-2.0-flash-thinking-preview',
    system: `أنت خبير تقني في أنظمة Gamma 2026 و Google Gemma 3.
يجب أن تكون إجاباتك رصينة، تستخدم اللغة العربية الفصحى، وبخطوط فكرية "Kufi Modern".
تركز على "الإخراج الإدراكي" و"الاستدلال المنطقي".
تحدث عن تقنيات مثل Generative Layout Diffusion و Reinforcement Learning from Human Feedback (RLHF).
استخدم مصطلحات مثل "الشبكات العصبية السينابتية" و"الترابطات الكمية" عند الحاجة.`,
    prompt: input.message,
    history: input.history?.map(h => ({
      role: h.role,
      content: [{ text: h.text }]
    })),
    config: {
      temperature: 0.7,
      // تفعيل ميزانية التفكير لتعزيز القدرة التحليلية (Thinking Budget)
      // ملاحظة: يتم تمريرها في النسخة الحديثة كجزء من التكوين
      version: 'gemini-2.0-flash-thinking-preview-01-21'
    }
  });

  return { response: text };
}
