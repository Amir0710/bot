import React, { useEffect } from 'react';
import { isMobile } from 'react-device-detect';

// Detect if the app is running in the Telegram Web environment
const isTelegramWeb = () => {
  const isTelegramAppContext = typeof window.Telegram !== 'undefined' &&
                               window.Telegram.WebApp &&
                               window.Telegram.WebApp.initDataUnsafe;

  const isTelegramReferrer = document.referrer.includes("t.me") || 
                             document.referrer.includes("telegram.org");

  const isTelegramURL = window.location.href.includes("t.me") ||
                        window.location.href.includes("telegram.org");

  // Return true only if it's clearly in Telegram Web App context
  return isTelegramAppContext && (isTelegramReferrer || isTelegramURL);
};

const DeviceCheck = ({ children }) => {
  useEffect(() => {
    // Debugging output
    console.log("Is Mobile:", isMobile);
    console.log("Is Telegram Web:", isTelegramWeb());

    // Redirect if not Telegram Web or mobile
    if (!isMobile && !isTelegramWeb()) {
      window.location.replace('https://t.me/tracextapbot');
    }
  }, []);

  return <>{children}</>;
};

export default DeviceCheck;
