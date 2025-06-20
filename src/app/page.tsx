
"use client";

import Header from '@/components/weather/header';
import CurrentWeatherCard from '@/components/weather/current-weather-card';
import ForecastDisplay from '@/components/weather/forecast-display';
import SmartInsightsCard from '@/components/weather/smart-insights-card';
import OutfitRecommendationCard from '@/components/weather/outfit-recommendation-card';
import { useWeather } from '@/contexts/weather-context';
import LoadingSpinner from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Heart } from 'lucide-react';

export default function Home() {
  const { loading, error, clearError, weatherData } = useWeather();

  const initialLoading = loading && !weatherData;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 space-y-6">
        {initialLoading && (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size={48} />
          </div>
        )}
        {error && !initialLoading && (
          <div className="flex flex-col items-center justify-center text-center p-4 bg-destructive/10 border border-destructive rounded-lg shadow-md">
            <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold text-destructive mb-2">Oops! Something went wrong.</h2>
            <p className="text-destructive-foreground mb-4">{error}</p>
            <Button onClick={clearError} variant="destructive">Try Again</Button>
          </div>
        )}
        {!initialLoading && !error && weatherData && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CurrentWeatherCard />
              </div>
              <div className="lg:col-span-1 space-y-6">
                 <SmartInsightsCard />
                 <OutfitRecommendationCard />
              </div>
            </div>
            <ForecastDisplay />
          </>
        )}
      </main>
      <footer className="py-4 px-4 md:px-6 text-center text-sm text-muted-foreground border-t border-border">
        <p>
          &copy; {new Date().getFullYear()} Forecast AI.
          <span className="mx-2 hidden sm:inline-block">|</span>
          <span className="block sm:inline-block mt-1 sm:mt-0">
            Made with <Heart className="inline-block h-4 w-4 text-red-500 mx-1" fill="currentColor" /> by{' '}
            <a
              href="https://github.com/divyanshwebdev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-primary font-medium"
            >
              divyanshwebdev
            </a>
          </span>
        </p>
      </footer>
    </div>
  );
}
