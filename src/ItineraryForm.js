import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ItineraryForm({ onSubmit }) {
  const [itinerary, setItinerary] = useState({
    departureDate: "",
    returnDate: "",
    departureAirport: "",
    destination: "",
  });

  // React Router v6: useNavigate replaces useHistory
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItinerary((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Send data back up to parent (App.js)
    onSubmit(itinerary);
    // Navigate to /results
    navigate("/results");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Plan Your Trip</h2>
      <div>
        <label>Departure Date:</label>
        <input
          type="date"
          name="departureDate"
          value={itinerary.departureDate}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Return Date:</label>
        <input
          type="date"
          name="returnDate"
          value={itinerary.returnDate}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Departure Airport:</label>
        <input
          type="text"
          name="departureAirport"
          placeholder="e.g. JFK"
          value={itinerary.departureAirport}
          onChange={handleChange}
        />
      </div>
      <div>
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
      <button type="submit">Submit</button>
    </form>
  );
}

export default ItineraryForm;