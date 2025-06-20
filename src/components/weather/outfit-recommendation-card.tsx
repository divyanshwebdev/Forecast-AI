"use client";

import { useWeather } from '@/contexts/weather-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Shirt } from 'lucide-react';

const OutfitRecommendationCard: React.FC = () => {
  const { outfitRecommendation, loadingOutfitRecommendation, weatherData } = useWeather();

  const hasCurrentWeather = weatherData?.currentWeather;

  if (loadingOutfitRecommendation || (!outfitRecommendation && hasCurrentWeather)) {
    return (
      <Card className="shadow-lg bg-card/80 backdrop-blur-sm border-primary/20 w-full">
        <CardHeader className="flex flex-row items-center gap-2">
          <Shirt className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl font-headline text-primary">Outfit Suggestion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>
    );
  }

  if (!outfitRecommendation) return null;

  return (
    <Card className="shadow-xl bg-secondary/70 dark:bg-secondary/40 border-secondary w-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <Shirt className="h-6 w-6 text-secondary-foreground" />
        <CardTitle className="text-2xl font-headline text-secondary-foreground">Outfit Suggestion</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">{outfitRecommendation}</p>
      </CardContent>
    </Card>
  );
};

export default OutfitRecommendationCard;
