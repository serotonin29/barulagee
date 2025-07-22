'use server';

/**
 * @fileOverview Implements the smart search functionality for the NeuroZsis app.
 *
 * - smartSearch - A function that allows students to search for learning materials using keywords or questions.
 * - SmartSearchInput - The input type for the smartSearch function.
 * - SmartSearchOutput - The return type for the smartSearch function.
 * - searchMaterials - A Genkit tool to search for materials (exported for use in other flows).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartSearchInputSchema = z.object({
  query: z.string().describe('The search query from the user, which could be a question or keywords.'),
});
export type SmartSearchInput = z.infer<typeof SmartSearchInputSchema>;

const SmartSearchOutputSchema = z.object({
  results: z.array(z.string()).describe('A list of relevant learning materials found based on the search query.'),
});
export type SmartSearchOutput = z.infer<typeof SmartSearchOutputSchema>;

export async function smartSearch(input: SmartSearchInput): Promise<SmartSearchOutput> {
  return smartSearchFlow(input);
}

export const searchMaterials = ai.defineTool({
  name: 'searchMaterials',
  description: 'Searches for learning materials based on keywords or questions. Returns a list of relevant materials.',
  inputSchema: z.object({
    query: z.string().describe('The search query to use when searching for materials.'),
  }),
  outputSchema: z.array(z.string()).describe('A list of relevant material names or descriptions.'),
},
async (input) => {
    // TODO: Replace with actual implementation to fetch learning materials from a database or external source.
    // This is a placeholder implementation.
    console.log(`Searching materials for: ${input.query}`);
    const dummyResults = [
      `Anatomy Textbook - Chapter 1: ${input.query}`, 
      `Physiology Video - ${input.query} Explained`, 
      `Interactive Quiz - ${input.query} Practice Questions`
    ];
    return dummyResults;
  }
);

const smartSearchPrompt = ai.definePrompt({
  name: 'smartSearchPrompt',
  tools: [searchMaterials],
  input: {schema: SmartSearchInputSchema},
  output: {schema: SmartSearchOutputSchema},
  prompt: `You are a helpful AI assistant designed to help students find relevant learning materials. Use the searchMaterials tool to find materials related to the user's query.

  User Query: {{{query}}}
  
  If you find materials using the tool, return the list of materials. If you don't find any, just say you couldn't find anything.
`,
});

const smartSearchFlow = ai.defineFlow(
  {
    name: 'smartSearchFlow',
    inputSchema: SmartSearchInputSchema,
    outputSchema: SmartSearchOutputSchema,
  },
  async input => {
    const {output} = await smartSearchPrompt(input);
    return output || { results: [] };
  }
);
