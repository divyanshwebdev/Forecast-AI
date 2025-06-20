"use client";

import React, { useState } from 'react';
import { useWeather } from '@/contexts/weather-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';

const LocationSearchInput: React.FC = () => {
  const [city, setCity] = useState('');
  const { fetchWeatherDataByCity, getUserLocation, loading } = useWeather();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherDataByCity(city.trim());
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex-grow flex items-center gap-2 w-full sm:w-auto">
        <Input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search city..."
          className="flex-grow min-w-0 bg-background/80 focus:bg-background"
          aria-label="Search city for weather"
          disabled={loading}
        />
        <Button type="submit" size="icon" aria-label="Search" disabled={loading}>
          <Search className="h-5 w-5" />
        </Button>
      </form>
      <Button
        variant="outline"
        size="icon"
        onClick={getUserLocation}
        aria-label="Use current location"
        className="shrink-0"
        disabled={loading}
      >
        <MapPin className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default LocationSearchInput;
