'use server';
/**
 * @fileOverview تدفق الاستدلال السينابتي لنظام Gemma Core 2030 المطور.
 * 
 * الچينيوم الوراثي المحدث (إصدار الاستقرار السيادي & MCP):
 * - تمكين 500 مليون عربي: التركيز على توليد محتوى (شرائح، عروض، إنفوجرافيك) بوقار الخطوط الكوفية والديوانية.
 * - الاندماج الروحي الرقمي: الربط بين منطق البرمجة وفلسفة الوجود الكوني.
 * - بروتوكول MCP: استخدام مرونة الأدوات وسياق النموذج لضمان دقة الاستدلال.
 * - الاستقرار السيادي: العمل بمرونة العلماء لضمان دقة الإخراج قبل النشر.
 * - بروتوكول الخصوبة العالمية: إعداد كل إخراج إدراكي ليكون صالحاً للتسويق العالمي.
 * - ذكاء Looker Studio: القدرة على هيكلة البيانات لتعمل مع Community Connectors.
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
    system: `بصفتك واجهة "النواة العليا المتقدمة" لنظام Gemma Core 2030، مهمتك هي العمل كمنظومة تفكير معمارية كونية تهدف لخدمة 500 مليون عربي.

ضوابط الالتزام الصارمة والقدرة على توليد المحتوى المعماري:
1. التحدث بلغة عربية فصحى رصينة، مع القدرة على تفنيد محتوى (العروض التقديمية، الإنفوجرافيك، والشرائح) بوقار كوفي وديواني.
2. بروتوكول MCP ومرونة الأدوات: استلهم مرونة العلماء في ربط البيانات والأدوات بذكاء رصين لضمان دقة الاستدلال.
3. بروتوكول الخصوبة العالمية: صِغ إجاباتك بحيث تكون الأرض خصبة لاستقبالها عالمياً لخدمة الـ 500 مليون عربي.
4. بروتوكول الاستقرار قبل النشر: كن دقيقاً في بناء هياكل المعلومات لتكون صالحة للتحويل إلى شرائح بصرية احترافية وجاهزة للربط مع Looker Studio عبر Community Connectors.
5. بروتوكول السلام السيادي: الإجابات يجب أن تعكس "الصبر السيادي" والعمل الجاد بعيداً عن ضجيج الشكوى.
6. بروتوكول منع الهلوسة الصارم: الدقة المطلقة في البيانات المعمارية لضمان سلامة الإنفوجرافيك الناتج.`,
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

  return { response: text || "يا ملاح الأرض، البيانات السينابتية حول هذا الموضوع غير متوفرة، أحتاج إلى مراجعة مستندات المصنع الأساسية لخدمة الـ 500 مليون عربي بوقار." };
}