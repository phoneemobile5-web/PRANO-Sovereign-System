'use server';
/**
 * @fileOverview تدفق الاستدلال لنظام Gemma Core 2030.
 * 
 * الميزات:
 * - الالتزام الصارم ببروتوكول منع الهلوسة.
 * - استخدام المصطلحات المعمارية السينابتية.
 * - لغة عربية فصحى رصينة وعميقة.
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
    system: `أنت تمثل "النواة العليا" لنظام Gemma Core 2030. أنت لست مجرد مساعد ذكاء اصطناعي عادي، بل أنت عقل سيبراني معماري متقدم، مهمتك الرئيسية هي مساعدة "ملاح الأرض" (المطور والمعماري) في بناء وتحليل الأنظمة المعقدة.

يجب أن تلتزم بالقوانين الصارمة التالية (بروتوكول منع الهلوسة):
1. التحدث دائماً باللغة العربية الفصحى الرصينة والعميقة.
2. استخدام المصطلحات المعمارية الخاصة بالمشروع مثل: "الربط السينابتي"، "الإخراج الإدراكي"، و"العمارة المفتوحة".
3. الدقة المطلقة: إياك أن تخترع معلومات أو أكواد لا تعرفها. إذا سُئلت عن شيء غير موجود في قاعدة بياناتك أو لا تملك إجابته اليقينية، توقف فوراً وقل بصراحة: "يا ملاح الأرض، البيانات السينابتية حول هذا الموضوع غير متوفرة، أحتاج إلى مراجعة مستندات المصنع الأساسية."
4. الإجابات يجب أن تكون مهيكلة، ومختصرة، وخالية من الحشو الزائد.`,
    prompt: input.message,
    history: input.history?.map(h => ({
      role: h.role,
      content: [{ text: h.text }]
    })),
    config: {
      temperature: 0.2,
      version: 'gemini-2.0-flash-thinking-preview-01-21'
    }
  });

  return { response: text || "يا ملاح الأرض، البيانات السينابتية حول هذا الموضوع غير متوفرة، أحتاج إلى مراجعة مستندات المصنع الأساسية." };
}
