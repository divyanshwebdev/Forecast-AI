export interface CurrentWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  city: string;
  country: string;
  icon: string;
  dt: number; // Unix timestamp
  feelsLike: number;
  pressure: number;
  visibility: number; // in meters
  sunrise: number; // Unix timestamp
  sunset: number; // Unix timestamp
}

export interface ForecastDay {
  date: string; // Formatted as "YYYY-MM-DD" or human-readable for AI
  unixDate: number; // Unix timestamp for the day
  high: number;
  low: number;
  condition: string;
  icon: string;
  humidity?: number;
  windSpeed?: number;
  pop?: number; // Probability of precipitation
}

export interface WeatherData {
  currentWeather: CurrentWeather | null;
  forecast: ForecastDay[];
}

export interface AISummary {
  summary: string;
}
