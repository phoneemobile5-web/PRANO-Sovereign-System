'use server';
/**
 * @fileOverview A Genkit flow for testing AI project responses.
 *
 * - testAIProjectResponses - A function that sends a prompt to the AI model and returns its response.
 * - TestAIProjectResponsesInput - The input type for the testAIProjectResponses function.
 * - TestAIProjectResponsesOutput - The return type for the testAIProjectResponses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TestAIProjectResponsesInputSchema = z.object({
  prompt: z.string().describe('The user prompt to send to the AI project.'),
});
export type TestAIProjectResponsesInput = z.infer<typeof TestAIProjectResponsesInputSchema>;

const TestAIProjectResponsesOutputSchema = z.object({
  response: z.string().describe('The AI generated response.'),
});
export type TestAIProjectResponsesOutput = z.infer<typeof TestAIProjectResponsesOutputSchema>;

export async function testAIProjectResponses(
  input: TestAIProjectResponsesInput
): Promise<TestAIProjectResponsesOutput> {
  return testAIProjectResponsesFlow(input);
}

const testAIProjectResponsesPrompt = ai.definePrompt({
  name: 'testAIProjectResponsesPrompt',
  input: {schema: TestAIProjectResponsesInputSchema},
  output: {schema: TestAIProjectResponsesOutputSchema},
  prompt: '{{{prompt}}}',
});

const testAIProjectResponsesFlow = ai.defineFlow(
  {
    name: 'testAIProjectResponsesFlow',
    inputSchema: TestAIProjectResponsesInputSchema,
    outputSchema: TestAIProjectResponsesOutputSchema,
  },
  async input => {
    const {output} = await testAIProjectResponsesPrompt(input);
    if (!output) {
      throw new Error('No output received from AI model.');
    }
    return output;
  }
);
