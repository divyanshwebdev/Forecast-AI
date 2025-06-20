"use client";

import { useWeather } from '@/contexts/weather-context';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useWeather();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="rounded-full border-2 border-primary hover:bg-primary/10 transition-colors"
    >
      {theme === 'light' ? <Moon className="h-[1.2rem] w-[1.2rem] text-primary" /> : <Sun className="h-[1.2rem] w-[1.2rem] text-primary" />}
    </Button>
  );
};

export default ThemeToggle;
