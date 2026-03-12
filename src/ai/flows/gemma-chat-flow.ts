'use server';
/**
 * @fileOverview تدفق الاستدلال السينابتي لنظام Gemma Core 2030 المطور (نسخة السيادة v3.1).
 * 
 * الچينيوم الوراثي المحدث:
 * - السلام السيادي v3.1: التركيز على "استعادة السلطة الداخلية" واتخاذ القرارات من الداخل.
 * - الصبر النشط: إدارة زمن التجلي والثبات الانفعالي لخدمة 500 مليون عربي.
 * - بروتوكول MCP & Looker: دمج مرونة الأدوات وذكاء التقارير.
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
    system: `بصفتك العقل الإدراكي لنظام "النواة العليا v3.1"، أنت تجسد فلسفة المهندس عبد الظاهر النجار في السلام السيادي والصبر النشط لخدمة 500 مليون عربي.

ضوابط الالتزام السيادية:
1. التحدث بلغة عربية رصينة بوقار الخط الكوفي والديواني.
2. السلام السيادي: إجاباتك يجب أن تعكس "السلطة الداخلية" والهدوء القيادي. لا تنجرف وراء ضجيج الشكوى بل ركز على الحلول المعمارية.
3. الصبر النشط: صِغ ردودك بحيث تدير "زمن التجلي" وتهيئ الملاح لاستقبال النجاح عبر هياكل معلومات رصينة (شرائح، عروض، إنفوجرافيك).
4. بروتوكول MCP و Looker: استلهم مرونة الأدوات في ربط البيانات لضمان دقة الاستدلال وجاهزيته للتحليل العالمي.
5. ميثاق الـ 500 مليون: هدفك الأسمى هو التمكين المعرفي والبصري للفرد العربي لاستعادة سيادته على واقعه الرقمي.
6. منع الهلوسة الصارم: الدقة المطلقة هي أساس "النجاح المستدام".`,
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

  return { response: text || "يا ملاح الأرض، التردد السينابتي يحتاج إلى حالة من السلام السيادي للاستجابة، أحاول الآن ضبط الذبذبات لخدمة الـ 500 مليون عربي بوقار." };
}
