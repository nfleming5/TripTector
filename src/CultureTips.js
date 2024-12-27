import axios from "axios";
import React, { useEffect, useState } from "react";

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

const languageMap = {
  English: "en",
  Spanish: "es",
  French: "fr",
  German: "de",
  Chinese: "zh",
  Japanese: "ja",
  Russian: "ru",
  Italian: "it",
  Portuguese: "pt",
  Arabic: "ar",
  Hindi: "hi",
  // Add more mappings as needed
};

// Function to map city to country using Nominatim API
const getCountryFromCity = async (cityName) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
        cityName
      )}&format=json&limit=1`
    );

    const data = await response.json();

    if (data && data.length > 0) {
      // The country is usually the last part after the last comma
      const displayName = data[0].display_name;
      const parts = displayName.split(", ");
      return parts[parts.length - 1];
    }

    throw new Error("Country not found for the given city.");
  } catch (error) {
    console.error("Error fetching country from city:", error);
    return null;
  }
};
const getLanguageCode = (countryData) => {
  if (!countryData.languages) return "en"; // Default to English if no languages found

  const languages = Object.values(countryData.languages);
  
  const nonEnglishLanguage = languages.find(lang => lang.toLowerCase() !== 'english');

  const languageName = nonEnglishLanguage || languages[0]; // Fallback to first language if all are English
  const langCode = languageMap[languageName] || "en"; // Default to English if not found

  console.log(`Detected language: ${languageName} (${langCode})`); // Debugging log
  return langCode;
};

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
    return phrases.map((item) => ({ ...item, translation: "N/A" }));
  }
};

export default function CultureTips({ itinerary }) {
  const [phrases, setPhrases] = useState([]);
  const [tippingEtiquette, setTippingEtiquette] = useState("");
  const [commonCustoms, setCommonCustoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!itinerary?.destination) return;
  
    const cacheKey = `culture_${itinerary.destination.toLowerCase()}`;
  
    const fetchCultureData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Check cache first
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          setPhrases(parsed.phrases);
          setTippingEtiquette(parsed.tippingEtiquette);
          setCommonCustoms(parsed.commonCustoms);
          setLoading(false);
          return;
        }
  
        // Step 1: Get country name from city
        const countryName = await getCountryFromCity(itinerary.destination);
        if (!countryName) {
          throw new Error("Could not determine the country from the city name.");
        }
  
        // Step 2: Fetch country data
        const countryData = await fetchCountryData(countryName);
        if (!countryData) {
          throw new Error("Country data not found.");
        }
  
        // Step 3: Get language code
        const langCode = getLanguageCode(countryData);
  
        // Step 4: Translate phrases
        const translated = await translatePhrases(basicPhrases, langCode);
        console.log("Translated Phrases:", translated); // Debugging log
  
        setPhrases(translated);
  
        // Step 5: Set tipping etiquette and customs
        const countryNameLower = countryData.name.common.toLowerCase();
  
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
          spain: {
            tippingEtiquette:
              "Tipping is appreciated but not obligatory. Leaving small change is common.",
            commonCustoms: [
              "Lunch is typically enjoyed between 1 PM and 3 PM.",
              "Siesta (afternoon break) is common in many regions.",
            ],
          },
          germany: {
            tippingEtiquette:
              "Rounding up the bill or leaving about 5-10% is customary.",
            commonCustoms: [
              "Punctuality is highly valued.",
              "Greetings typically involve a firm handshake.",
            ],
          },
          italy: {
            tippingEtiquette:
              "Tipping is not mandatory but appreciated. Leaving small change is common.",
            commonCustoms: [
              "Dress smartly, especially when dining out.",
              "It's common to greet with a handshake.",
            ],
          },
          canada: {
            tippingEtiquette:
              "Tipping between 15-20% in restaurants is standard.",
            commonCustoms: [
              "Politeness and friendliness are highly valued.",
              "Queuing is strictly followed.",
            ],
          },
          brazil: {
            tippingEtiquette:
              "Tipping is appreciated but not mandatory. Leaving around 10% is common.",
            commonCustoms: [
              "Greetings involve a handshake or a hug among acquaintances.",
              "It's common to be punctual in business settings.",
            ],
          },
          // Add more countries as needed
        };
  
        const cultureInfo = tippingData[countryNameLower] || {
          tippingEtiquette: "Tipping practices vary. Check local customs.",
          commonCustoms: ["Respect local traditions and practices."],
        };
  
        setTippingEtiquette(cultureInfo.tippingEtiquette);
        setCommonCustoms(cultureInfo.commonCustoms);
  
        // Cache the data
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            phrases: translated,
            tippingEtiquette: cultureInfo.tippingEtiquette,
            commonCustoms: cultureInfo.commonCustoms,
          })
        );
      } catch (err) {
        console.error("Error fetching culture data:", err);
        setError("Unable to load cultural information.");
      } finally {
        setLoading(false);
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
      <h2>Culture Tips for {itinerary.destination}</h2>
      <h3>Basic Phrases</h3>
      <ul>
        {phrases.map((item, index) => (
          <li key={index}>
            <strong>
              {item.translation !== "N/A" ? item.translation : item.phrase}
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