import {
  getWeatherInfo,
  getWindDirection,
  round,
} from "../../utils/weatherCodes";
import type {
  CurrentWeather as CurrentWeatherData,
  Location,
} from "../../types/weather";
import { useUnit } from "../../context/UnitContext";
import styles from "./CurrentWeather.module.scss";

interface CurrentWeatherProps {
  data: CurrentWeatherData;
  location: Location;
  dailyHighLow?: { high: number; low: number };
}

export function CurrentWeather({
  data,
  location,
  dailyHighLow,
}: CurrentWeatherProps) {
  const { isMetric } = useUnit();
  const weather = getWeatherInfo(data.weather_code, data.is_day === 1);

  const tempUnit = isMetric ? "°C" : "°F";
  const windUnit = isMetric ? "km/h" : "mph";

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.card}>
      <div className={styles.location}>
        <span className={styles.locationIcon}>📍</span>
        <div>
          <h1 className={styles.city}>{location.name}</h1>
          <p className={styles.region}>
            {[location.admin1, location.country].filter(Boolean).join(", ")}
          </p>
        </div>
      </div>

      <div className={styles.main}>
        <span
          className={styles.icon}
          role="img"
          aria-label={weather.description}
        >
          {weather.icon}
        </span>
        <div className={styles.tempBlock}>
          <span className={styles.temp}>
            {round(data.temperature)}
            {tempUnit}
          </span>
          {dailyHighLow && (
            <span className={styles.highLow}>
              H:{round(dailyHighLow.high)}
              {tempUnit} · L:{round(dailyHighLow.low)}
              {tempUnit}
            </span>
          )}
        </div>
      </div>

      <p className={styles.description}>{weather.description}</p>
      <p className={styles.datetime}>
        {dateStr} · {timeStr}
      </p>

      <div className={styles.quickStats}>
        <div className={styles.stat}>
          <span className={styles.statIcon}>🌡️</span>
          <div>
            <span className={styles.statLabel}>Feels like</span>
            <span className={styles.statValue}>
              {round(data.apparent_temperature)}
              {tempUnit}
            </span>
          </div>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>💧</span>
          <div>
            <span className={styles.statLabel}>Humidity</span>
            <span className={styles.statValue}>{data.relative_humidity}%</span>
          </div>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon}>💨</span>
          <div>
            <span className={styles.statLabel}>Wind</span>
            <span className={styles.statValue}>
              {round(data.wind_speed)} {windUnit}{" "}
              {getWindDirection(data.wind_direction)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
