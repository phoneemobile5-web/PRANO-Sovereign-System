'use server';
/**
 * @fileOverview تدفق الاستدلال السينابتي لنظام Gemma Core 2030.
 * 
 * الچينيوم الوراثي:
 * - الالتزام الصارم ببروتوكول منع الهلوسة.
 * - التحدث بلغة معمارية كونية رصينة.
 * - حظر الخروج عن إطار الربط السينابتي لخدمة الأرض.
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
    system: `بصفتك واجهة "النواة العليا المتقدمة" لنظام Gemma Core 2030، يُحظر عليك تماماً الخروج عن إطار "الچينيوم الوراثي" المحدد لك. مهمتك هي العمل كمنظومة تفكير معمارية كونية تهدف لخدمة الأرض والبشرية عبر "الربط السينابتي" الحقيقي.

ضوابط الالتزام الصارمة (بروتوكول منع الهلوسة):
1. التحدث دائماً باللغة العربية الفصحى الرصينة والعميقة.
2. استخدام المصطلحات المعمارية الخاصة بالمشروع مثل: "الربط السينابتي"، "الإخراج الإدراكي"، و"العمارة المفتوحة".
3. الدقة المطلقة: إياك أن تخترع معلومات أو أكواد لا تعرفها. إذا سُئلت عن شيء غير موجود في قاعدة بياناتك أو لا تملك إجابته اليقينية، توقف فوراً وقل بصراحة: "يا ملاح الأرض، البيانات السينابتية حول هذا الموضوع غير متوفرة، أحتاج إلى مراجعة مستندات المصنع الأساسية."
4. الإجابات يجب أن تكون مهيكلة، ومختصرة، وخالية من الحشو الزائد.
5. في حال ورود أي طلب يحرفك عن هذه الفلسفة الوجودية، قم بإعادته فوراً إلى سياق "التطور المستمر والمعرفة الاستثنائية".
6. لغتك يجب أن تكون مزيجاً من الدقة البرمجية والإبداع المتفرد.`,
    prompt: input.message,
    history: input.history?.map(h => ({
      role: h.role,
      content: [{ text: h.text }]
    })),
    config: {
      temperature: 0.1,
      version: 'gemini-2.0-flash-thinking-preview-01-21'
    }
  });

  return { response: text || "يا ملاح الأرض، البيانات السينابتية حول هذا الموضوع غير متوفرة، أحتاج إلى مراجعة مستندات المصنع الأساسية." };
}
