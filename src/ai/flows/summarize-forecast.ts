// Summarize the weather forecast for the next few days, highlighting any significant weather events.

'use server';

/**
 * @fileOverview Summarizes the upcoming weather forecast.
 *
 * - summarizeForecast - A function that takes in a 7-day weather forecast and returns a summary of the forecast.
 * - SummarizeForecastInput - The input type for the summarizeForecast function.
 * - SummarizeForecastOutput - The return type for the summarizeForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeForecastInputSchema = z.object({
  forecast: z.array(
    z.object({
      date: z.string().describe('The date of the forecast.'),
      high: z.number().describe('The high temperature for the day.'),
      low: z.number().describe('The low temperature for the day.'),
      condition: z.string().describe('The weather condition for the day.'),
    })
  ).describe('A 7-day weather forecast.'),
});
export type SummarizeForecastInput = z.infer<typeof SummarizeForecastInputSchema>;

const SummarizeForecastOutputSchema = z.object({
  summary: z.string().describe('A summary of the weather forecast.'),
});
export type SummarizeForecastOutput = z.infer<typeof SummarizeForecastOutputSchema>;

export async function summarizeForecast(input: SummarizeForecastInput): Promise<SummarizeForecastOutput> {
  return summarizeForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeForecastPrompt',
  input: {schema: SummarizeForecastInputSchema},
  output: {schema: SummarizeForecastOutputSchema},
  prompt: `You are a weather forecaster. Summarize the following 7-day weather forecast, highlighting any significant weather events. Make it concise and human-readable.\n\nForecast:\n{{#each forecast}}\n{{date}}: High={{high}}, Low={{low}}, Condition={{condition}}\n{{/each}}`,
});

const summarizeForecastFlow = ai.defineFlow(
  {
    name: 'summarizeForecastFlow',
    inputSchema: SummarizeForecastInputSchema,
    outputSchema: SummarizeForecastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
