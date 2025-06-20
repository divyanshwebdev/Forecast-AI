
"use client";

import React from 'react'; // Added React import
import { useWeather } from '@/contexts/weather-context';
import WeatherIcon from './weather-icon';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Thermometer, Droplets, Wind, Eye, Sunrise, Sunset, Gauge } from 'lucide-react';
import { format } from 'date-fns';

const CurrentWeatherCard: React.FC = () => {
  const { weatherData, loading, locationName } = useWeather();

  if (loading && !weatherData?.currentWeather) {
    return (
      <Card className="shadow-lg w-full">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-16 w-24" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        </CardContent>
      </Card>
    );
  }

  const current = weatherData?.currentWeather;
  if (!current) return null;

  const formatTime = (timestamp: number) => format(new Date(timestamp * 1000), 'p');

  return (
    <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/20 w-full">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-primary">{locationName || `${current.city}, ${current.country}`}</CardTitle>
        <CardDescription className="text-lg">
          {format(new Date(current.dt * 1000), "EEEE, MMMM d, yyyy 'at' p")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <WeatherIcon iconName={current.icon} size={80} className="text-accent-foreground mr-4" />
            <div>
              <p className="text-6xl font-bold">{Math.round(current.temperature)}°C</p>
              <p className="text-xl capitalize text-muted-foreground">{current.condition}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg">Feels like {Math.round(current.feelsLike)}°C</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6 pt-4 border-t border-border">
          <InfoItem icon={<Droplets />} label="Humidity" value={`${current.humidity}%`} />
          <InfoItem icon={<Wind />} label="Wind" value={`${current.windSpeed.toFixed(1)} m/s`} />
          <InfoItem icon={<Gauge />} label="Pressure" value={`${current.pressure} hPa`} />
          <InfoItem icon={<Eye />} label="Visibility" value={`${(current.visibility / 1000).toFixed(1)} km`} />
          <InfoItem icon={<Sunrise />} label="Sunrise" value={formatTime(current.sunrise)} />
          <InfoItem icon={<Sunset />} label="Sunset" value={formatTime(current.sunset)} />
        </div>
      </CardContent>
    </Card>
  );
};

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <span className="text-primary p-2 bg-primary/10 rounded-full">{React.cloneElement(icon as React.ReactElement, { size: 20 })}</span>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

export default CurrentWeatherCard;
