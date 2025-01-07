import React, { useEffect, useState } from "react";

function WeatherInfo({ itinerary }) {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const { destination, departureDate, returnDate } = itinerary || {};

  useEffect(() => {
    if (!destination?.name) return;

    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
    const baseUrl = "https://api.weatherapi.com/v1/forecast.json";
    const days = 7;

    const url = `${baseUrl}?key=${API_KEY}&q=${encodeURIComponent(
      destination.name
    )}&days=${days}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
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

  // Parse dates using YYYY-MM-DD format from the form
  const parseDateStr = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  const depDateStr = parseDateStr(departureDate);
  const retDateStr = parseDateStr(returnDate);
  
  const now = new Date();
  const depDate = new Date(departureDate);
  const msInDay = 24 * 60 * 60 * 1000;
  const daysUntilDeparture = Math.ceil((depDate - now) / msInDay);

  if (daysUntilDeparture > 7) {
    return (
      <div className="card weather-section">
        <h2>Your Weather Forecast For {destination.name}</h2>
        <p>
          Your trip is more than 7 days away. Weather forecast is not yet
          available—check back closer to your trip!
        </p>
      </div>
    );
  }

  const forecastDays = weatherData.forecast?.forecastday || [];
  const filteredForecast = forecastDays.filter((day) => {
    // Compare dates as strings in YYYY-MM-DD format
    return day.date >= depDateStr && day.date <= retDateStr;
  });

  if (filteredForecast.length === 0) {
    return (
      <div className="card weather-section">
        <h2>Weather for {destination.name}</h2>
        <p>
          No weather data available for these dates. Part (or all) of your trip
          may be beyond the 7-day forecast window.
        </p>
      </div>
    );
  }

  // Format dates for display
  const formatDisplayDate = (dateStr) => {
    const date = new Date(dateStr);
    // Ensure we're not losing a day due to timezone conversion
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="card weather-section">
      <h2>Weather for {destination.name}</h2>
      <p>
        {formatDisplayDate(departureDate)} to {formatDisplayDate(returnDate)}
      </p>

      <div className="weather-forecast-grid">
        {filteredForecast.map((day) => {
          const date = new Date(day.date);
          // Adjust for timezone
          date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
          const dateOptions = {
            weekday: "short",
            month: "short",
            day: "numeric",
          };
          const displayDate = date.toLocaleDateString("en-US", dateOptions);
          const { icon, text } = day.day.condition;

          return (
            <div key={day.date} className="weather-day">
              <div className="day-date">{displayDate}</div>
              <div className="day-icon">
                <img src={icon} alt={text} />
              </div>
              <div className="day-temps">
                <span className="temp-high">
                  {Math.round(day.day.maxtemp_c)}°C
                </span>{" "}
                /{" "}
                <span className="temp-low">
                  {Math.round(day.day.mintemp_c)}°C
                </span>
              </div>
              <div className="day-condition">{text}</div>
              {day.day.daily_chance_of_rain > 0 && (
                <div className="day-rain-chance">
                  Rain: {day.day.daily_chance_of_rain}%
                </div>
              )}
              {day.day.maxwind_kph && (
                <div className="day-wind">
                  Wind: {Math.round(day.day.maxwind_kph)} kph
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default WeatherInfo;