'use server';

/**
 * @fileOverview Personalized gift recommendations flow.
 *
 * This flow takes user purchase history and browsing data as input
 * and returns personalized gift recommendations.
 *
 * @interface PersonalizedGiftRecommendationsInput - Input for the personalized gift recommendations flow.
 * @interface PersonalizedGiftRecommendationsOutput - Output of the personalized gift recommendations flow.
 * @function getPersonalizedGiftRecommendations -  A function that handles the gift recommendations process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedGiftRecommendationsInputSchema = z.object({
  purchaseHistory: z.string().describe('User purchase history.'),
  browsingData: z.string().describe('User browsing data.'),
});
export type PersonalizedGiftRecommendationsInput = z.infer<
  typeof PersonalizedGiftRecommendationsInputSchema
>;

const PersonalizedGiftRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('Personalized gift recommendations.'),
});
export type PersonalizedGiftRecommendationsOutput = z.infer<
  typeof PersonalizedGiftRecommendationsOutputSchema
>;

export async function getPersonalizedGiftRecommendations(
  input: PersonalizedGiftRecommendationsInput
): Promise<PersonalizedGiftRecommendationsOutput> {
  return personalizedGiftRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedGiftRecommendationsPrompt',
  input: {schema: PersonalizedGiftRecommendationsInputSchema},
  output: {schema: PersonalizedGiftRecommendationsOutputSchema},
  prompt: `You are a gift recommendation expert. Based on the user's purchase history and browsing data, provide personalized gift recommendations.

Purchase History: {{{purchaseHistory}}}
Browsing Data: {{{browsingData}}}

Recommendations:`, //The prompt should clearly instruct the LLM to use the available tools when appropriate. It doesn't need to force the use of tools, but it should guide the LLM.
});

const personalizedGiftRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedGiftRecommendationsFlow',
    inputSchema: PersonalizedGiftRecommendationsInputSchema,
    outputSchema: PersonalizedGiftRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
