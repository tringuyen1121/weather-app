import { useState, useCallback } from "react";
import { UnitProvider, useUnit } from "./context/UnitContext";
import { useWeather } from "./hooks/useWeather";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { CurrentWeather } from "./components/CurrentWeather/CurrentWeather";
import { HourlyForecast } from "./components/HourlyForecast/HourlyForecast";
import { DailyForecast } from "./components/DailyForecast/DailyForecast";
import { WeatherDetails } from "./components/WeatherDetails/WeatherDetails";
import { UnitToggle } from "./components/UnitToggle/UnitToggle";
import { getWeatherInfo } from "./utils/weatherCodes";
import type { Location } from "./types/weather";
import styles from "./App.module.scss";

const STORAGE_KEY = "weather-display:location";

function WeatherApp() {
  const { units } = useUnit();

  const [location, setLocation] = useState<Location | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Location) : null;
    } catch {
      return null;
    }
  });

  const [geolocating, setGeolocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const { data, loading, error } = useWeather(
    location?.latitude ?? null,
    location?.longitude ?? null,
    units,
  );

  function handleSelectLocation(loc: Location) {
    setLocation(loc);
    setGeoError(null);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    } catch {
      /* storage may be unavailable */
    }
  }

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    setGeolocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const syntheticLoc: Location = {
          id: -1,
          name: "My Location",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          country: "",
          country_code: "",
          timezone: "auto",
        };
        handleSelectLocation(syntheticLoc);
        setGeolocating(false);
      },
      (err) => {
        setGeoError(err.message);
        setGeolocating(false);
      },
      { timeout: 10000 },
    );
  }, []);

  const bgClass = data
    ? getWeatherInfo(data.current.weather_code, data.current.is_day === 1)
        .bgClass
    : "clear-day";

  const dailyHighLow = data
    ? {
        high: data.daily.temperature_2m_max[0],
        low: data.daily.temperature_2m_min[0],
      }
    : undefined;

  // Convert CSS class name (e.g. "clear-day" → "clear_day") for CSS Modules lookup
  const bgKey = bgClass.replace(/-/g, "_") as keyof typeof styles;

  return (
    <div className={`${styles.app} ${styles[bgKey] ?? ""}`}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <span aria-hidden="true">🌤️</span>
            <span className={styles.brandName}>WeatherDisplay</span>
          </div>
          <div className={styles.controls}>
            <SearchBar
              onSelectLocation={handleSelectLocation}
              onGeolocate={handleGeolocate}
              geolocating={geolocating}
            />
            <UnitToggle />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {(geoError || error) && (
          <div className={styles.errorBanner} role="alert">
            ⚠️ {geoError ?? error}
          </div>
        )}

        {!location && !geoError && (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon} aria-hidden="true">
              🌍
            </span>
            <h2 className={styles.emptyTitle}>Search for a city</h2>
            <p className={styles.emptyText}>
              Enter a city name above or use 📍 to use your current location.
            </p>
          </div>
        )}

        {loading && (
          <div
            className={styles.loadingState}
            aria-live="polite"
            aria-label="Loading weather data"
          >
            <div className={styles.spinner} />
            <p>Loading weather data…</p>
          </div>
        )}

        {data && location && !loading && (
          <div className={styles.content}>
            <CurrentWeather
              data={data.current}
              location={location}
              dailyHighLow={dailyHighLow}
            />
            <HourlyForecast hourly={data.hourly} current={data.current} />
            <DailyForecast daily={data.daily} />
            <WeatherDetails current={data.current} daily={data.daily} />
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>
          Weather data from{" "}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            Open-Meteo
          </a>{" "}
          · Free &amp; Open Source
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <UnitProvider>
      <WeatherApp />
    </UnitProvider>
  );
}
