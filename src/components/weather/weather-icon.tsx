import type { LucideProps } from 'lucide-react';
import {
  Sun, Cloud, CloudSun, CloudMoon, Moon, CloudRain, CloudDrizzle, CloudSnow, CloudLightning, Wind, CloudFog, ThermometerSnowflake, ThermometerSun, AlertTriangle, Waves
} from 'lucide-react';

interface WeatherIconProps extends Omit<LucideProps, 'name'> {
  conditionCode?: number; // OpenWeatherMap condition code
  iconName?: string; // OpenWeatherMap icon string e.g. "01d", "01n"
  className?: string;
  size?: number;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ conditionCode, iconName, className, size = 24, ...props }) => {
  let IconComponent: React.ElementType = AlertTriangle; // Default icon for unknown conditions

  if (iconName) {
    // Mapping based on OpenWeatherMap icon codes
    // Day icons
    if (iconName === '01d') IconComponent = Sun; // clear sky day
    else if (iconName === '02d') IconComponent = CloudSun; // few clouds day
    else if (iconName === '03d') IconComponent = Cloud; // scattered clouds day
    else if (iconName === '04d') IconComponent = Cloud; // broken clouds day, overcast clouds day
    else if (iconName === '09d') IconComponent = CloudDrizzle; // shower rain day
    else if (iconName === '10d') IconComponent = CloudRain; // rain day
    else if (iconName === '11d') IconComponent = CloudLightning; // thunderstorm day
    else if (iconName === '13d') IconComponent = CloudSnow; // snow day
    else if (iconName === '50d') IconComponent = CloudFog; // mist day
    // Night icons
    else if (iconName === '01n') IconComponent = Moon; // clear sky night
    else if (iconName === '02n') IconComponent = CloudMoon; // few clouds night
    else if (iconName === '03n') IconComponent = Cloud; // scattered clouds night
    else if (iconName === '04n') IconComponent = Cloud; // broken clouds night, overcast clouds night
    else if (iconName === '09n') IconComponent = CloudDrizzle; // shower rain night
    else if (iconName === '10n') IconComponent = CloudRain; // rain night
    else if (iconName === '11n') IconComponent = CloudLightning; // thunderstorm night
    else if (iconName === '13n') IconComponent = CloudSnow; // snow night
    else if (iconName === '50n') IconComponent = CloudFog; // mist night
  } else if (conditionCode) {
    // Fallback mapping based on OpenWeatherMap condition codes if iconName is not available
    if (conditionCode >= 200 && conditionCode < 300) IconComponent = CloudLightning; // Thunderstorm
    else if (conditionCode >= 300 && conditionCode < 400) IconComponent = CloudDrizzle; // Drizzle
    else if (conditionCode >= 500 && conditionCode < 600) IconComponent = CloudRain; // Rain
    else if (conditionCode >= 600 && conditionCode < 700) IconComponent = CloudSnow; // Snow
    else if (conditionCode >= 700 && conditionCode < 800) IconComponent = CloudFog; // Atmosphere (Mist, Smoke, Haze, etc.)
    else if (conditionCode === 800) IconComponent = Sun; // Clear
    else if (conditionCode === 801) IconComponent = CloudSun; // Few clouds
    else if (conditionCode > 801 && conditionCode < 805) IconComponent = Cloud; // Clouds
    else if (conditionCode === 900 || conditionCode === 901 || conditionCode === 902 || conditionCode === 960 || conditionCode === 961 || conditionCode === 962 ) IconComponent = AlertTriangle; // Extreme weather
    else if (conditionCode === 903) IconComponent = ThermometerSnowflake; // Cold
    else if (conditionCode === 904) IconComponent = ThermometerSun; // Hot
    else if (conditionCode === 905) IconComponent = Wind; // Windy
    else if (conditionCode === 906) IconComponent = Waves; // Hail
  }
  

  return <IconComponent className={className} size={size} {...props} />;
};

export default WeatherIcon;
