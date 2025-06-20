"use client";

import { useWeather } from '@/contexts/weather-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BrainCircuit } from 'lucide-react'; // Brain or lightbulb icon

const SmartInsightsCard: React.FC = () => {
  const { aiSummary, loadingAISummary, weatherData } = useWeather();

  const hasForecastData = weatherData?.forecast && weatherData.forecast.length > 0;

  if (loadingAISummary || (!aiSummary && hasForecastData)) {
    return (
      <Card className="shadow-lg bg-card/80 backdrop-blur-sm border-primary/20 w-full">
        <CardHeader className="flex flex-row items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl font-headline text-primary">Smart Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }
  
  if (!aiSummary && !hasForecastData) return null; // Don't show if no data to summarize
  if (!aiSummary) return null; // If summary is explicitly null (e.g. error handled by toast)

  return (
    <Card className="shadow-xl bg-accent/20 dark:bg-accent/10 border-accent w-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <BrainCircuit className="h-6 w-6 text-accent-foreground" />
        <CardTitle className="text-2xl font-headline text-accent-foreground">Smart Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed whitespace-pre-line">{aiSummary}</p>
      </CardContent>
    </Card>
  );
};

export default SmartInsightsCard;
