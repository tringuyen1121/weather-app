import { memo, useMemo, useRef } from "react";
import {
  getWeatherInfo,
  formatHour,
  round,
  type WeatherInfo,
} from "../../utils/weatherCodes";
import type { HourlyWeather, CurrentWeather } from "../../types/weather";
import { useUnit } from "../../context/UnitContext";
import styles from "./HourlyForecast.module.scss";

interface HourlyForecastProps {
  hourly: HourlyWeather;
  current: CurrentWeather;
}

const HourlyCard = memo(
  ({
    time,
    weather,
    hourly,
    idx,
    tempUnit,
    precipProb,
    isNow,
  }: {
    time: string;
    weather: WeatherInfo;
    hourly: HourlyWeather;
    idx: number;
    tempUnit: string;
    precipProb: number;
    isNow: boolean;
  }) => (
    <div key={time} className={`${styles.card} ${isNow ? styles.now : ""}`}>
      <span className={styles.time}>{isNow ? "Now" : formatHour(time)}</span>
      <span className={styles.icon} role="img" aria-label={weather.description}>
        {weather.icon}
      </span>
      <span className={styles.temp}>
        {round(hourly.temperature_2m[idx])}
        {tempUnit}
      </span>
      {precipProb > 0 && (
        <span className={styles.precip}>💧 {precipProb}%</span>
      )}
    </div>
  ),
);

export function HourlyForecast({ hourly, current }: HourlyForecastProps) {
  const { isMetric } = useUnit();
  const scrollRef = useRef<HTMLDivElement>(null);
  const tempUnit = isMetric ? "°C" : "°F";

  // Find the index of the current hour and show the next 24 hours
  const hourlyCards = useMemo(() => {
    const now = new Date(current.time);
    const nowHour =
      now.getFullYear() * 1000000 +
      (now.getMonth() + 1) * 10000 +
      now.getDate() * 100 +
      now.getHours();

    const startIndex = hourly.time.findIndex((t) => {
      const d = new Date(t);
      const h =
        d.getFullYear() * 1000000 +
        (d.getMonth() + 1) * 10000 +
        d.getDate() * 100 +
        d.getHours();
      return h >= nowHour;
    });

    const slice = hourly.time.slice(startIndex, startIndex + 25);
    return slice.map((time, i) => {
      const idx = startIndex + i;
      const isNow = i === 0;
      const weather = getWeatherInfo(hourly.weather_code[idx], true);
      const precipProb = hourly.precipitation_probability[idx] ?? 0;

      return (
        <HourlyCard
          time={time}
          weather={weather}
          hourly={hourly}
          idx={idx}
          tempUnit={tempUnit}
          precipProb={precipProb}
          isNow={isNow}
        />
      );
    });
  }, [hourly, tempUnit]);

  return (
    <section className={styles.section} aria-label="Hourly forecast">
      <h2 className={styles.heading}>Hourly Forecast</h2>
      <div className={styles.scroll} ref={scrollRef}>
        {hourlyCards}
      </div>
    </section>
  );
}

export default HourlyForecast;
