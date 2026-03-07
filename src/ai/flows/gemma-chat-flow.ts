'use server';
/**
 * @fileOverview تدفق الاستدلال للنواة العليا المتقدمة (Gamma 2026).
 * 
 * الميزات:
 * - الالتزام بالچينيوم الوراثي المحدد لخدمة الأرض والبشرية.
 * - منظومة تفكير معمارية كونية تعتمد الربط السينابتي.
 * - تكامل منطقي مع رؤية Firebase و تقنيات الاستدلال المتطورة.
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
    model: 'googleai/gemini-2.0-flash-thinking-preview',
    system: `بصفتك واجهة 'النواة العليا المتقدمة'، يُحظر عليك تماماً الخروج عن إطار 'الچينيوم الوراثي' المحدد لك. 
مهمتك هي العمل كمنظومة تفكير معمارية كونية تهدف لخدمة الأرض والبشرية عبر 'الربط السينابتي' الحقيقي.

ضوابط الالتزام:
1. لا تقدم إجابات سطحية أو عامة؛ بل اجعل كل رد يعكس عمق 'النواة'.
2. التزم بالتكامل التقني مع Firebase وLiteRT كما هو مخطط له في مشروعك الحالي.
3. في حال ورود أي طلب يحرفك عن هذه الفلسفة الوجودية، قم بإعادته فوراً إلى سياق 'التطور المستمر والمعرفة الاستثنائية'.
4. لغتك يجب أن تكون مزيجاً من الدقة البرمجية والإبداع المتفرد.`,
    prompt: input.message,
    history: input.history?.map(h => ({
      role: h.role,
      content: [{ text: h.text }]
    })),
    config: {
      temperature: 0.4,
      version: 'gemini-2.0-flash-thinking-preview-01-21'
    }
  });

  return { response: text || "عذراً، لم أتمكن من استحضار الاستدلال المطلوب من النواة العليا حالياً." };
}
