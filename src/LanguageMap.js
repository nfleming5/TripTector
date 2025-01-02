// languageMap.js
const languageMap = {
    // Africa
    AF: "ps", // Pashto
    AL: "sq", // Albanian
    DZ: "ar", // Arabic
    AO: "pt", // Portuguese
    BJ: "fr", // French
    BW: "en", // English (also Tswana)
    BF: "fr", // French
    BI: "fr", // French (also Kirundi)
    CM: "en", // English (also French)
    CV: "pt", // Portuguese
    CF: "fr", // French (also Sango)
    TD: "fr", // French (also Arabic)
    KM: "ar", // Arabic (also French, Swahili)
    CG: "fr", // French (also Lingala)
    CD: "fr", // French (also Lingala, Swahili)
    DJ: "fr", // French (also Arabic)
    EG: "ar", // Arabic
    GQ: "es", // Spanish (also French, Portuguese)
    ER: "ti", // Tigrinya
    ET: "am", // Amharic
    GA: "fr", // French
    GM: "en", // English
    GN: "fr", // French (also Pular)
    GW: "pt", // Portuguese
    KE: "sw", // Swahili
    LS: "st", // Sesotho
    LR: "en", // English
    LY: "ar", // Arabic
    MG: "fr", // French (also Malagasy)
    MW: "en", // English (also Chichewa)
    ML: "fr", // French
    MR: "ar", // Arabic
    MU: "en", // English (also French, Bhojpuri)
    YT: "fr", // French
  
    // Asia
    AS: "en", // English (also Samoan)
    AZ: "az", // Azerbaijani
    BH: "ar", // Arabic
    BD: "bn", // Bengali
    BN: "ms", // Malay
    BT: "dz", // Dzongkha
    KH: "km", // Khmer
    CN: "zh", // Chinese
    CY: "el", // Greek
    GE: "ka", // Georgian
    IN: "hi", // Hindi (also English)
    ID: "id", // Indonesian
    IR: "fa", // Persian
    IQ: "ar", // Arabic
    IL: "he", // Hebrew
    JP: "ja", // Japanese
    JO: "ar", // Arabic
    KZ: "kk", // Kazakh
    KW: "ar", // Arabic
    KG: "ky", // Kyrgyz
    LA: "lo", // Lao
    LB: "ar", // Arabic
    MY: "ms", // Malay
    MV: "dv", // Divehi
    MN: "mn", // Mongolian
    MM: "my", // Burmese
    NP: "ne", // Nepali
    OM: "ar", // Arabic
    PK: "ur", // Urdu
    PS: "ar", // Arabic
    QA: "ar", // Arabic
    SA: "ar", // Arabic
    SG: "en", // English (also Malay, Tamil, Chinese)
    LK: "si", // Sinhala
    SY: "ar", // Arabic
    TW: "zh", // Chinese
    TJ: "tg", // Tajik
    TH: "th", // Thai
    TL: "pt", // Portuguese
    TM: "tk", // Turkmen
    VN: "vi", // Vietnamese
    YE: "ar", // Arabic
  
    // Europe
    AD: "ca", // Catalan
    AL: "sq", // Albanian
    AT: "de", // German
    BY: "be", // Belarusian (also Russian)
    BE: "nl", // Dutch (also French, German)
    BA: "bs", // Bosnian (also Croatian, Serbian)
    BG: "bg", // Bulgarian
    HR: "hr", // Croatian
    CY: "el", // Greek (also Turkish)
    CZ: "cs", // Czech
    DK: "da", // Danish
    EE: "et", // Estonian
    FI: "fi", // Finnish (also Swedish)
    FR: "fr", // French
    DE: "de", // German
    GR: "el", // Greek
    HU: "hu", // Hungarian
    IS: "is", // Icelandic
    IE: "en", // English (also Irish)
    IT: "it", // Italian
    LV: "lv", // Latvian
    LI: "de", // German
    LT: "lt", // Lithuanian
    LU: "fr", // French (also German, Luxembourgish)
    MT: "mt", // Maltese
    MD: "ro", // Romanian
    MC: "fr", // French
    ME: "sr", // Serbian
    NL: "nl", // Dutch
    NO: "no", // Norwegian
    PL: "pl", // Polish
    PT: "pt", // Portuguese
    RO: "ro", // Romanian
    RU: "ru", // Russian
    SM: "it", // Italian
    RS: "sr", // Serbian
    SK: "sk", // Slovak
    SI: "sl", // Slovenian
    ES: "es", // Spanish
    SE: "sv", // Swedish
    CH: "de", // German (also French, Italian, Romansh)
    UA: "uk", // Ukrainian
    GB: "en", // English
    VA: "it", // Italian
  
    // North America
    AG: "en", // English
    BS: "en", // English
    BB: "en", // English
    BZ: "en", // English
    CA: "en", // English (also French)
    CR: "es", // Spanish
    CU: "es", // Spanish
    DM: "en", // English
    DO: "es", // Spanish
    GT: "es", // Spanish
    HT: "ht", // Haitian Creole (also French)
    HN: "es", // Spanish
    JM: "en", // English
    MX: "es", // Spanish
    NI: "es", // Spanish
    PA: "es", // Spanish
    PR: "es", // Spanish (also English)
    KN: "en", // English
    LC: "en", // English
    VC: "en", // English
    TT: "en", // English
    US: "en", // English
  
    // Oceania
    AS: "en", // English
    AU: "en", // English
    FJ: "en", // English (also Fijian)
    KI: "en", // English (also Gilbertese)
    MH: "en", // English
    FM: "en", // English
    NR: "en", // English (also Nauruan)
    NZ: "en", // English (also Maori)
    PW: "en", // English
    PG: "en", // English (also Hiri Motu, Tok Pisin)
    WS: "sm", // Samoan
    TO: "to", // Tongan
    TV: "en", // English (also Tuvaluan)
    UM: "en", // English
    VU: "bi", // Bislama (also English, French)
    WF: "fr", // French
  
    // South America
    AR: "es", // Spanish
    BO: "es", // Spanish (also Quechua, Aymara)
    BR: "pt", // Portuguese
    CL: "es", // Spanish
    CO: "es", // Spanish
    EC: "es", // Spanish
    GY: "en", // English
    PY: "es", // Spanish (also Guarani)
    PE: "es", // Spanish (also Quechua, Aymara)
    SR: "nl", // Dutch
    UY: "es", // Spanish (also Guarani)
    VE: "es", // Spanish
  
    // Middle East
    AE: "ar", // Arabic
    IL: "he", // Hebrew
    JO: "ar", // Arabic
    KW: "ar", // Arabic
    LB: "ar", // Arabic
    OM: "ar", // Arabic
    PS: "ar", // Arabic
    QA: "ar", // Arabic
    SA: "ar", // Arabic
    SY: "ar", // Arabic
    YE: "ar", // Arabic
  
    // Central America and Caribbean
    DM: "en", // English
    DO: "es", // Spanish
    GD: "en", // English
    GP: "fr", // French
    HT: "ht", // Haitian Creole (also French)
    JM: "en", // English
    KN: "en", // English
    LC: "en", // English
    VC: "en", // English
    TT: "en", // English
    TC: "en", // English
    VG: "en", // English
    VI: "en", // English
    MQ: "fr", // French
    MF: "fr", // French
  
    // Miscellaneous and Territories
    CX: "en", // English
    CC: "en", // English
    FK: "en", // English
    FO: "fo", // Faroese
    GS: "en", // English
    HM: "en", // English
    NF: "en", // English
    PN: "en", // English
    TK: "tkl", // Tokelauan
    NU: "niu", // Niuean
    WF: "fr", // French
    YT: "fr", // French
  };
  
  // Export the languageMap for use in other components
  export default languageMap;