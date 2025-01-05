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
              <div className="home-page">
                <h1 className="hero-title">TripTector</h1>
                <p className="hero-subtitle">
                  Shield yourself from travel scams and plan your journey with
                  ease
                </p>

                <div className="form-container">
                  <ItineraryForm onSubmit={handleItinerarySubmit} />
                </div>
              </div>
            }
          />

          <Route
            path="/results"
            element={
              itinerary ? (
                <div className="results-page">
                  <header className="results-nav">
                    <div className="logo">TripTector</div>
                    <nav className="nav-links">
                      {/* Link to the CultureTips section (id="culture-tips") */}
                      <a href="#culture-tips">Culture Tips</a>
                      {/* Link to the ScamReport section (id="scam-report") */}
                      <a href="#scam-report">Report a Scam</a>
                      {/* etc. */}
                    </nav>
                  </header>
                  {/* WEATHER SECTION */}
                  <section className="results-section weather-background">
                    <WeatherInfo itinerary={itinerary} />
                  </section>

                  {/* CULTURE SECTION */}
                  <section
                    className="results-section culture-background"
                    id="culture-tips"
                  >
                    <CultureTips itinerary={itinerary} />
                  </section>

                  {/* SCAM REPORT SECTION */}
                  <section
                    className="results-section scam-background"
                    id="scam-report"
                  >
                    <ScamReport itinerary={itinerary} />
                  </section>
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
