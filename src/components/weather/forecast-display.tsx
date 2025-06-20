
"use client";

import { useWeather } from '@/contexts/weather-context';
import ForecastItem from './forecast-item';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ForecastDisplay: React.FC = () => {
  const { weatherData, loading } = useWeather();

  if (loading && !weatherData?.forecast?.length) {
    return (
      <Card className="shadow-lg w-full">
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 pb-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-32 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const forecast = weatherData?.forecast;
  if (!forecast || forecast.length === 0) return null;

  return (
    <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/20 w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary">5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4 pb-4">
            {forecast.map((day, index) => (
              <ForecastItem key={index} day={day} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ForecastDisplay;
