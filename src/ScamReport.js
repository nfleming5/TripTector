// ScamReport.js
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FaCreditCard,
  FaExchangeAlt,
  FaGift,
  FaHandsHelping,
  FaHome,
  FaMoneyCheckAlt,
  FaTaxi,
  FaUser,
  FaUserSecret,
} from "react-icons/fa";
import { db } from "./firebase";
import "./ScamReport.css"; // Import the ScamReport CSS
import { scamTypes } from "./scamTypes";

const capitalizeWords = (str) => {
  if (!str) return "";
  if (typeof str !== "string") {
    console.error("capitalizeWords expected a string, got:", str);
    return "";
  }
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Function to get icon based on scam type
const getScamIcon = (scamType) => {
  const icons = {
    "Fake Police Officer": <FaUserSecret className="scam-icon" />,
    "Overpriced Taxi": <FaTaxi className="scam-icon" />,
    "Accommodation Scam": <FaHome className="scam-icon" />,
    "Distraction Theft": <FaMoneyCheckAlt className="scam-icon" />,
    "ATM Skimming": <FaCreditCard className="scam-icon" />,
    "Currency Exchange Scam": <FaExchangeAlt className="scam-icon" />,
    "Fake Tour Guides": <FaGift className="scam-icon" />,
    "Free Gifts Scam": <FaGift className="scam-icon" />,
    Pickpocketing: <FaUser className="scam-icon" />,
    "Fake Charity": <FaHandsHelping className="scam-icon" />,
  };
  return icons[scamType] || <FaUserSecret className="scam-icon" />;
};

function ScamReport({ itinerary }) {
  const [selectedScam, setSelectedScam] = useState("");
  const [location, setLocation] = useState(itinerary?.destination.name || "");
  const [comments, setComments] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc"); // Default to newest first
  const [lastVisibleReport, setLastVisibleReport] = useState(null); // State for pagination

  // Fetch initial reports
  const fetchInitialReports = async () => {
    setLoadingReports(true);
    try {
      const normalizedLocation = location.trim().toLowerCase(); // Normalize location
      console.log(
        `Fetching initial reports for location: "${normalizedLocation}" with sortOrder: "${sortOrder}"`
      );

      const scamReportsRef = collection(db, "scamReports");
      const q = query(
        scamReportsRef,
        where("location", "==", normalizedLocation),
        orderBy("timestamp", sortOrder === "desc" ? "desc" : "asc"),
        limit(10)
      );

      console.log("Constructed Initial Query:", q);

      const querySnapshot = await getDocs(q);
      const reportsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(`Fetched initial reports count: ${reportsList.length}`);
      reportsList.forEach((report, index) => {
        console.log(`Report ${index + 1}:`, report);
        console.log(
          `Report ${index + 1} Timestamp:`,
          report.timestamp.toDate().toISOString()
        );
      });

      if (reportsList.length > 0) {
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisibleReport(lastVisible);

        setReports(reportsList);
      } else {
        console.log("No reports to fetch.");
      }
    } catch (error) {
      console.error("Error fetching initial scam reports:", error.message);
      console.error(
        "Ensure Firestore has the correct composite index for this query."
      );
    } finally {
      setLoadingReports(false);
    }
  };

  // Fetch more reports for pagination
  const fetchMoreReports = async () => {
    if (!lastVisibleReport) return; // No more reports to load

    setLoadingReports(true);
    try {
      const normalizedLocation = location.trim().toLowerCase(); // Normalize location
      console.log(
        `Fetching more reports for location: "${normalizedLocation}" with sortOrder: "${sortOrder}"`
      );

      const scamReportsRef = collection(db, "scamReports");
      const q = query(
        scamReportsRef,
        where("location", "==", normalizedLocation),
        orderBy("timestamp", sortOrder === "desc" ? "desc" : "asc"),
        startAfter(lastVisibleReport),
        limit(10)
      );

      console.log("Constructed Pagination Query:", q);

      const querySnapshot = await getDocs(q);
      const reportsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(`Fetched more reports count: ${reportsList.length}`);
      reportsList.forEach((report, index) => {
        console.log(`Loaded Report ${index + 1}:`, report);
        console.log(
          `Loaded Report ${index + 1} Timestamp:`,
          report.timestamp.toDate().toISOString()
        );
      });

      if (reportsList.length > 0) {
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisibleReport(lastVisible);

        setReports((prev) => [...prev, ...reportsList]);
      } else {
        console.log("No more reports to load.");
      }
    } catch (error) {
      console.error("Error fetching more scam reports:", error.message);
      console.error(
        "Ensure Firestore has the correct composite index for this query."
      );
    } finally {
      setLoadingReports(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedScam) {
      setErrorMessage("Please select a scam type.");
      return;
    }

    if (!location.trim()) {
      setErrorMessage("Please enter a location.");
      return;
    }

    try {
      const lowerCaseLocation = location.trim().toLowerCase(); // Normalize location
      const scamReportsRef = collection(db, "scamReports");

      // Optional: Use server timestamp for consistency
      await addDoc(scamReportsRef, {
        scamType: selectedScam,
        location: lowerCaseLocation, // Save location in lowercase
        comments: comments.trim() || "",
        timestamp: Timestamp.fromDate(new Date()), // Alternatively, use serverTimestamp()
      });

      setSuccessMessage("Scam report submitted successfully!");
      setErrorMessage("");
      setSelectedScam("");
      setLocation(itinerary?.destination.name || "");
      setComments("");

      // Refresh the reports list
      setReports([]); // Clear existing reports
      setLastVisibleReport(null); // Reset pagination
      fetchInitialReports(); // Fetch new reports based on updated sort order
    } catch (error) {
      console.error("Error adding document:", error.message);
      setErrorMessage("Failed to submit scam report. Please try again.");
      setSuccessMessage("");
    }
  };

  // Fetch reports when location or sortOrder changes
  useEffect(() => {
    if (location.trim()) {
      setReports([]); // Clear existing reports
      setLastVisibleReport(null); // Reset pagination
      fetchInitialReports(); // Fetch initial reports
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, sortOrder]);

  return (
    <section className="scam-section card">
      <h2>Report a Scam</h2>
      <form onSubmit={handleSubmit} className="scam-form">
        {/* Dropdown Menu for Scam Types */}
        <div className="form-group">
          <label htmlFor="scamType">Scam Type:</label>
          <select
            id="scamType"
            value={selectedScam}
            onChange={(e) => setSelectedScam(e.target.value)}
            required
          >
            <option value="">-- Select a Scam --</option>
            {scamTypes.map((scam) => (
              <option key={scam} value={scam}>
                {scam}
              </option>
            ))}
          </select>
        </div>

        {/* Location Input */}
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Dallas"
            required
          />
        </div>

        {/* Comments Box */}
        <div className="form-group">
          <label htmlFor="comments">Additional Details (Optional):</label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Describe the scam in more detail..."
            rows="4"
            maxLength={250}
          ></textarea>
          <p>{250 - comments.length} characters left</p>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          Submit Report
        </button>

        {/* Success & Error Messages */}
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>

      {/* Display Existing Scam Reports */}
      <div className="existing-reports">
        <h3>Existing Scam Reports in {capitalizeWords(location)}</h3>

        {/* Sorting Options */}
        <div className="sorting-options">
          <label htmlFor="sortOrder">Sort by:</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {loadingReports ? (
          <p>Loading reports...</p>
        ) : reports.length > 0 ? (
          <>
            <div className="reports-grid">
              {reports.map((report) => {
                console.log(
                  "Report location:",
                  report.location,
                  typeof report.location
                );
                return (
                  <div key={report.id} className="report-card">
                    <div className="report-header">
                      {getScamIcon(report.scamType)}
                      <h4>{report.scamType}</h4>
                    </div>
                    <p className="report-location">
                      <strong>Location:</strong>{" "}
                      {capitalizeWords(report.location)}
                    </p>
                    <p className="report-comments">
                      <strong>Details:</strong>{" "}
                      {report.comments || "No additional details."}
                    </p>
                    <p className="report-timestamp">
                      <strong>Reported on:</strong>{" "}
                      {report.timestamp
                        ? report.timestamp.toDate().toLocaleString()
                        : "Unknown"}
                    </p>
                  </div>
                );
              })}
            </div>
            {/* Load More Button */}
            {reports.length >= 10 && (
              <button onClick={fetchMoreReports} className="load-more-button">
                Load More
              </button>
            )}
          </>
        ) : (
          <p>No scam reports available for this location.</p>
        )}
      </div>
    </section>
  );
}

export default ScamReport;
