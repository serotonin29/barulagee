'use server';

/**
 * @fileOverview AI chatbot for answering questions about learning materials.
 *
 * - aiChatbot - A function that handles the chatbot interactions.
 * - AIChatbotInput - The input type for the aiChatbot function.
 * - AIChatbotOutput - The return type for the aiChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { searchMaterials } from './smart-search';

const AIChatbotInputSchema = z.object({
  query: z.string().describe('The user query or question.'),
  contextualSearch: z.boolean().describe('Whether to use local materials as context for the answer.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The conversation history.'),
});
export type AIChatbotInput = z.infer<typeof AIChatbotInputSchema>;

const AIChatbotOutputSchema = z.object({
  response: z.string().describe('The response from the AI chatbot.'),
});
export type AIChatbotOutput = z.infer<typeof AIChatbotOutputSchema>;

export async function aiChatbot(input: AIChatbotInput): Promise<AIChatbotOutput> {
  return aiChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatbotPrompt',
  input: {
    schema: z.object({
      query: z.string(),
      context: z.string().optional(),
    }),
  },
  output: {schema: AIChatbotOutputSchema},
  prompt: `You are a helpful AI chatbot designed to answer questions about learning materials for medical students. Provide clear and concise answers. Use reasoning to explain complex concepts in a simple manner. Be helpful and interactive.

  {{#if context}}
  Base your answer on the following learning materials that were found:
  ---
  {{{context}}}
  ---
  {{/if}}

  User Query: {{{query}}}
  `,
});

const aiChatbotFlow = ai.defineFlow(
  {
    name: 'aiChatbotFlow',
    inputSchema: AIChatbotInputSchema,
    outputSchema: AIChatbotOutputSchema,
  },
  async input => {
    let context: string | undefined;

    if (input.contextualSearch) {
        const searchResults = await searchMaterials({ query: input.query });
        if (searchResults && searchResults.length > 0) {
            context = searchResults.join('\n\n');
        }
    }
    
    const {output} = await prompt({ query: input.query, context });
    return output!;
  }
);
