import React from "react";
console.log("ScamReport loaded!");

export default function ScamReport({ itinerary }) {
  return (
    <section className="scam-section card">
      <h2>Scam Report</h2>
      <p>Be aware of possible scams in {itinerary?.destination}!</p>
    </section>
  );
}