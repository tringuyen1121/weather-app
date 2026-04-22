import { getWeatherInfo, formatDay, round } from "../../utils/weatherCodes";
import type { DailyWeather } from "../../types/weather";
import { useUnit } from "../../context/UnitContext";
import styles from "./DailyForecast.module.scss";

interface DailyForecastProps {
  daily: DailyWeather;
}

export function DailyForecast({ daily }: DailyForecastProps) {
  const { isMetric } = useUnit();
  const tempUnit = isMetric ? "°C" : "°F";

  // Compute overall min/max across the week for the temperature bar
  const allMax = daily.temperature_2m_max;
  const allMin = daily.temperature_2m_min;
  const globalMax = Math.max(...allMax);
  const globalMin = Math.min(...allMin);
  const range = globalMax - globalMin || 1;

  return (
    <section className={styles.section} aria-label="7-day forecast">
      <h2 className={styles.heading}>7-Day Forecast</h2>
      <div className={styles.list}>
        {daily.time.map((date, i) => {
          const weather = getWeatherInfo(daily.weather_code[i], true);
          const high = daily.temperature_2m_max[i];
          const low = daily.temperature_2m_min[i];
          const precip = daily.precipitation_probability_max[i] ?? 0;
          const isToday = i === 0;

          // Temperature bar positioning
          const barLeft = ((low - globalMin) / range) * 100;
          const barWidth = ((high - low) / range) * 100;

          return (
            <div
              key={date}
              className={`${styles.row} ${isToday ? styles.today : ""}`}
            >
              <span className={styles.day}>
                {isToday ? "Today" : formatDay(date, true)}
              </span>

              <span
                className={styles.icon}
                role="img"
                aria-label={weather.description}
              >
                {weather.icon}
              </span>

              {precip > 0 && (
                <span className={styles.precip}>💧 {precip}%</span>
              )}
              {precip === 0 && <span className={styles.precipEmpty} />}

              <div className={styles.tempRow}>
                <span className={styles.low}>
                  {round(low)}
                  {tempUnit}
                </span>
                <div className={styles.bar} aria-hidden="true">
                  <div
                    className={styles.barFill}
                    style={{
                      left: `${barLeft}%`,
                      width: `${Math.max(barWidth, 8)}%`,
                    }}
                  />
                </div>
                <span className={styles.high}>
                  {round(high)}
                  {tempUnit}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
