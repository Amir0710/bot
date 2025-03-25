import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import Animate from '../Components/Animate';
import { Outlet } from 'react-router-dom';
import { FaCrown } from 'react-icons/fa';


const Leaderboard = () => {
  const [topBalances, setTopBalances] = useState([]);
  const [topReferrers, setTopReferrers] = useState([]);
  const [activeIndex, setActiveIndex] = useState(1);

  // Fetch top users by balance
  const fetchTopBalances = async () => {
    try {
      const usersRef = collection(db, 'telegramUsers');
      const balanceQuery = query(usersRef, orderBy('balance', 'desc'));
      const snapshot = await getDocs(balanceQuery);
      const balances = snapshot.docs.slice(0, 10).map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTopBalances(balances);
    } catch (error) {
      console.error('Error fetching top balances:', error);
    }
  };

  // Fetch top users by referrals
  const fetchTopReferrers = async () => {
    try {
      const usersRef = collection(db, 'telegramUsers');
      const referralsQuery = query(usersRef, orderBy('referrals.length', 'desc'));
      const snapshot = await getDocs(referralsQuery);
      const referrers = snapshot.docs.slice(0, 10).map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTopReferrers(referrers);
    } catch (error) {
      console.error('Error fetching top referrers:', error);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchTopBalances();
    fetchTopReferrers();
  }, []);

  // Handle tab switching
  const handleMenu = (index) => {
    setActiveIndex(index);
  };

  const getInitials = (name) => {
    const firstLetter = name[0] ? name[0].toUpperCase() : ''; // First letter only
    return firstLetter;
  };

  // Hash function to generate a color based on the user's name
  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ('00' + value.toString(16)).slice(-2);
    }
    return color;
  };

const formatNumberCliam = (num) => {
  if (num < 100000) {
    return new Intl.NumberFormat().format(num).replace(/,/g, " ");
  } else if (num < 1000000) {
    return new Intl.NumberFormat().format(num).replace(/,/g, " ");
  } else if (num < 1000000000) {
    return new Intl.NumberFormat().format(num).replace(/,/g, " ");
  } else if (num < 1000000000000) {
    return (num / 1000000000).toFixed(2).replace(".", ".") + " B"; // Billion
  } else {
    return (num / 1000000000000).toFixed(3).replace(".", ".") + " T"; // Trillion
  }
};


  const formatNumber = (number) => {
    if (number === undefined || number === null || isNaN(number)) {
      return '';
    }
  
    if (number >= 1000000) {
      return (number / 1000000).toFixed() + 'M';
    } else if (number >= 100000) {
      return (number / 1000).toFixed(0) + 'K';
    } else {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
  };

  return (
    <Animate>
    <div id="refer" className="w-full h-[70vh] scroller rounded-[10px] overflow-y-auto pt-2 pb-[180px]">
          <div className={`${activeIndex === 1 ? 'block' : 'hidden'} w-full space-y-4`}>
            {topBalances.map((user, index) => (
              <div
                key={user.id}
                className="bg-cards w-full rounded-[15px] p-[14px] flex justify-between items-center"
              >
                <div className="flex items-center space-x-3">
                <div className="font-semibold text-[18px] flex flex-col items-center">
                {index === 0 && (
                  <FaCrown className="text-yellow-500 mb-1" />
                )}
                {index === 1 && (
                  <FaCrown className="text-yellow-400 mb-1" />
                )}
                {index === 2 && (
                  <FaCrown className="text-yellow-300 mb-1" />
                )}
                {index + 1}
              </div>
                  {/* Profile picture with initials */}
                  <div
                    className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
                    style={{ backgroundColor: stringToColor(user.fullName || 'Unknown') }}
                  >
                    <span className="font-semibold text-[15px]">
                      {getInitials(user.fullName || 'Unknown')}
                    </span>
                  </div>
                  <div>
                <p className="font-semibold text-[15px] text-[#ffffff]">{user.fullName || 'Unknown'}</p>
                <div className="flex items-center space-x-1">
                  <span className="w-[10px] h-[10px] bg-[#be8130] rounded-full"></span>
                  <p className="font-medium text-[14px] text-[#ffffff]">
                    {formatNumberCliam(user.balance)}
                  </p>
                </div>
              </div>
                </div>
                <div className="text-[#f5bb5f] text-md font-semibold">
                  {formatNumber(user.balance)}
                </div>
              </div>
            ))}
          </div>
          </div>
      <Outlet />
    </Animate>
  );
};

export default Leaderboard;
