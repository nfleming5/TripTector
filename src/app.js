// src/App.js
import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import CultureTips from "./CultureTips";
import ItineraryForm from "./ItineraryForm";
import ScamReport from "./ScamReport";
import "./ScamReport.css";
import WeatherInfo from "./WeatherInfo";
// import ClearCacheButton from "./ClearCacheButton"; // Optional: If implemented

function App() {
  const [itinerary, setItinerary] = useState(null);

  function handleItinerarySubmit(formData) {
    setItinerary(formData);
  }

  useEffect(() => {
    if (itinerary) {
      localStorage.setItem("itinerary", JSON.stringify(itinerary));
    }
  }, [itinerary]);

  useEffect(() => {
    const saved = localStorage.getItem("itinerary");
    if (saved) {
      setItinerary(JSON.parse(saved));
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* HERO SECTION */}
                <h1 className="hero-title">TripTector</h1>
                <p className="hero-subtitle">
                  Shield yourself from travel scams and plan your journey with
                  ease
                </p>

                {/* FORM CONTAINER */}
                <div className="form-container">
                  <ItineraryForm onSubmit={handleItinerarySubmit} />
                </div>
              </>
            }
          />

          <Route
            path="/results"
            element={
              itinerary ? (
                <div className="results-container">
                  <WeatherInfo itinerary={itinerary} />
                  <CultureTips itinerary={itinerary} />
                  <ScamReport itinerary={itinerary} />
                  {/* Optional: Include ClearCacheButton for testing purposes */}
                  {/* <ClearCacheButton /> */}
                </div>
              ) : (
                <div
                  className="card"
                  style={{ padding: "1rem", margin: "2rem" }}
                >
                  <h2>No itinerary found.</h2>
                  <p>
                    Please return to the homepage and enter your trip details.
                  </p>
                </div>
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
