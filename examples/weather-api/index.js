const express = require("express");
const { x402Handler } = require("./middleware/x402-handler");
const config = require("./stackpay.config.json");

const app = express();
const PORT = process.env.PORT || 3001;

// Geocoding data for common cities
const CITIES = {
  "new york": { lat: 40.7128, lon: -74.006 },
  london: { lat: 51.5074, lon: -0.1278 },
  tokyo: { lat: 35.6762, lon: 139.6503 },
  paris: { lat: 48.8566, lon: 2.3522 },
  berlin: { lat: 52.52, lon: 13.405 },
  sydney: { lat: -33.8688, lon: 151.2093 },
  singapore: { lat: 1.3521, lon: 103.8198 },
  "san francisco": { lat: 37.7749, lon: -122.4194 },
  jakarta: { lat: -6.2088, lon: 106.8456 },
  mumbai: { lat: 19.076, lon: 72.8777 },
};

// Weather code descriptions
const WEATHER_CODES = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
};

// API info (free)
app.get("/", (req, res) => {
  res.json({
    name: "StackPay Weather API",
    version: "1.0.0",
    description: "Real-time weather data monetized with Bitcoin micropayments",
    pricing: `${config.price} ${config.currency} per request`,
    endpoints: [
      {
        path: "/api/weather?city=tokyo",
        method: "GET",
        description: "Get current weather",
      },
      {
        path: "/api/forecast?city=london&days=7",
        method: "GET",
        description: "Get weather forecast",
      },
    ],
    supportedCities: Object.keys(CITIES),
  });
});

// Apply payment middleware to /api routes
app.use("/api", x402Handler(config));

// Current weather endpoint
app.get("/api/weather", async (req, res) => {
  const city = (req.query.city || "").toString().toLowerCase();

  if (!city) {
    return res.status(400).json({
      error: "Missing parameter",
      message: "City parameter is required. Example: /api/weather?city=tokyo",
    });
  }

  const coords = CITIES[city];
  if (!coords) {
    return res.status(404).json({
      error: "City not found",
      message: `City "${city}" not supported. Available: ${Object.keys(CITIES).join(", ")}`,
    });
  }

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto`,
    );

    if (!response.ok) {
      throw new Error("Weather service unavailable");
    }

    const data = await response.json();
    const current = data.current;

    res.json({
      city: city.charAt(0).toUpperCase() + city.slice(1),
      coordinates: coords,
      current: {
        temperature: current.temperature_2m,
        temperatureUnit: "°C",
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        weatherCode: current.weather_code,
        weatherDescription: WEATHER_CODES[current.weather_code] || "Unknown",
        windSpeed: current.wind_speed_10m,
        windSpeedUnit: "km/h",
        windDirection: current.wind_direction_10m,
      },
      timestamp: new Date().toISOString(),
      payment: {
        verified: true,
        price: config.price,
        currency: config.currency,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Weather API failed", message: error.message });
  }
});

// Forecast endpoint
app.get("/api/forecast", async (req, res) => {
  const city = (req.query.city || "").toString().toLowerCase();
  const days = Math.min(parseInt(req.query.days) || 7, 16);

  if (!city) {
    return res.status(400).json({ error: "City parameter required" });
  }

  const coords = CITIES[city];
  if (!coords) {
    return res.status(404).json({ error: `City "${city}" not supported` });
  }

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=${days}&timezone=auto`,
    );

    const data = await response.json();

    const forecast = data.daily.time.map((date, i) => ({
      date,
      tempMax: data.daily.temperature_2m_max[i],
      tempMin: data.daily.temperature_2m_min[i],
      weatherCode: data.daily.weather_code[i],
      weatherDescription:
        WEATHER_CODES[data.daily.weather_code[i]] || "Unknown",
      precipitation: data.daily.precipitation_sum[i],
    }));

    res.json({
      city: city.charAt(0).toUpperCase() + city.slice(1),
      days,
      forecast,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Forecast API failed", message: error.message });
  }
});

app.listen(PORT, () => {
  console.log("");
  console.log(`  🌤️  Weather API running on http://localhost:${PORT}`);
  console.log(`  💰 Price: ${config.price} ${config.currency} per request`);
  console.log(`  📄 Docs: http://localhost:${PORT}/`);
  console.log("");
});
