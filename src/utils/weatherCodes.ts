export interface WeatherInfo {
  description: string;
  icon: string;
  bgClass: string;
}

interface CodeEntry {
  description: string;
  icon: string;
  dayBg: string;
  nightBg: string;
}

const CODE_MAP: Record<number, CodeEntry> = {
  0: {
    description: "Clear Sky",
    icon: "☀️",
    dayBg: "clear-day",
    nightBg: "clear-night",
  },
  1: {
    description: "Mainly Clear",
    icon: "🌤️",
    dayBg: "partly-cloudy",
    nightBg: "partly-cloudy-night",
  },
  2: {
    description: "Partly Cloudy",
    icon: "⛅",
    dayBg: "partly-cloudy",
    nightBg: "partly-cloudy-night",
  },
  3: {
    description: "Overcast",
    icon: "☁️",
    dayBg: "cloudy",
    nightBg: "cloudy",
  },
  45: { description: "Foggy", icon: "🌫️", dayBg: "fog", nightBg: "fog" },
  48: { description: "Icy Fog", icon: "🌫️", dayBg: "fog", nightBg: "fog" },
  51: {
    description: "Light Drizzle",
    icon: "🌦️",
    dayBg: "drizzle",
    nightBg: "drizzle",
  },
  53: {
    description: "Drizzle",
    icon: "🌦️",
    dayBg: "drizzle",
    nightBg: "drizzle",
  },
  55: {
    description: "Heavy Drizzle",
    icon: "🌧️",
    dayBg: "rain",
    nightBg: "rain",
  },
  61: { description: "Light Rain", icon: "🌧️", dayBg: "rain", nightBg: "rain" },
  63: { description: "Rain", icon: "🌧️", dayBg: "rain", nightBg: "rain" },
  65: { description: "Heavy Rain", icon: "🌧️", dayBg: "rain", nightBg: "rain" },
  71: { description: "Light Snow", icon: "🌨️", dayBg: "snow", nightBg: "snow" },
  73: { description: "Snow", icon: "❄️", dayBg: "snow", nightBg: "snow" },
  75: { description: "Heavy Snow", icon: "❄️", dayBg: "snow", nightBg: "snow" },
  77: {
    description: "Snow Grains",
    icon: "🌨️",
    dayBg: "snow",
    nightBg: "snow",
  },
  80: {
    description: "Light Showers",
    icon: "🌦️",
    dayBg: "drizzle",
    nightBg: "drizzle",
  },
  81: {
    description: "Rain Showers",
    icon: "🌧️",
    dayBg: "rain",
    nightBg: "rain",
  },
  82: {
    description: "Heavy Showers",
    icon: "⛈️",
    dayBg: "storm",
    nightBg: "storm",
  },
  85: {
    description: "Snow Showers",
    icon: "🌨️",
    dayBg: "snow",
    nightBg: "snow",
  },
  86: {
    description: "Heavy Snow Showers",
    icon: "❄️",
    dayBg: "snow",
    nightBg: "snow",
  },
  95: {
    description: "Thunderstorm",
    icon: "⛈️",
    dayBg: "storm",
    nightBg: "storm",
  },
  96: {
    description: "Thunderstorm w/ Hail",
    icon: "⛈️",
    dayBg: "storm",
    nightBg: "storm",
  },
  99: {
    description: "Severe Thunderstorm",
    icon: "⛈️",
    dayBg: "storm",
    nightBg: "storm",
  },
};

const FALLBACK: CodeEntry = {
  description: "Unknown",
  icon: "🌡️",
  dayBg: "clear-day",
  nightBg: "clear-night",
};

export function getWeatherInfo(
  code: number,
  isDay: boolean = true,
): WeatherInfo {
  const entry = CODE_MAP[code] ?? FALLBACK;
  return {
    description: entry.description,
    icon: entry.icon,
    bgClass: isDay ? entry.dayBg : entry.nightBg,
  };
}

export function getWindDirection(degrees: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(degrees / 45) % 8];
}

export function formatHour(isoTime: string): string {
  const date = new Date(isoTime);
  const hours = date.getHours();
  if (hours === 0) return "12 AM";
  if (hours === 12) return "12 PM";
  return hours < 12 ? `${hours} AM` : `${hours - 12} PM`;
}

export function formatDay(isoDate: string, short = false): string {
  const date = new Date(`${isoDate}T12:00:00`);
  return date.toLocaleDateString("en-US", {
    weekday: short ? "short" : "long",
  });
}

export function formatTime(isoTime: string): string {
  const date = new Date(isoTime);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function round(value: number): number {
  return Math.round(value);
}
