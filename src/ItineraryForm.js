// ItineraryForm.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ItineraryForm({ onSubmit }) {
  // Initialize state for form fields
  const [itinerary, setItinerary] = useState({
    departureDate: "",
    returnDate: "",
    departureAirport: "",
    destination: "",
  });

  // NEW: state for the search query and suggestions array
  const [destQuery, setDestQuery] = useState("");
  const [destSuggestions, setDestSuggestions] = useState([]);

  const navigate = useNavigate();

  // Handle standard input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItinerary((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If the user is typing in the "destination" field, also update destQuery
    if (name === "destination") {
      setDestQuery(value);
    }
  };

  // Autocomplete fetch from GeoNames
  useEffect(() => {
    // Only search if user has typed at least 2-3 characters
    if (destQuery.length < 2) {
      setDestSuggestions([]);
      return;
    }

    const username = process.env.REACT_APP_GEONAMES_USERNAME; // from your .env
    const url = `http://api.geonames.org/searchJSON?username=${username}&name_startsWith=${encodeURIComponent(
      destQuery
    )}&featureClass=P&maxRows=10`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.geonames) {
          setDestSuggestions(data.geonames);
        } else {
          setDestSuggestions([]);
        }
      })
      .catch((err) => {
        console.error("GeoNames API Error:", err);
        setDestSuggestions([]);
      });
  }, [destQuery]);

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(itinerary);
    navigate("/results");
  };

  // When user clicks a suggestion, fill the input with that name
  const handleSelectSuggestion = (place) => {
    // place is an object from data.geonames
    const cityName = place.name;
    setItinerary((prev) => ({
      ...prev,
      destination: cityName,
    }));
    setDestQuery(cityName);
    setDestSuggestions([]); // hide suggestions
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-row">
        {/* Departure Airport (From) */}
        <div className="search-block">
          <span className="search-label">From</span>
          <input
            type="text"
            name="departureAirport"
            placeholder="City or airport"
            value={itinerary.departureAirport}
            onChange={handleChange}
          />
        </div>

        {/* Swap icon (if desired) */}
        <div className="swap-icon">
          <img src="/swap.png" alt="Swap" />
        </div>

        {/* Destination City (To) */}
        <div className="search-block" style={{ position: "relative" }}>
          <span className="search-label">To</span>
          <input
            type="text"
            name="destination"
            placeholder="Country, city or airport"
            value={itinerary.destination}
            onChange={handleChange}
            required
          />
          {/* AUTOCOMPLETE DROPDOWN */}
          {destSuggestions.length > 0 && (
            <ul className="autocomplete-dropdown">
              {destSuggestions.map((place) => (
                <li
                  key={place.geonameId}
                  onClick={() => handleSelectSuggestion(place)}
                >
                  {place.name}, {place.countryName}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Departure Date */}
        <div className="search-block">
          <span className="search-label">Depart</span>
          <input
            type="date"
            name="departureDate"
            value={itinerary.departureDate}
            onChange={handleChange}
          />
        </div>

        {/* Return Date */}
        <div className="search-block">
          <span className="search-label">Return</span>
          <input
            type="date"
            name="returnDate"
            value={itinerary.returnDate}
            onChange={handleChange}
          />
        </div>

        {/* Search Button */}
        <button type="submit" className="search-button">
          Search
        </button>
      </div>
    </form>
  );
}

export default ItineraryForm;
