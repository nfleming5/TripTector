import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import "./CultureTips.css";
import languageMap from "./LanguageMap";

const basicPhrases = [
  { phrase: "Hello" },
  { phrase: "Goodbye" },
  { phrase: "Please" },
  { phrase: "Thank you" },
  { phrase: "Yes" },
  { phrase: "No" },
  { phrase: "Excuse me" },
  { phrase: "I'm sorry" },
  { phrase: "Do you speak English?" },
  { phrase: "I don't understand" },
  { phrase: "How much does this cost?" },
  { phrase: "Where is the bathroom?" },
  { phrase: "Help!" },
  { phrase: "I need a doctor" },
  { phrase: "Call the police" },
  { phrase: "Can you help me?" },
  { phrase: "I would like..." },
  { phrase: "Where is...?" },
  { phrase: "What is your name?" },
  { phrase: "My name is..." },
];

async function translatePhrases(phrases, targetLangCode) {
  const lang = targetLangCode.split("-")[0];
  if (lang === "en") {
    return phrases.map((item) => ({ ...item, translation: item.phrase }));
  }
  try {
    const results = await Promise.all(
      phrases.map(async (item) => {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          item.phrase
        )}&langpair=en|${lang}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.responseStatus === 200 && data.responseData?.translatedText) {
          return { ...item, translation: data.responseData.translatedText };
        } else {
          return { ...item, translation: "Translation unavailable." };
        }
      })
    );
    return results;
  } catch (error) {
    console.error("Error translating phrases:", error);
    return phrases.map((item) => ({
      ...item,
      translation: "Translation unavailable.",
    }));
  }
}

