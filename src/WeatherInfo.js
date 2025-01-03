// WeatherInfo.js
import React, { useEffect, useState } from "react";

function WeatherInfo({ itinerary }) {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const { destination, departureDate, returnDate } = itinerary || {};

  useEffect(() => {
    if (!destination?.name) return;

    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
    const baseUrl = "https://api.weatherapi.com/v1/forecast.json";
    const days = 7; // WeatherAPI's maximum forecast days

    const url = `${baseUrl}?key=${API_KEY}&q=${encodeURIComponent(destination.name)}&days=${days}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => setWeatherData(data))
      .catch((err) => setError(err.message));
  }, [destination]);

  if (error) {
    return <div className="card error">Error: {error}</div>;
  }

  if (!weatherData) {
    return <div className="card loading">Loading weather...</div>;
  }

  // Convert user’s departure/return to JS Dates
  const depDate = new Date(departureDate);
  const retDate = new Date(returnDate);

  // If trip start is more than 7 days away, no forecast available
  const now = new Date();
  const msInDay = 24 * 60 * 60 * 1000;
  const daysUntilDeparture = Math.ceil((depDate - now) / msInDay);

  if (daysUntilDeparture > 7) {
    return (
      <div className="card weather-section">
        <h2>Weather for {destination.name}</h2>
        <p>Your trip is more than 7 days away. Weather forecast is not yet available—check back closer to your trip!</p>
      </div>
    );
  }

  // Otherwise, filter forecast to only show days within [depDate, retDate]
  const forecastDays = weatherData.forecast?.forecastday || [];
  const filteredForecast = forecastDays.filter((day) => {
    const dayDate = new Date(day.date); // e.g. "2023-05-01"
    return dayDate >= depDate && dayDate <= retDate;
  });

  // If no forecast days remain after filtering, user’s trip might extend beyond the available forecast
  if (filteredForecast.length === 0) {
    return (
      <div className="card weather-section">
        <h2>Weather for {destination.name}</h2>
        <p>No weather data available for these dates. Part (or all) of your trip may be beyond the 7-day forecast window.</p>
      </div>
    );
  }

  return (
    <section className="card weather-section">
      <h2>Weather for {destination.name}</h2>
      <p>{departureDate} - {returnDate}</p>
      <ul>
        {filteredForecast.map((day) => (
          <li key={day.date}>
            <span>{day.date}</span>
            <span>
              <img src={day.day.condition.icon} alt={day.day.condition.text} />
              {day.day.condition.text}, High: {day.day.maxtemp_c}°C / {day.day.maxtemp_f}°F,
              Low: {day.day.mintemp_c}°C / {day.day.mintemp_f}°F
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default WeatherInfo;