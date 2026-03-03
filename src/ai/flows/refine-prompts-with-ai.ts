'use server';
/**
 * @fileOverview An AI tool to suggest and refine user prompts based on best practices.
 *
 * - refinePromptsWithAI - A function that handles the prompt refinement process.
 * - RefinePromptInput - The input type for the refinePromptsWithAI function.
 * - RefinePromptOutput - The return type for the refinePromptsWithAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefinePromptInputSchema = z.object({
  prompt: z.string().describe('The user prompt to be refined based on AI best practices.'),
});
export type RefinePromptInput = z.infer<typeof RefinePromptInputSchema>;

const RefinePromptOutputSchema = z.object({
  refinedPrompt: z
    .string()
    .describe('The AI-refined prompt, optimized for quality based on best practices.'),
});
export type RefinePromptOutput = z.infer<typeof RefinePromptOutputSchema>;

export async function refinePromptsWithAI(
  input: RefinePromptInput
): Promise<RefinePromptOutput> {
  return refinePromptFlow(input);
}

const refinePromptPrompt = ai.definePrompt({
  name: 'refinePromptPrompt',
  input: {schema: RefinePromptInputSchema},
  output: {schema: RefinePromptOutputSchema},
  prompt: `You are an expert prompt engineer. Your task is to take a user's prompt and refine it according to best practices for generative AI models to optimize output quality.
Focus on making the prompt:
- Clear and concise.
- Specific and unambiguous.
- Well-structured, potentially using techniques like role-playing, few-shot examples, or chain-of-thought if beneficial.
- Inclusive of necessary context, constraints, and desired output format if applicable.
- Avoid vagueness or open-ended statements that could lead to generic responses.

Analyze the following prompt and provide only the refined version. Do not include any explanations, greetings, or additional commentary.

User Prompt:
{{{prompt}}}`,
});

const refinePromptFlow = ai.defineFlow(
  {
    name: 'refinePromptFlow',
    inputSchema: RefinePromptInputSchema,
    outputSchema: RefinePromptOutputSchema,
  },
  async input => {
    const {output} = await refinePromptPrompt(input);
    return output!;
  }
);
