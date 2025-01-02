// ItineraryForm.js
import React, { useEffect, useState } from "react";
import FlagIcon from 'react-flagkit'; // Import FlagIcon from react-flagkit
import { useNavigate } from "react-router-dom";

function ItineraryForm({ onSubmit }) {
  // Initialize state for form fields
  const [itinerary, setItinerary] = useState({
    departureDate: "",
    returnDate: "",
    departureAirport: "",
    destination: null, // Will hold the selected destination object
  });

  // State for the search query and suggestions array
  const [destQuery, setDestQuery] = useState("");
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [destinationInput, setDestinationInput] = useState(""); // New state for input value

  const navigate = useNavigate();

  // Handle standard input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "destination") {
      setDestinationInput(value); // Update input field
      setItinerary((prev) => ({
        ...prev,
        destination: null, // Reset selected destination when typing
      }));
      setDestQuery(value); // Update query for autocomplete
      console.log(`Input changed: ${name} = ${value}`);
    } else {
      setItinerary((prev) => ({
        ...prev,
        [name]: value,
      }));
      console.log(`Input changed: ${name} = ${value}`);
    }
  };

  // Helper function to get countryCode
  const getCountryCode = (place) => {
    // Directly use countryCode from place object if available
    return place.countryCode ? place.countryCode.toUpperCase() : null;
  };

  // Autocomplete fetch from GeoNames
  useEffect(() => {
    // Only search if user has typed at least 2 characters
    if (destQuery.length < 2) {
      setDestSuggestions([]);
      return;
    }

    const username = process.env.REACT_APP_GEONAMES_USERNAME; // from your .env
    const url = `https://secure.geonames.org/searchJSON?username=${username}&name_startsWith=${encodeURIComponent(
      destQuery
    )}&featureClass=P&maxRows=10&style=FULL`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log("GeoNames Data:", data.geonames);
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
    if (itinerary.destination) {
      onSubmit(itinerary);
      navigate("/results");
    } else {
      alert("Please select a destination from the suggestions.");
    }
  };

  // When user clicks a suggestion, fill the input with that name
  const handleSelectSuggestion = (place) => {
    const cityName = place.name;
    const stateOrProvince = place.adminName1 ? `, ${place.adminName1}` : "";
    const countryName = place.countryName ? `, ${place.countryName}` : "";
    const countryCode = place.countryCode ? place.countryCode.toUpperCase() : null;
  
    const fullLocation = `${cityName}${stateOrProvince}${countryName}`;
  
    console.log("Selected Place:", place);
    console.log("Full Location String:", fullLocation);
  
    setItinerary((prev) => ({
      ...prev,
      destination: {
        name: cityName,
        state: place.adminName1 || "",
        country: place.countryName || "",
        countryCode: countryCode,
      },
    }));
  
    setDestinationInput(fullLocation); // Set input field to selected suggestion
    setDestQuery(fullLocation);
    setDestSuggestions([]);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-row">

        {/* Destination City (To) */}
        <div className="search-block has-icon" style={{ position: "relative" }}>
          <span className="search-label">To</span>
          <i className="fa-solid fa-location-dot"></i>
          <input
            type="text"
            name="destination"
            placeholder="Enter Destination City"
            value={destinationInput} // Use destinationInput for display
            onChange={handleChange}
            autoComplete="off"
            required
          />
          {/* AUTOCOMPLETE DROPDOWN */}
          {destSuggestions.length > 0 && (
            <ul className="autocomplete-dropdown">
              {destSuggestions.map((place) => {
                const isoCode = getCountryCode(place);

                return (
                  <li key={place.geonameId} onClick={() => handleSelectSuggestion(place)}>
                    {/* Display flag if isoCode is available */}
                    {isoCode && (
                      <FlagIcon country={isoCode} size={24} className="country-flag" />
                    )}

                    {/* Optionally, display a default icon for unknown countries */}
                    {!isoCode && (
                      <span className="no-flag-icon">🏳️</span> // White flag emoji as placeholder
                    )}

                    {/* City, state, country text */}
                    <span className="place-text">
                      {place.name}
                      {place.adminName1 ? `, ${place.adminName1}` : ""}, {place.countryName}
                    </span>
                  </li>
                );
              })}
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