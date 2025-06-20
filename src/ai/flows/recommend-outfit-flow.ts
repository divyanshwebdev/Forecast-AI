'use server';
/**
 * @fileOverview Provides outfit recommendations based on weather conditions.
 *
 * - recommendOutfit - A function that suggests clothing based on temperature, weather condition, and wind speed.
 * - RecommendOutfitInput - The input type for the recommendOutfit function.
 * - RecommendOutfitOutput - The return type for the recommendOutfit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendOutfitInputSchema = z.object({
  temperature: z.number().describe('The current temperature in Celsius.'),
  condition: z.string().describe('The current weather condition (e.g., Sunny, Windy, Rainy).'),
  windSpeed: z.number().describe('The current wind speed in m/s.'),
});
export type RecommendOutfitInput = z.infer<typeof RecommendOutfitInputSchema>;

const RecommendOutfitOutputSchema = z.object({
  recommendation: z.string().describe('A concise outfit recommendation based on the weather. Example: "Today is windy and 14°C – a hoodie and jeans would be perfect."'),
});
export type RecommendOutfitOutput = z.infer<typeof RecommendOutfitOutputSchema>;

export async function recommendOutfit(input: RecommendOutfitInput): Promise<RecommendOutfitOutput> {
  return recommendOutfitFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendOutfitPrompt',
  input: {schema: RecommendOutfitInputSchema},
  output: {schema: RecommendOutfitOutputSchema},
  prompt: `You are a friendly and practical fashion advisor. Based on the following weather conditions, provide a concise outfit recommendation.
Make it a single, friendly sentence. For example: "It's {{condition}} and {{temperature}}°C – a light jacket and comfortable pants would be great." Ensure the example format "Today is [condition] and [temperature]°C – [outfit suggestion]." is followed if possible.

Weather:
Temperature: {{temperature}}°C
Condition: {{condition}}
Wind Speed: {{windSpeed}} m/s

Suggest an appropriate outfit.`,
});

const recommendOutfitFlow = ai.defineFlow(
  {
    name: 'recommendOutfitFlow',
    inputSchema: RecommendOutfitInputSchema,
    outputSchema: RecommendOutfitOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
