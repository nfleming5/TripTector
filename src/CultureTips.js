// src/components/CultureTips.js
import axios from "axios";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa"; // Import Play and Pause icons from React Icons
import "./CultureTips.css"; // Import CSS for styling
import languageMap from "./LanguageMap";

// Basic phrases to be translated
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

// Tipping and customs data
const tippingData = {
  france: {
    tippingEtiquette:
      "Tipping is appreciated but not mandatory. Usually, rounding up the bill is sufficient.",
    commonCustoms: [
      "Greetings often involve a handshake or cheek kisses.",
      "It's customary to greet shopkeepers when entering and leaving.",
    ],
  },
  japan: {
    tippingEtiquette: "Tipping is not customary and can be considered rude.",
    commonCustoms: [
      "Always remove shoes before entering someone's home.",
      "It is polite to bow when greeting.",
    ],
  },
  mexico: {
    tippingEtiquette:
      "Tipping is appreciated but not mandatory. Leaving around 10% is common.",
    commonCustoms: [
      "Greetings typically involve a handshake.",
      "It's common to greet with a kiss on the cheek among acquaintances.",
    ],
  },
  unitedStates: {
    // Updated property name to camelCase
    tippingEtiquette:
      "Tipping is customary in the United States. Generally, leave 15-20% of the bill in restaurants.",
    commonCustoms: [
      "Greetings typically involve a handshake.",
      "Punctuality is appreciated in professional settings.",
    ],
  },
  // Add more countries as needed
};

