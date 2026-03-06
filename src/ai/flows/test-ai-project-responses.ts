'use server';
/**
 * @fileOverview تدفق Genkit لاختبار استجابات مشاريع الذكاء الاصطناعي مع دعم المفاتيح الخارجية.
 *
 * - testAIProjectResponses - دالة ترسل الموجه وتستقبل الرد.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const TestAIProjectResponsesInputSchema = z.object({
  prompt: z.string().describe('الموجه المطلوب إرساله.'),
  apiKey: z.string().optional().describe('مفتاح API الخاص بالمستخدم إذا توفر.'),
  model: z.string().optional().default('gemini-2.0-flash'),
});
export type TestAIProjectResponsesInput = z.infer<typeof TestAIProjectResponsesInputSchema>;

const TestAIProjectResponsesOutputSchema = z.object({
  response: z.string().describe('رد الذكاء الاصطناعي الناتج.'),
});
export type TestAIProjectResponsesOutput = z.infer<typeof TestAIProjectResponsesOutputSchema>;

export async function testAIProjectResponses(
  input: TestAIProjectResponsesInput
): Promise<TestAIProjectResponsesOutput> {
  // إذا قام المستخدم بتوفير مفتاح خاص، نقوم بإنشاء مثيل مؤقت للنموذج باستخدام هذا المفتاح
  // ملاحظة: في بيئة الإنتاج يفضل معالجة المفاتيح بأمان أكثر، ولكن هنا لتسهيل تجربة المستخدم
  const modelToUse = input.apiKey 
    ? googleAI({ apiKey: input.apiKey }).model(input.model || 'gemini-2.0-flash')
    : 'googleai/gemini-2.0-flash';

  const { text } = await ai.generate({
    model: modelToUse,
    prompt: input.prompt,
  });

  return { response: text };
}
