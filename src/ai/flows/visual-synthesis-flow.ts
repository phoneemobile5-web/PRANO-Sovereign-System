'use server';
/**
 * @fileOverview تدفق التخليق البصري السيادي لنظام Gemma Core 2030.
 * يستخدم Imagen 4 لإنتاج مخرجات إدراكية بصرية (إنفوجرافيك، شرائح، تصميمات) لخدمة 500 مليون عربي.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VisualSynthesisInputSchema = z.object({
  prompt: z.string().describe('الوصف المعماري للصورة أو الإنفوجرافيك المراد توليده برنين سحري حلال لخدمة 500 مليون عربي.'),
});
export type VisualSynthesisInput = z.infer<typeof VisualSynthesisInputSchema>;

const VisualSynthesisOutputSchema = z.object({
  imageUrl: z.string().describe('رابط البيانات (Data URI) للإخراج الإدراكي البصري بدقة عالية.'),
  revisedPrompt: z.string().describe('الموجه المعدل الذي استخدمه النظام لضمان الجودة العالمية والخطوط العربية الوقورة.'),
});
export type VisualSynthesisOutput = z.infer<typeof VisualSynthesisOutputSchema>;

export async function generateVisualContent(
  input: VisualSynthesisInput
): Promise<VisualSynthesisOutput> {
  const { media, text } = await ai.generate({
    model: 'googleai/imagen-4.0-fast-generate-001',
    prompt: `بصفتك العقل الإبداعي البصري لنظام Gemma Core 2030، قم بتوليد إخراج بصري (إنفوجرافيك، شريحة عرض، أو تصميم معماري) يخدم 500 مليون عربي ويعكس "الاندماج الروحي الرقمي". 
    الموضوع: ${input.prompt}
    الأسلوب: عمارة زجاجية فيروزية، دعم للخط الكوفي والديواني، رنين سحري حلال، جودة 8K، إضاءة سينمائية تعكس وقار تسلا والمهندس عبد الظاهر.`,
  });

  if (!media) {
    throw new Error('يا ملاح الأرض، فشل استحضار الإخراج البصري لخدمة الـ 500 مليون عربي.');
  }

  return {
    imageUrl: media.url,
    revisedPrompt: text || input.prompt,
  };
}
