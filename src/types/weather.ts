export interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
  timezone: string;
}

export type TemperatureUnit = "celsius" | "fahrenheit";
export type WindUnit = "kmh" | "mph";
export type PrecipitationUnit = "mm" | "inch";

export interface Units {
  temperature: TemperatureUnit;
  wind: WindUnit;
  precipitation: PrecipitationUnit;
}

export interface CurrentWeather {
  temperature: number;
  apparent_temperature: number;
  relative_humidity: number;
  is_day: number;
  precipitation: number;
  rain: number;
  weather_code: number;
  cloud_cover: number;
  wind_speed: number;
  wind_direction: number;
  time: string;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: number[];
  weather_code: number[];
  wind_speed_10m: number[];
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  precipitation_probability_max: number[];
  uv_index_max: number[];
  wind_speed_10m_max: number[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
}

export interface GeocodingResult {
  results?: Location[];
}
