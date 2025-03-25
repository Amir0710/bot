import { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en", // ✅ Default Language: English
          includedLanguages: "zh-CN,ru,ms,id,en", // ✅ Chinese, Russian, Malaysian, Indonesian, English
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false, // ✅ Prevents auto-popup issues
        },
        "google_translate_element"
      );
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
      }}
    >
      <div
        id="google_translate_element"
        style={{
          display: "inline-block",
          width: "100%",
          maxWidth: "200px", // ✅ Adjusted for Telegram Mobile UI
          minHeight: "35px",
          overflow: "hidden",
          borderRadius: "5px",
          background: "#f1f1f1",
          padding: "5px",
          textAlign: "center",
        }}
      ></div>
    </div>
  );
};

export default GoogleTranslate;
