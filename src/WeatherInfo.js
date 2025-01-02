// WeatherInfo.js
import React, { useEffect, useState } from "react";

function WeatherInfo({ itinerary }) {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  // Destructure relevant fields from itinerary
  const { destination, departureDate, returnDate } = itinerary;

  useEffect(() => {
    // Ensure destination and destination.name are defined
    if (!destination || !destination.name) return;

    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
    const baseUrl = "https://api.weatherapi.com/v1/forecast.json";
    const days = 7; // for a 7-day forecast

    // Use destination.name as a string
    const url = `${baseUrl}?key=${API_KEY}&q=${encodeURIComponent(destination.name)}&days=${days}`;

    console.log("Fetching weather data from URL:", url);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Weather Data Received:", data);
        setWeatherData(data);
      })
      .catch((err) => {
        console.error("Weather API Error:", err.message);
        setError(err.message);
      });
  }, [destination]);

  if (error) {
    return <div className="card error">Error: {error}</div>;
  }

  if (!weatherData) {
    return <div className="card loading">Loading weather...</div>;
  }

  // Access forecast data
  const locationName = weatherData.location?.name;
  const forecastDays = weatherData.forecast?.forecastday || [];

  return (
    <section className="card weather-section">
      <h2>Weather for {locationName}</h2>
      <p>
        {departureDate} - {returnDate}
      </p>
      <ul>
        {forecastDays.map((day) => (
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