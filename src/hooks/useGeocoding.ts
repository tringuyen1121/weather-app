import { useState, useEffect, useRef } from "react";
import { searchLocations } from "../services/weatherApi";
import type { Location } from "../types/weather";

interface UseGeocodingResult {
  results: Location[];
  loading: boolean;
}

export function useGeocoding(query: string): UseGeocodingResult {
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    timerRef.current = setTimeout(async () => {
      let cancelled = false;
      try {
        const data = await searchLocations(query);
        if (!cancelled) setResults(data.results ?? []);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
      return () => {
        cancelled = true;
      };
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  return { results, loading };
}
