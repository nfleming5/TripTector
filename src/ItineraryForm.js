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
      <h2>Plan Your Trip</h2>

      <div className="search-row">
        <div className="search-field">
          <label>Departure Date:</label>
          <input
            type="date"
            name="departureDate"
            value={itinerary.departureDate}
            onChange={handleChange}
          />
        </div>

        <div className="search-field">
          <label>Return Date:</label>
          <input
            type="date"
            name="returnDate"
            value={itinerary.returnDate}
            onChange={handleChange}
          />
        </div>

        <div className="search-field">
          <label>Departure Airport:</label>
          <input
            type="text"
            name="departureAirport"
            placeholder="e.g. JFK"
            value={itinerary.departureAirport}
            onChange={handleChange}
          />
        </div>

        <div className="search-field">
          <label>Destination City:</label>
          <input
            type="text"
            name="destination"
            placeholder="e.g. Paris"
            value={itinerary.destination}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button1">
          <img src="/arrow.png" alt="Submit" />
        </button>
      </div>
    </form>
  );
}

export default ItineraryForm;
