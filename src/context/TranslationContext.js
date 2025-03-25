import React, { createContext, useContext, useState, useEffect } from "react";
import { translateText } from "../translate";

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const tg = window.Telegram?.WebApp;
  const userLang = tg?.initDataUnsafe?.user?.language_code || "en";
  const isFarsi = userLang === "fa"; // Check if language is Farsi (Persian)

  const [translations, setTranslations] = useState({});

  const translate = async (text) => {
    if (userLang === "en") return text; // No translation needed for English
    if (translations[text]) return translations[text]; // Use cached translation

    const translatedText = await translateText(text, userLang);
    setTranslations((prev) => ({ ...prev, [text]: translatedText }));
    return translatedText;
  };

  return (
    <TranslationContext.Provider value={{ translate, isFarsi }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
