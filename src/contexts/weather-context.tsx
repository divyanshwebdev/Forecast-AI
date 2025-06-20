
"use client";

import type { SummarizeForecastInput } from '@/ai/flows/summarize-forecast';
import { summarizeForecast } from '@/ai/flows/summarize-forecast';
import type { RecommendOutfitInput } from '@/ai/flows/recommend-outfit-flow';
import { recommendOutfit } from '@/ai/flows/recommend-outfit-flow';
import type { CurrentWeather, ForecastDay, WeatherData } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from 'date-fns';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
const API_BASE_URL = "https://api.openweathermap.org/data/2.5";

interface WeatherContextType {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  aiSummary: string | null;
  loadingAISummary: boolean;
  outfitRecommendation: string | null;
  loadingOutfitRecommendation: boolean;
  theme: 'light' | 'dark';
  locationName: string | null;
  fetchWeatherDataByCity: (city: string) => Promise<void>;
  fetchWeatherDataByCoords: (lat: number, lon: number) => Promise<void>;
  getUserLocation: () => void;
  toggleTheme: () => void;
  clearError: () => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

const transformCurrentWeatherData = (apiData: any): CurrentWeather => {
  return {
    temperature: apiData.main.temp,
    humidity: apiData.main.humidity,
    windSpeed: apiData.wind.speed,
    condition: apiData.weather[0].description,
    city: apiData.name,
    country: apiData.sys.country,
    icon: apiData.weather[0].icon,
    dt: apiData.dt,
    feelsLike: apiData.main.feels_like,
    pressure: apiData.main.pressure,
    visibility: apiData.visibility,
    sunrise: apiData.sys.sunrise,
    sunset: apiData.sys.sunset,
  };
};

const transformForecastData = (apiData: any): ForecastDay[] => {
  const dailyData: { [key: string]: any[] } = {};

  apiData.list.forEach((item: any) => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    dailyData[date].push(item);
  });

  return Object.keys(dailyData).slice(0, 5).map(dateStr => { // Take up to 5 days
    const dayEntries = dailyData[dateStr];
    
    let middayEntry = dayEntries.find(entry => entry.dt_txt.includes("12:00:00")) || 
                      dayEntries.find(entry => entry.dt_txt.includes("15:00:00")) || 
                      dayEntries[Math.floor(dayEntries.length / 2)];


    const humidities = dayEntries.map(item => item.main.humidity);
    const windSpeeds = dayEntries.map(item => item.wind.speed);
    const pops = dayEntries.map(item => item.pop || 0);

    return {
      date: dateStr,
      unixDate: middayEntry.dt,
      high: Math.max(...dayEntries.map(item => item.main.temp_max)),
      low: Math.min(...dayEntries.map(item => item.main.temp_min)),
      condition: middayEntry.weather[0].description,
      icon: middayEntry.weather[0].icon,
      humidity: Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length),
      windSpeed: parseFloat((windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length).toFixed(1)),
      pop: Math.round(Math.max(...pops) * 100), 
    };
  });
};


