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
  // استخدام المنموذج الافتراضي - معالجة المفاتيح المخصصة تتم في المستقبل
  const prompt = input.apiKey 
    ? `[API Key provided: ${input.apiKey.substring(0, 4)}...]\n\n${input.prompt}`
    : input.prompt;

  const { text } = await ai.generate(prompt);

  return { response: text };
}
