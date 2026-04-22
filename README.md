# WeatherDisplay

A modern weather application built with React, TypeScript, and Sass that integrates with the [Open-Meteo](https://open-meteo.com/) API. Displays current conditions, 24-hour hourly forecasts, a 7-day outlook, and detailed weather metrics — with no API key required.

## Features

- **City search** with autocomplete powered by the Open-Meteo Geocoding API
- **Geolocation** — one-click "use my location" button
- **Current conditions** — temperature, feels-like, humidity, wind speed & direction
- **Hourly forecast** — next 25 hours with precipitation probability
- **7-day forecast** — daily high/low with a relative temperature bar
- **Weather details** — cloud cover, UV index, sunrise/sunset, precipitation
- **Unit toggle** — switch between metric (°C / km/h / mm) and imperial (°F / mph / in)
- **Dynamic backgrounds** — gradient changes based on weather condition and day/night
- **Persistent location** — last selected city is saved to `localStorage`
- Fully **responsive** layout (mobile → desktop)

## Tech Stack

| Layer       | Choice                           |
| ----------- | -------------------------------- |
| Framework   | React 19                         |
| Language    | TypeScript (strict)              |
| Styles      | Sass + CSS Modules               |
| Build       | Vite                             |
| CI/CD       | GitHub Actions → GitHub Pages    |
| Weather API | Open-Meteo (free, no key needed) |

## Project Structure

```
src/
├── components/
│   ├── CurrentWeather/   # Main weather card
│   ├── DailyForecast/    # 7-day forecast list
│   ├── HourlyForecast/   # Horizontal 25-hour scroll
│   ├── SearchBar/        # City search with autocomplete
│   ├── UnitToggle/       # °C / °F toggle
│   └── WeatherDetails/   # Detail grid (humidity, UV, etc.)
├── context/
│   └── UnitContext.tsx   # Global unit state
├── hooks/
│   ├── useGeocoding.ts   # Debounced location search
│   └── useWeather.ts     # Weather data fetching
├── services/
│   └── weatherApi.ts     # Open-Meteo API calls
├── styles/
│   ├── _variables.scss   # Design tokens
│   ├── _mixins.scss      # Reusable mixins
│   └── global.scss       # Global reset & base styles
├── types/
│   └── weather.ts        # TypeScript interfaces
└── utils/
    └── weatherCodes.ts   # WMO code → description/icon/bg
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repo
git clone https://github.com/<your-username>/weather-display.git
cd weather-display

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

Output goes to the `dist/` directory. Preview it locally with:

```bash
npm run preview
```

### Type Checking

```bash
npx tsc --noEmit
```

## Configuration

No API keys are required — Open-Meteo is a free, open service.

The only optional environment variable is used at build time for GitHub Pages deployment:

| Variable         | Purpose                                                                                       | Example             |
| ---------------- | --------------------------------------------------------------------------------------------- | ------------------- |
| `VITE_BASE_PATH` | Sets the Vite [`base`](https://vite.dev/config/shared-options.html#base) for sub-path hosting | `/weather-display/` |

## Deployment (GitHub Pages)

1. Push your code to a GitHub repository.
2. In the repository settings, go to **Pages** → set source to **GitHub Actions**.
3. Push to the `main` branch — the CI/CD workflow (`.github/workflows/ci.yml`) will automatically:
   - Type-check the project
   - Build with the correct `VITE_BASE_PATH`
   - Deploy to GitHub Pages

The deployed URL will be `https://<your-username>.github.io/<repo-name>/`.

## CI/CD Workflow

```
push / PR to main
       │
       ▼
   [build job]
   ├─ npm ci
   ├─ tsc --noEmit  (type check)
   └─ npm run build
          │
          ▼ (main branch only)
   [deploy job]
   └─ actions/deploy-pages → GitHub Pages
```

## API Reference

This app uses two Open-Meteo endpoints — both free with no rate limit for reasonable use:

| Endpoint                                         | Purpose               |
| ------------------------------------------------ | --------------------- |
| `https://geocoding-api.open-meteo.com/v1/search` | City autocomplete     |
| `https://api.open-meteo.com/v1/forecast`         | Weather forecast data |

## License

MIT
