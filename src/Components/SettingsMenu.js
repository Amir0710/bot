import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Exchanges from "./Exchanges";
import { RiTranslate2 } from "react-icons/ri";
import { FaExchangeAlt } from "react-icons/fa";

const SettingsMenu = ({ showSetting, setShowSetting }) => {
  const [showExchange, setShowExchange] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false); // Track if user clicks "Language"

  useEffect(() => {
    const handleBackButtonClick = () => {
      setShowSetting(false);
    };

    if (showSetting) {
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(handleBackButtonClick);
    } else {
      window.Telegram.WebApp.BackButton.hide();
      window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
    }

    return () => {
      window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
    };
  }, [showSetting, setShowSetting]);

  // Load Google Translate script on demand
  const handleLanguageClick = () => {
    setShowLanguage(!showLanguage);

    if (!window.google || !window.google.translate) {
      const script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "zh-CN,ru,ms,id,fa,en", // ✅ Added Farsi (fa)
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      };
    }
  };

  return (
    <>
      {showSetting && (
        <div className="fixed left-0 right-0 z-20 top-[-12px] bottom-0 flex justify-center taskbg px-[16px] h-full">
          <div id="refer" className="w-full flex flex-col">
            <div className="w-full flex pt-6 flex-col space-y-6 overflow-y-auto pb-[100px] scroller">
              <div className="flex items-center space-x-4">
                <div className="w-full">
                  <h1 className="font-semibold text-[24px] text-center pb-4">
                    Settings
                  </h1>

                  <div className="w-full flex flex-col pb-[100px]">
                    {/* 🔥 Language Selector (Now Opens Dropdown on Click) */}
                    <div className="flex w-full flex-col space-y-2">
                      <button
                        onClick={handleLanguageClick} // 👈 Click to show language options
                        className="text-[15px] text-[#d2d2d2] bg-cards3 hover:bg-cards ease-in duration-200 h-[60px] rounded-[14px] px-4 flex justify-between items-center"
                      >
                        <div className="flex items-center space-x-2 justify-start w-[80%]">
                          <span>
                            <RiTranslate2 size={20} />
                          </span>
                          <div className="flex flex-col text-left">
                            <h2 className="flex flex-1 font-medium text-[13px]">
                              Language
                            </h2>
                          </div>
                        </div>
                        <MdOutlineKeyboardArrowRight
                          size={24}
                          className="text-[#959595]"
                        />
                      </button>

                      {/* 🎯 Show the Google Translate Dropdown */}
                      {showLanguage && (
                        <div className="mt-2 p-3 bg-cards3 rounded-md">
                          <div id="google_translate_element"></div>
                        </div>
                      )}
                    </div>

                    {/* 🔄 Choose Exchange Button */}
                    <div className="flex w-full flex-col space-y-2 mt-4">
                      <button
                        onClick={() => setShowExchange(true)}
                        className="text-[15px] text-[#d2d2d2] bg-cards3 hover:bg-cards ease-in duration-200 h-[60px] rounded-[14px] px-4 flex justify-between items-center"
                      >
                        <div className="flex items-center space-x-2 justify-start w-[80%]">
                          <span>
                            <FaExchangeAlt size={20} />
                          </span>
                          <div className="flex flex-col text-left">
                            <h2 className="flex flex-1 font-medium text-[13px]">
                              Choose Exchange
                            </h2>
                          </div>
                        </div>
                        <MdOutlineKeyboardArrowRight
                          size={24}
                          className="text-[#959595]"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Exchanges showExchange={showExchange} setShowExchange={setShowExchange} />
    </>
  );
};

export default SettingsMenu;
