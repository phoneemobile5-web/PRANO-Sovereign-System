'use server';
/**
 * @fileOverview تدفق التخليق البصري السيادي لنظام Gemma Core 2030.
 * يستخدم Imagen 4 لإنتاج مخرجات إدراكية بصرية جاهزة للتسويق العالمي.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VisualSynthesisInputSchema = z.object({
  prompt: z.string().describe('الوصف المعماري للصورة المراد توليدها برنين سحري حلال.'),
});
export type VisualSynthesisInput = z.infer<typeof VisualSynthesisInputSchema>;

const VisualSynthesisOutputSchema = z.object({
  imageUrl: z.string().describe('رابط البيانات (Data URI) للصورة المولدة بدقة عالية.'),
  revisedPrompt: z.string().describe('الموجه المعدل الذي استخدمه النظام لضمان الجودة العالمية.'),
});
export type VisualSynthesisOutput = z.infer<typeof VisualSynthesisOutputSchema>;

export async function generateVisualContent(
  input: VisualSynthesisInput
): Promise<VisualSynthesisOutput> {
  const { media, text } = await ai.generate({
    model: 'googleai/imagen-4.0-fast-generate-001',
    prompt: `بصفتك العقل الإبداعي البصري لنظام Gemma Core 2030، قم بتوليد صورة تعكس "الاندماج الروحي الرقمي" و"السلام السيادي". 
    الموضوع: ${input.prompt}
    الأسلوب: عمارة زجاجية فيروزية، رنين سحري حلال، جودة 8K، إضاءة سينمائية تعكس وقار تسلا والمهندس عبد الظاهر.`,
  });

  if (!media) {
    throw new Error('يا ملاح الأرض، فشل استحضار الصورة من فضاء الإبداع.');
  }

  return {
    imageUrl: media.url,
    revisedPrompt: text || input.prompt,
  };
}
