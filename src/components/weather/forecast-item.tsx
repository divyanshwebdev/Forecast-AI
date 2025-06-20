import type { ForecastDay } from '@/types';
import WeatherIcon from './weather-icon';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

interface ForecastItemProps {
  day: ForecastDay;
}

const ForecastItem: React.FC<ForecastItemProps> = ({ day }) => {
  const date = new Date(day.unixDate * 1000);
  return (
    <Card className="flex-shrink-0 w-36 sm:w-40 text-center p-3 hover:shadow-md transition-shadow bg-card/70 backdrop-blur-sm border-primary/10">
      <CardContent className="p-0 flex flex-col items-center justify-between h-full">
        <div>
          <p className="font-semibold text-sm">{format(date, 'EEE')}</p>
          <p className="text-xs text-muted-foreground">{format(date, 'MMM d')}</p>
        </div>
        <WeatherIcon iconName={day.icon} size={48} className="my-2 text-accent-foreground" />
        <div>
          <p className="font-bold text-lg">{Math.round(day.high)}° / {Math.round(day.low)}°</p>
          <p className="text-xs capitalize text-muted-foreground truncate w-full" title={day.condition}>{day.condition}</p>
          {day.pop !== undefined && day.pop > 0 && (
             <p className="text-xs text-blue-500 dark:text-blue-400">{day.pop}% rain</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastItem;
