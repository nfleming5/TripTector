// ItineraryForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ItineraryForm({ onSubmit }) {
  // Initialize state for form fields
  const [itinerary, setItinerary] = useState({
    departureDate: "",
    returnDate: "",
    departureAirport: "",
    destination: "",
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItinerary((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Send data back up to parent (App.js)
    onSubmit(itinerary);
    // Navigate to /results
    navigate("/results");
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

        {/* Swap icon if you want that two-way arrow in the middle */}
        <div className="swap-icon">
          <img src="/swap.png" alt="Swap" />
        </div>

        {/* Destination City (To) */}
        <div className="search-block">
          <span className="search-label">To</span>
          <input
            type="text"
            name="destination"
            placeholder="Country, city or airport"
            value={itinerary.destination}
            onChange={handleChange}
            required
          />
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
