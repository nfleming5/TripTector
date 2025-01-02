// src/components/CultureTips.js
import axios from "axios";
import React, { useEffect, useState } from "react";
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
    tippingEtiquette:
      "Tipping is not customary and can be considered rude.",
    commonCustoms: [
      "Always remove shoes before entering someone's home.",
      "It is polite to bow when greeting.",
    ],
  },
  // ... include other countries as needed
  mexico: {
    tippingEtiquette:
      "Tipping is appreciated but not mandatory. Leaving around 10% is common.",
    commonCustoms: [
      "Greetings typically involve a handshake.",
      "It's common to greet with a kiss on the cheek among acquaintances.",
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
        const langCode = languageMap[countryCode] || "en"; // Default to English if not found

        if (langCode === "en" && countryCode !== "US" && countryCode !== "GB") {
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

  if (loading) {
    return <div>Loading cultural tips...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <section className="culture-section card">
      <h2>Culture Tips for {itinerary.destination.name}</h2>
      <h3>Basic Phrases</h3>
      <ul>
        {phrases.map((item, index) => (
          <li key={index}>
            <strong>
            {item.translation !== "Translation unavailable." ? item.translation : item.phrase}
            </strong>
            : {item.phrase}
          </li>
        ))}
      </ul>
      <h3>Tipping Etiquette</h3>
      <p>{tippingEtiquette}</p>
      <h3>Common Customs</h3>
      <ul>
        {commonCustoms.map((custom, index) => (
          <li key={index}>{custom}</li>
        ))}
      </ul>
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
  try {
    const translatedPhrases = await Promise.all(
      phrases.map(async (item) => {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
            item.phrase
          )}&langpair=en|${targetLangCode}`
        );

        const data = await response.json();
        console.log(
          `Translating "${item.phrase}" to ${targetLangCode}:`,
          data
        ); // Debugging log

        if (data.responseStatus !== 200) {
          throw new Error(data.responseDetails || "Translation failed.");
        }

        return {
          ...item,
          translation: data.responseData.translatedText,
        };
      })
    );
    return translatedPhrases;
  } catch (error) {
    console.error("Error translating phrases:", error);
    // Return original phrases with 'N/A' translation
    return phrases.map((item) => ({
      ...item,
      translation: "Translation unavailable.",
    }));
  }
};