export default function CultureTips({ itinerary }) {
  const [phrases, setPhrases] = useState([]);
  const [tippingEtiquette, setTippingEtiquette] = useState("");
  const [commonCustoms, setCommonCustoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [speakingIndex, setSpeakingIndex] = useState(null); // Track which phrase is being spoken
  const [availableVoices, setAvailableVoices] = useState([]); // Store available voices

  useEffect(() => {
    if (
      !itinerary?.destination?.name ||
      !itinerary?.destination?.country ||
      !itinerary?.destination?.countryCode
    )
      return;

    const cacheKey = `culture_${itinerary.destination.name
      .toLowerCase()
      .replace(/\s+/g, "_")}_${itinerary.destination.country
      .toLowerCase()
      .replace(/\s+/g, "_")}`;

    const fetchCultureData = async () => {
      console.log("Fetching cultural data...");
      setLoading(true);
      setError(null);
      try {
        // Check cache first
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          console.log("Cultural data found in cache.");
          const parsed = JSON.parse(cached);
          setPhrases(parsed.phrases);
          setTippingEtiquette(parsed.tippingEtiquette);
          setCommonCustoms(parsed.commonCustoms);
          setLoading(false);
          return;
        }

        // Use the passed country name directly
        const countryName = itinerary.destination.country;
        console.log(`Using country name from itinerary: ${countryName}`);

        // Fetch country data
        const countryData = await fetchCountryData(countryName);
        if (!countryData) {
          throw new Error("Country data not found.");
        }
        console.log("Country data fetched successfully:", countryData);

        // Get language code from languageMap using countryCode
        const countryCode = countryData.cca2; // ISO 3166-1 alpha-2
        const langCode = languageMap[countryCode] || "en-US"; // Default to English (US) if not found

        if (
          langCode.startsWith("en") &&
          countryCode !== "US" &&
          countryCode !== "GB"
        ) {
          console.warn(
            `Defaulting to English for country code: ${countryCode}. Consider adding it to languageMap if a different primary language is desired.`
          );
        }

        console.log(`Detected language code: ${langCode}`); // Debugging log

        // Translate phrases
        const translated = await translatePhrases(basicPhrases, langCode);
        console.log("Translated Phrases:", translated); // Debugging log

        setPhrases(translated);

        // Set tipping etiquette and customs
        const countryNameLower = countryName.toLowerCase();

        const cultureInfo = tippingData[countryNameLower] || {
          tippingEtiquette: "Tipping practices vary. Check local customs.",
          commonCustoms: ["Respect local traditions and practices."],
        };

        setTippingEtiquette(cultureInfo.tippingEtiquette);
        setCommonCustoms(cultureInfo.commonCustoms);

        console.log("Cultural information set successfully.");

        // Cache the data
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            phrases: translated,
            tippingEtiquette: cultureInfo.tippingEtiquette,
            commonCustoms: cultureInfo.commonCustoms,
          })
        );
        console.log("Cultural data cached successfully.");
      } catch (err) {
        console.error("Error fetching culture data:", err);
        setError("Unable to load cultural information.");
      } finally {
        setLoading(false);
        console.log("Loading state set to false.");
      }
    };

    fetchCultureData();
  }, [itinerary]);

  // Load available voices once when component mounts
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log("Available Voices:", voices); // Log available voices
      setAvailableVoices(voices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  if (loading) {
    return <div>Loading cultural tips...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Function to handle speech synthesis
  const speak = (text, langCode, index) => {
    if (!("speechSynthesis" in window)) {
      alert("Sorry, your browser does not support speech synthesis.");
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    setSpeakingIndex(index); // Indicate which phrase is being spoken

    // Find the exact match for langCode
    let voice = availableVoices.find((v) => v.lang === langCode);

    // If exact match not found, find any voice that starts with the language code (e.g., 'fr' from 'fr-FR')
    if (!voice) {
      const languagePrefix = langCode.split("-")[0];
      voice = availableVoices.find((v) => v.lang.startsWith(languagePrefix));
    }

    // If still not found, use the first available voice as a last resort
    if (!voice) {
      voice = availableVoices[0];
      console.warn(
        `No exact or prefix match found for langCode "${langCode}". Using default voice: "${voice.name}" (${voice.lang})`
      );
    }

    // Check if the selected voice matches the target language
    if (!voice.lang.startsWith(langCode.split("-")[0])) {
      console.warn(
        `Selected voice "${voice.name}" does not match the target language "${langCode}".`
      );
      // Optionally, notify the user
      // alert("The selected voice may not accurately pronounce the translation.");
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = langCode;

    // When speaking ends, reset the speakingIndex
    utterance.onend = () => {
      setSpeakingIndex(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <section className="culture-section card">
      <h2>Culture Tips for {itinerary.destination.name}</h2>
      {/* WRAP two columns in a .culture-grid container */}
      <div className="culture-grid">
        {/* LEFT COLUMN: scrollable phrases */}
        <div className="phrases-column">
          <h3>Basic Phrases</h3>
          <ul className="phrases-list">
            {phrases.map((item, index) => (
              <li key={index} className="phrase-item">
                {/* LEFT SIDE: Play button + translated phrase */}
                <div className="phrase-left">
                  <button
                    onClick={() =>
                      speak(
                        item.translation,
                        languageMap[itinerary.destination.countryCode] ||
                          "en-US",
                        index
                      )
                    }
                    className={`play-button ${
                      speakingIndex === index ? "active" : ""
                    }`}
                    aria-label={`Play pronunciation for ${item.translation}`}
                  >
                    {speakingIndex === index ? <FaPause /> : <FaPlay />}
                  </button>

                  <strong className="translated-phrase">
                    {item.translation !== "Translation unavailable."
                      ? item.translation
                      : item.phrase}
                  </strong>
                </div>

                {/* RIGHT SIDE: Original phrase (English) */}
                <div className="phrase-right">{item.phrase}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT COLUMN: Tipping & Customs */}
        <div className="etiquette-column">
          <h3>Tipping Etiquette</h3>
          <p>{tippingEtiquette}</p>

          <h3>Common Customs</h3>
          <ul>
            {commonCustoms.map((custom, index) => (
              <li key={index}>{custom}</li>
            ))}
          </ul>
        </div>
      </div>{" "}
      {/* end .culture-grid */}
    </section>
  );
}

// Helper functions

// Function to fetch country data using Rest Countries API
const fetchCountryData = async (countryName) => {
  try {
    const response = await axios.get(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(
        countryName
      )}?fullText=true`
    );
    return response.data[0];
  } catch (error) {
    console.error("Error fetching country data:", error);
    return null;
  }
};

// Function to translate phrases using MyMemory Translated API
const translatePhrases = async (phrases, targetLangCode) => {
  const lang = targetLangCode.split("-")[0];

  // Skip translation if target is English
  if (lang === "en") {
    return phrases.map((item) => ({ ...item, translation: item.phrase }));
  }

  try {
    // Use Promise.all to translate each phrase individually
    const translatedResults = await Promise.all(
      phrases.map(async (phraseObj) => {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          phraseObj.phrase
        )}&langpair=en|${lang}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.responseStatus === 200 && data.responseData?.translatedText) {
          return {
            ...phraseObj,
            translation: data.responseData.translatedText,
          };
        } else {
          console.error(
            "Translation error for phrase:",
            phraseObj.phrase,
            data.responseDetails
          );
          return {
            ...phraseObj,
            translation: "Translation unavailable.",
          };
        }
      })
    );

    return translatedResults;
  } catch (error) {
    console.error("Error translating phrases:", error);
    return phrases.map((item) => ({
      ...item,
      translation: "Translation unavailable.",
    }));
  }
};

// Define PropTypes for type checking
CultureTips.propTypes = {
  itinerary: PropTypes.shape({
    destination: PropTypes.shape({
      name: PropTypes.string.isRequired,
      state: PropTypes.string,
      country: PropTypes.string.isRequired,
      countryCode: PropTypes.string,
    }).isRequired,
    departureDate: PropTypes.string,
    returnDate: PropTypes.string,
    departureAirport: PropTypes.string,
  }).isRequired,
};
