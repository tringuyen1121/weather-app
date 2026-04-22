import { useState, useEffect } from "react";
import { fetchWeather } from "../services/weatherApi";
import type { WeatherData, Units } from "../types/weather";

interface UseWeatherResult {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}

export function useWeather(
  latitude: number | null,
  longitude: number | null,
  units: Units,
): UseWeatherResult {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (latitude === null || longitude === null) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchWeather(latitude, longitude, units);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch weather data",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude, units.temperature, units.wind]);

  return { data, loading, error };
}