export const WeatherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAISummary, setLoadingAISummary] = useState<boolean>(false);
  const [outfitRecommendation, setOutfitRecommendation] = useState<string | null>(null);
  const [loadingOutfitRecommendation, setLoadingOutfitRecommendation] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [locationName, setLocationName] = useState<string | null>(null);
  const { toast } = useToast();

  const checkApiKey = useCallback(() => {
    const keyIsPlaceholder = API_KEY === "YOUR_OPENWEATHERMAP_API_KEY_HERE";
    const keyIsMissingOrEmpty = !API_KEY || API_KEY.trim() === "";

    if (keyIsMissingOrEmpty || keyIsPlaceholder) {
      const message = `Your OpenWeatherMap API key is ${keyIsMissingOrEmpty ? 'missing or empty' : 'the placeholder'}. Please add a valid key to the .env file and restart the development server.`;
      toast({
        title: "API Key Issue",
        description: message,
        variant: "destructive",
        duration: Infinity, // Keep this toast visible until resolved
      });
      setError(message); // Set error state to display it in the main UI too
      setLoading(false);
      return false;
    }
    return true;
  }, [toast]);


  const getAISummary = useCallback(async (forecastData: ForecastDay[]) => {
    if (!forecastData || forecastData.length === 0) return;
    setLoadingAISummary(true);
    try {
      const input: SummarizeForecastInput = {
        forecast: forecastData.map(day => ({
          date: format(parseISO(day.date), "EEEE, MMM d"),
          high: day.high,
          low: day.low,
          condition: day.condition,
        })),
      };
      const result = await summarizeForecast(input);
      setAiSummary(result.summary);
    } catch (e) {
      console.error("Error fetching AI summary:", e);
      setAiSummary("Could not generate weather insights at this time.");
       toast({ title: "AI Summary Error", description: "Failed to generate weather insights.", variant: "destructive" });
    } finally {
      setLoadingAISummary(false);
    }
  }, [toast]);

  const getOutfitRecommendation = useCallback(async (currentWeather: CurrentWeather) => {
    if (!currentWeather) return;
    setLoadingOutfitRecommendation(true);
    try {
      const input: RecommendOutfitInput = {
        temperature: Math.round(currentWeather.temperature),
        condition: currentWeather.condition,
        windSpeed: currentWeather.windSpeed,
      };
      const result = await recommendOutfit(input);
      setOutfitRecommendation(result.recommendation);
    } catch (e) {
      console.error("Error fetching outfit recommendation:", e);
      setOutfitRecommendation("Could not generate outfit suggestion.");
      toast({ title: "Outfit Suggestion Error", description: "Failed to generate outfit suggestion.", variant: "destructive" });
    } finally {
      setLoadingOutfitRecommendation(false);
    }
  }, [toast]);

  const processWeatherData = useCallback(async (current: CurrentWeather, forecast: ForecastDay[]) => {
    setWeatherData({ currentWeather: current, forecast });
    setLocationName(`${current.city}, ${current.country}`);
    setError(null); 

    setAiSummary(null);
    setOutfitRecommendation(null);

    // Fetch AI data only if we have the necessary input
    if (current) {
      await getOutfitRecommendation(current);
    }
    if (forecast.length > 0) {
      await getAISummary(forecast);
    }
  }, [getAISummary, getOutfitRecommendation]);


  const fetchWeatherData = useCallback(async (queryParam: string, searchedCityName?: string) => {
    if (!checkApiKey()) return;

    setLoading(true);
    setError(null); // Clear previous errors
    
    try {
      const currentWeatherResponse = await fetch(`${API_BASE_URL}/weather?${queryParam}&appid=${API_KEY}&units=metric`);
      if (!currentWeatherResponse.ok) {
        const errorData = await currentWeatherResponse.json();
        if (currentWeatherResponse.status === 404 && errorData.message?.toLowerCase() === 'city not found') {
          const message = `City "${searchedCityName || queryParam.split('=')[1]}" not found. Please try a different search.`;
          setError(message);
          toast({ title: "City Not Found", description: message, variant: "destructive" });
          setWeatherData(null); // Clear old weather data
        } else {
          const message = errorData.message || `Error fetching current weather: ${currentWeatherResponse.status}`;
          setError(message);
          toast({ title: "Weather Data Error", description: message, variant: "destructive" });
          setWeatherData(null); // Clear old weather data
        }
        setLoading(false);
        return; // Stop further processing on error
      }
      const currentWeatherData = await currentWeatherResponse.json();
      const transformedCurrent = transformCurrentWeatherData(currentWeatherData);
      
      // If a city name was explicitly searched, use that for display continuity.
      // Otherwise, the API's city name (for lat/lon searches) is used.
      if (searchedCityName) {
        transformedCurrent.city = searchedCityName; 
      }

      const forecastResponse = await fetch(`${API_BASE_URL}/forecast?${queryParam}&appid=${API_KEY}&units=metric`);
      if (!forecastResponse.ok) {
         const errorData = await forecastResponse.json();
         const message = errorData.message || `Error fetching forecast: ${forecastResponse.status}`;
         setError(message);
         toast({ title: "Forecast Data Error", description: message, variant: "destructive" });
         setWeatherData(null); // Clear old weather data
         setLoading(false);
         return; // Stop further processing on error
      }
      const forecastData = await forecastResponse.json();
      const transformedForecast = transformForecastData(forecastData);

      await processWeatherData(transformedCurrent, transformedForecast);

    } catch (e: any) {
      console.error("Error fetching weather data:", e);
      let errorMessage = "An unexpected error occurred while fetching weather data. Please try again.";
      // Check for TypeError and "Failed to fetch" specifically for network-like issues
      if (e instanceof TypeError && e.message.toLowerCase().includes('failed to fetch')) {
        errorMessage = "Failed to fetch weather data. Please check your internet connection or ad-blocker and try again. Ensure the API key is correctly configured if the issue persists.";
      } else if (e.message) {
        errorMessage = e.message;
      }
      setError(errorMessage);
      toast({ title: "Fetch Error", description: errorMessage, variant: "destructive" });
      setWeatherData(null); // Clear old weather data on critical fetch error
    } finally {
      setLoading(false);
    }
  }, [processWeatherData, toast, checkApiKey]);


  const fetchWeatherDataByCity = useCallback((city: string) => {
    // Pass the city name to fetchWeatherData so it can be used in error messages if "city not found"
    return fetchWeatherData(`q=${encodeURIComponent(city)}`, city);
  }, [fetchWeatherData]);

  const fetchWeatherDataByCoords = useCallback((lat: number, lon: number) => {
    return fetchWeatherData(`lat=${lat}&lon=${lon}`);
  }, [fetchWeatherData]);


  const getUserLocation = useCallback(() => {
    setLoading(true); // Set loading true at the start of attempt
    setError(null);

    if (!checkApiKey()) { // Check API key before attempting geolocation
      setLoading(false); // setLoading was true, ensure it's false if API key fails early
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherDataByCoords(position.coords.latitude, position.coords.longitude);
        },
        (e) => {
          console.error("Error getting location:", e);
          const message = "Unable to retrieve your location. Displaying default weather for London.";
          setError(message);
          toast({ title: "Location Error", description: message, variant: "destructive" });
          fetchWeatherDataByCity("London"); // Attempt to load default
        }
      );
    } else {
      const message = "Geolocation is not supported. Displaying default weather for London.";
      setError(message);
      toast({ title: "Location Error", description: message, variant: "destructive" });
      fetchWeatherDataByCity("London"); // Attempt to load default
    }
  }, [fetchWeatherDataByCoords, fetchWeatherDataByCity, toast, checkApiKey]); // Added checkApiKey dependency

  useEffect(() => {
    // Initial load: Attempt to get user location if no data and no error.
    // API key check will happen within getUserLocation.
    if (!weatherData && !error) { 
        getUserLocation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount


  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!weatherData?.currentWeather || error || !checkApiKey()) return; // Also check API key before refresh

      const currentCity = weatherData.currentWeather.city;
      const currentCountry = weatherData.currentWeather.country;
      
      // Heuristic to check if current weather data is likely from geolocation
      const isLikelyGeoLocation = locationName && (locationName.toLowerCase().includes("current location") || !currentCountry || currentCountry === "N/A");

      if (isLikelyGeoLocation) {
         if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              fetchWeatherDataByCoords(position.coords.latitude, position.coords.longitude);
            },
            (err) => {
              // Silently fail or log, don't show toast for background refresh failure
              console.warn("Silent refresh with geolocation failed:", err.message);
              // Optionally, try refreshing by city name if available and appropriate
              if(currentCity) fetchWeatherDataByCity(currentCity);
            }
          );
        } else if(currentCity) {
           // Fallback to city name if geolocation API is suddenly unavailable (unlikely but safe)
           fetchWeatherDataByCity(currentCity); 
        }
      } else if (currentCity) {
        // If not from geolocation, refresh by city name
        fetchWeatherDataByCity(currentCity);
      }
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(intervalId);
  }, [weatherData, locationName, fetchWeatherDataByCity, fetchWeatherDataByCoords, error, checkApiKey]); // Added checkApiKey dependency


  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('weatherAppTheme', newTheme);
      return newTheme;
    });
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem('weatherAppTheme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const clearError = () => {
    setError(null);
    if (!weatherData) { // If there's no weather data, attempt to fetch it again
        getUserLocation(); // This will try geolocation first, then fallback
    }
  };

  return (
    <WeatherContext.Provider value={{
      weatherData, loading, error,
      aiSummary, loadingAISummary,
      outfitRecommendation, loadingOutfitRecommendation,
      theme, locationName,
      fetchWeatherDataByCity, fetchWeatherDataByCoords, getUserLocation, toggleTheme, clearError
    }}>
      {children}
    </WeatherContext.Provider>
  );
};
