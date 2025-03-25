import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { PiSpinnerBallDuotone } from "react-icons/pi";
import { PiHandTapFill } from "react-icons/pi";
import { IoWalletSharp } from "react-icons/io5";
import { useUser } from "../context/userContext";
import { GoChecklist } from "react-icons/go";
import { PiShovelFill } from "react-icons/pi";
import { GiSharpAxe } from "react-icons/gi";
import { LuListTodo } from "react-icons/lu";
import { IoWalletOutline } from "react-icons/io5";
import { GiMining } from "react-icons/gi";
import { IoGiftOutline } from "react-icons/io5";
import ReferralRewards from "../pages/Rewards";
import SlotMachine from "../Components/Slot";
import MilestoneRewards from "../Components/MilestoneRewards";
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { IoDiamondSharp } from "react-icons/io5";



const friendsRewards = [
  { title: 'Invite 1 friend', referralsRequired: 1, bonusAward: 50000 },
  { title: 'Invite 5 friends', referralsRequired: 5, bonusAward: 150000 },
  { title: 'Invite 10 friends', referralsRequired: 10, bonusAward: 250000 },
  { title: 'Invite 25 friends', referralsRequired: 25, bonusAward: 500000 },
  { title: 'Invite 50 friends', referralsRequired: 50, bonusAward: 1000000 },
  { title: 'Invite 100 friends', referralsRequired: 100, bonusAward: 2000000 },
];

const milestones = [
  { id: 1, name: 'Elite', icon: '/elite.webp', tapBalanceRequired: 1000, reward: 50000 },
  { id: 2, name: 'Master', icon: '/masterr.webp', tapBalanceRequired: 50000, reward: 100000 },
  { id: 3, name: 'Grandmaster', icon: '/grandmaster.webp', tapBalanceRequired: 500000, reward: 250000 },
  { id: 4, name: 'Epic', icon: '/epic.webp', tapBalanceRequired: 1000000, reward: 500000 },
  { id: 5, name: 'Legend', icon: '/legend.webp', tapBalanceRequired: 2500000, reward: 1000000 },
  { id: 6, name: 'Mythic', icon: '/mythic.webp', tapBalanceRequired: 5000000, reward: 2500000 },
];

const Footer = () => {
  const { id, refBonus, referrals, loading, claimedReferralRewards, reward, tapBalance, claimedMilestones,spinLimit } = useUser();
  const location = useLocation();
  const {selectedExchange} = useUser();
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    if (spinLimit > 0) {
      setShowPulse(true);
    } else {
      setShowPulse(false); // hide pulse when spinLimit is 0
    }
  }, [spinLimit]); // Reacts to changes in spinLimit

  
  function triggerHapticFeedback() {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
    if (isIOS && window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
      console.log('Triggering iOS haptic feedback');
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    } else if (isAndroid) {
      console.log('Android device detected');
      if ('vibrate' in navigator) {
        console.log('Vibration API supported, triggering haptic feedback');
        navigator.vibrate(50); // Vibrate for 50ms
      } else {
        console.warn('Vibration API not supported on this Android device');
      }
    } else {
      console.warn('Haptic feedback not supported on this device');
    }
  }
  
  
  const footerLinks = [
    {
      title: "Earn",
      link: "/",
      icon: (
        <IoDiamondSharp
          className={location.pathname === "/" ? "w-[26px] h-[26px] text-[#44dbf6]" : "w-[26px] h-[26px]"}
        />
      )
    },
    {
      title: "Spin",
      link: "/roulette",
      icon: (
        <div className="relative">
          <PiSpinnerBallDuotone
            size={26}
            className={location.pathname === "/roulette" ? "w-[26px] h-[26px] text-[#f5bb5f]" : "w-[26px] h-[26px]"}
          />
          {spinLimit > 0 ? ( 
            <span className="absolute top-[-6px] right-[-6px] h-[8px] w-[8px] bg-green-500 animate-pulse rounded-full"></span>
          ) : null}
        </div>
      )
    },
    {
      title: "Mine",
      link: "/mine",
      icon: (
      <Icon
      icon="hugeicons:mining-02"
          size={26}
          className={location.pathname === "/mine" ? "w-[26px] h-[26px] text-[#f5bb5f]" : "w-[26px] h-[26px]"}
        />
      )
    },
    {
      title: "Tasks",
      link: "/tasks",
      icon: (
        <LuListTodo
          size={26}
          className={location.pathname === "/tasks" ? "w-[26px] h-[26px] text-[#f5bb5f]" : "w-[26px] h-[26px]"}
        />
      )
    },
    {
      title: "Rewards",
      link: "/rewards",
      icon: (
        <div className="relative">
          <IoGiftOutline
            size={26}
            className={location.pathname === "/rewards" ? "w-[26px] h-[26px] text-[#f5bb5f]" : "w-[26px] h-[26px]"}
          />
          {(friendsRewards.some(
            (reward) =>
              referrals.length >= reward.referralsRequired &&
              !claimedReferralRewards.includes(reward.title)
          ) ||
            milestones.some(
              (milestone) =>
                tapBalance >= milestone.tapBalanceRequired &&
                !claimedMilestones.includes(milestone.name)
            )) && (
            <span className="absolute top-[-6px] right-[-6px] h-[8px] w-[8px] bg-green-500 animate-pulse rounded-full"></span>
          )}
        </div>
      )
    },
    {
      title: "Assets",
      link: "/wallet",
      icon: (
        <IoWalletOutline
          size={26}
          className={location.pathname === "/wallet" ? "w-[26px] h-[26px] text-[#f5bb5f]" : "w-[26px] h-[26px]"}
        />
      )
    }
  ];
  
  return (
    <div className="w-full z-30 flex items-center px-[8px] h-[72px] pbd-[2px] justify-center space-x-2 pb-[3px] rounded-[35px]">
      {footerLinks.map((footer, index) => (
        <NavLink
          id={`reels${footer.title}`}
          key={index}
          to={footer.link}
          onClick={() => {
            triggerHapticFeedback();
          }}
          className={
            location.pathname === `${footer.link}`
              ? 'w-[25%] py-3 flex flex-col h-[60px] px-[6px] mt-1 rounded-[10px] bg-cards items-center justify-center text-[#fff] text-[13px] relative before:h-[4px] before:absolute before:top-[1px] before:w-[4px] before:rounded-full before:bg-accent'
              : 'w-[25%] py-3 flex flex-col space-y-[2px] rounded-[10px] items-center justify-center text-[#c6c6c6] text-[13px]'
          }
        >
          <div
            id={`reels2${footer.title}`}
            className={
              location.pathname === `${footer.link}`
                ? 'space-y-[2px] flex flex-col rounded-[10px] items-center justify-center text-white text-[11px]'
                : 'flex flex-col space-y-[4px] rounded-[10px] items-center justify-center text-[#949494] text-[11px]'
            }
          >
            {footer.icon}
            {footer.indicator && footer.indicator}
            <span
              id="reels3"
              className={`${location.pathname === `${footer.link}` ? 'text-[#fff]' : 'text-[#949494]'} font-medium mb-[-2px]`}
            >
              {footer.title}
            </span>
          </div>
        </NavLink>
      ))}
    </div>
  );
  };
  
  export default Footer;
  
