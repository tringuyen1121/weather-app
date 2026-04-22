import { getWindDirection, formatTime, round } from "../../utils/weatherCodes";
import type { CurrentWeather, DailyWeather } from "../../types/weather";
import { useUnit } from "../../context/UnitContext";
import styles from "./WeatherDetails.module.scss";

interface WeatherDetailsProps {
  current: CurrentWeather;
  daily: DailyWeather;
}

interface DetailCardProps {
  icon: string;
  label: string;
  value: string;
  sub?: string;
}

function DetailCard({ icon, label, value, sub }: DetailCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.icon} role="img" aria-hidden="true">
        {icon}
      </span>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      {sub && <span className={styles.sub}>{sub}</span>}
    </div>
  );
}

export function WeatherDetails({ current, daily }: WeatherDetailsProps) {
  const { isMetric } = useUnit();
  const windUnit = isMetric ? "km/h" : "mph";
  const precipUnit = isMetric ? "mm" : "in";

  const uvIndex = daily.uv_index_max[0] ?? 0;
  const uvLabel =
    uvIndex <= 2
      ? "Low"
      : uvIndex <= 5
        ? "Moderate"
        : uvIndex <= 7
          ? "High"
          : uvIndex <= 10
            ? "Very High"
            : "Extreme";

  return (
    <section className={styles.section} aria-label="Weather details">
      <h2 className={styles.heading}>Details</h2>
      <div className={styles.grid}>
        <DetailCard
          icon="💧"
          label="Humidity"
          value={`${current.relative_humidity}%`}
          sub={
            current.relative_humidity < 30
              ? "Dry"
              : current.relative_humidity < 60
                ? "Comfortable"
                : "Humid"
          }
        />
        <DetailCard
          icon="💨"
          label="Wind"
          value={`${round(current.wind_speed)} ${windUnit}`}
          sub={`${getWindDirection(current.wind_direction)} · ${current.wind_direction}°`}
        />
        <DetailCard
          icon="🌡️"
          label="Feels Like"
          value={`${round(current.apparent_temperature)}°`}
          sub={
            current.apparent_temperature < current.temperature
              ? "Feels colder"
              : current.apparent_temperature > current.temperature
                ? "Feels warmer"
                : "True to temperature"
          }
        />
        <DetailCard
          icon="☁️"
          label="Cloud Cover"
          value={`${current.cloud_cover}%`}
          sub={
            current.cloud_cover < 20
              ? "Clear"
              : current.cloud_cover < 50
                ? "Partly cloudy"
                : current.cloud_cover < 80
                  ? "Mostly cloudy"
                  : "Overcast"
          }
        />
        <DetailCard
          icon="🌧️"
          label="Precipitation"
          value={`${current.precipitation} ${precipUnit}`}
          sub="Current hour"
        />
        <DetailCard
          icon="🔆"
          label="UV Index"
          value={`${round(uvIndex)}`}
          sub={uvLabel}
        />
        <DetailCard
          icon="🌅"
          label="Sunrise"
          value={formatTime(daily.sunrise[0])}
        />
        <DetailCard
          icon="🌇"
          label="Sunset"
          value={formatTime(daily.sunset[0])}
        />
      </div>
    </section>
  );
}
