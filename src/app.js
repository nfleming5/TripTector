import "./App.css";
import ItineraryForm from "./ItineraryForm";

function App() {
  return (
    <div className="app-container">
      <h1 className="hero-title">TripTector</h1>
      <p className="hero-subtitle">
        Shield yourself from travel scams and plan your journey with ease
      </p>

      <div className="search-bar-container">
        <ItineraryForm />
      </div>
    </div>
  );
}

export default App;
