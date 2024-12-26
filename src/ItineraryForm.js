import { useState } from 'react';

function ItineraryForm() {
  // Step 1: useState for form fields
  const [itinerary, setItinerary] = useState({
    departureDate: '',
    returnDate: '',
    departureAirport: '',
    destination: '',
  });

  // Step 2: handleChange for each form field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItinerary((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Step 3: handleSubmit for when the form is submitted
  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just log the itinerary to the console
    console.log('Itinerary Submitted:', itinerary);

    // Later steps:
    //  - Validate input
    //  - Call weather or scam APIs
    //  - Save itinerary to a database, etc.

    // Example "thank you" message or user feedback
    alert('Itinerary submitted! Check the console for details.');
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
        <label>Destination:</label>
        <input
          type="text"
          name="destination"
          placeholder="e.g. LAX"
          value={itinerary.destination}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default ItineraryForm;