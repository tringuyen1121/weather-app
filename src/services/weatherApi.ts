import type { WeatherData, GeocodingResult, Units } from "../types/weather";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

export async function fetchWeather(
  latitude: number,
  longitude: number,
  units: Units,
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "precipitation",
      "rain",
      "weather_code",
      "cloud_cover",
      "wind_speed_10m",
      "wind_direction_10m",
    ].join(","),
    hourly: [
      "temperature_2m",
      "precipitation_probability",
      "weather_code",
      "wind_speed_10m",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
      "precipitation_probability_max",
      "uv_index_max",
      "wind_speed_10m_max",
    ].join(","),
    temperature_unit: units.temperature,
    wind_speed_unit: units.wind,
    precipitation_unit: units.precipitation,
    timezone: "auto",
    forecast_days: "7",
  });

  const response = await fetch(`${FORECAST_URL}?${params}`);
  if (!response.ok) {
    throw new Error(
      `Weather API error: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    current: {
      temperature: data.current.temperature_2m,
      apparent_temperature: data.current.apparent_temperature,
      relative_humidity: data.current.relative_humidity_2m,
      is_day: data.current.is_day,
      precipitation: data.current.precipitation,
      rain: data.current.rain,
      weather_code: data.current.weather_code,
      cloud_cover: data.current.cloud_cover,
      wind_speed: data.current.wind_speed_10m,
      wind_direction: data.current.wind_direction_10m,
      time: data.current.time,
    },
    hourly: data.hourly,
    daily: data.daily,
  };
}

export async function searchLocations(query: string): Promise<GeocodingResult> {
  if (!query.trim()) return { results: [] };

  const params = new URLSearchParams({
    name: query.trim(),
    count: "6",
    language: "en",
    format: "json",
  });

  const response = await fetch(`${GEOCODING_URL}?${params}`);
  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status}`);
  }

  return response.json();
}
