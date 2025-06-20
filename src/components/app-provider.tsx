"use client";

import { WeatherProvider } from "@/contexts/weather-context";
import { Toaster } from "@/components/ui/toaster";
import type { ReactNode } from "react";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <WeatherProvider>
      {children}
      <Toaster />
    </WeatherProvider>
  );
}