export default function CultureTips({ itinerary }) {
  const [phrases, setPhrases] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("date");
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);

  // Fetch translations
  const fetchTranslations = useCallback(async () => {
    try {
      const countryCode = itinerary?.destination?.countryCode || "US";
      const langCode = languageMap[countryCode] || "en-US";
      const newPhrases = await translatePhrases(basicPhrases, langCode);
      setPhrases(newPhrases);
    } catch (err) {
      console.error("Error fetching translations:", err);
      setError("Unable to load translations.");
    }
  }, [itinerary]);

  // Fetch local events
  const fetchLocalEvents = useCallback(async () => {
    if (!itinerary?.destination?.name || !itinerary.departureDate || !itinerary.returnDate) {
      setEvents([]);
      return;
    }

    try {
      const city = encodeURIComponent(itinerary.destination.name.trim());
      const startDateTime = new Date(itinerary.departureDate).toISOString().slice(0, 19) + "Z";
      const endDateTime = new Date(itinerary.returnDate).toISOString().slice(0, 19) + "Z";

      const TM_API_KEY = process.env.REACT_APP_CONSUMER_KEY;
      const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TM_API_KEY}&city=${city}&startDateTime=${startDateTime}&endDateTime=${endDateTime}`;

      const response = await axios.get(url);
      setEvents(response.data._embedded?.events || []);
    } catch (err) {
      console.error("Ticketmaster error:", err);
      setError("Unable to load events.");
      setEvents([]);
    }
  }, [itinerary]);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      if (!itinerary?.destination?.name) {
        setLoading(false);
        return;
      }

      try {
        await Promise.all([fetchTranslations(), fetchLocalEvents()]);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Unable to load content.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [itinerary, fetchTranslations, fetchLocalEvents]);

  // Load voices
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel(); // Cleanup any ongoing speech
    };
  }, []);

  // Speech function
  const speak = useCallback((text, langCode, index) => {
    if (!("speechSynthesis" in window)) {
      alert("Sorry, your browser does not support speech synthesis.");
      return;
    }

    window.speechSynthesis.cancel();
    setSpeakingIndex(index);

    const voice = availableVoices.find((v) => v.lang === langCode) ||
      availableVoices.find((v) => v.lang.startsWith(langCode.split("-")[0])) ||
      availableVoices[0];

    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => {
      setSpeakingIndex(null);
      console.error("Speech synthesis error");
    };

    window.speechSynthesis.speak(utterance);
  }, [availableVoices]);

  // Sort events
  const sortedEvents = React.useMemo(() => {
    if (!events.length) return [];

    return [...events].sort((a, b) => {
      if (sortOption === "alpha") {
        return a.name.localeCompare(b.name);
      }
      return (a.dates?.start?.localDate || "").localeCompare(b.dates?.start?.localDate || "");
    });
  }, [events, sortOption]);

  if (loading) {
    return <div className="loading">Loading cultural tips & events...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <section className="culture-section card">
      <h2>Culture Tips &amp; Local Events for {itinerary.destination.name}</h2>

      <div className="culture-grid">
        {/* Basic Phrases Column */}
        <div className="phrases-column">
          <h3>Basic Phrases</h3>

          {/* Hidden Sort Container for Alignment */}
          <div className="sort-container hidden">
            <label htmlFor="dummy-sort-select" style={{ display: 'none' }}>Sort By:</label>
            <select id="dummy-sort-select" disabled style={{ display: 'none' }}>
              <option value="none">None</option>
            </select>
          </div>

          <div className="scroll-container">
            <ul className="phrases-list">
              {phrases.map((item, idx) => (
                <li key={idx} className="phrase-item">
                  <div className="phrase-left">
                    <button
                      onClick={() => speak(item.translation, itinerary?.destination?.countryCode || "en-US", idx)}
                      className={`play-button ${speakingIndex === idx ? "active" : ""}`}
                      aria-label={speakingIndex === idx ? "Pause pronunciation" : "Play pronunciation"}
                    >
                      {speakingIndex === idx ? <FaPause /> : <FaPlay />}
                    </button>
                    <strong className="translated-phrase">
                      {item.translation}
                    </strong>
                  </div>
                  <div className="phrase-right">{item.phrase}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Local Events Column */}
        <div className="events-column">
          <h3>Local Events</h3>
          <div className="sort-container">
            <div className="custom-select-container">
              <select
                id="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="custom-select"
                required
                aria-label="Sort Events"
              >
                <option value="" disabled hidden>
                  {/* Placeholder prompt */}
                </option>
                <option value="date">Date</option>
                <option value="alpha">Alphabetical</option>
                {/* Add more options as needed */}
              </select>
              <label htmlFor="sort-select" className="custom-label">Sort by</label>
            </div>
          </div>
          <div className="scroll-container">
            {sortedEvents.length === 0 ? (
              <p>No events found in {itinerary.destination.name} for these dates.</p>
            ) : (
              <ul className="events-list">
                {sortedEvents.map((evt) => (
                  <li key={evt.id} className="phrase-item">
                    <div className="phrase-left">
                      {/* Placeholder for Play Button */}
                      <button
                        className="play-button placeholder"
                        disabled
                        aria-hidden="true"
                      >
                        {/* Empty content */}
                      </button>
                      <strong className="translated-phrase">
                        {evt.url ? (
                          <a
                            href={evt.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${evt.name} event details in new tab`}
                          >
                            {evt.name}
                          </a>
                        ) : (
                          evt.name
                        )}
                      </strong>
                    </div>
                    <div className="phrase-right">
                      <span>
                        {evt.dates?.start?.localDate || "Unknown date"}
                        {evt._embedded?.venues?.[0]?.name && ` @ ${evt._embedded.venues[0]?.name}`}
                      </span>
                      {evt.priceRanges?.[0] && (
                        <span className="event-price">
                          Price: ${evt.priceRanges[0].min} - ${evt.priceRanges[0].max} {evt.priceRanges[0].currency}
                        </span>
                      )}
                      {evt.info && (
                        <span className="event-info">
                          {evt.info.length > 100 ? `${evt.info.slice(0, 100)}...` : evt.info}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}