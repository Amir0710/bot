import React, { useEffect, useState } from 'react'
import Animate from '../Components/Animate'
import { useUser } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import { FcTodoList } from "react-icons/fc";
import { TbUsersPlus } from "react-icons/tb";
import { GiMining } from "react-icons/gi";
import { CgCardSpades } from "react-icons/cg";
import { GrTask } from "react-icons/gr";
import { GiMiner } from "react-icons/gi";

const Qualify = () => {
    const {balance, refBonus, purchasedCards, profitHour} = useUser()

    const locations = useNavigate();
    const [backLos, setBackLos] = useState(true)

    useEffect(() => {

        // Attach a click event listener to handle the back navigation
        const handleBackButtonClick = () => {
            locations('/wallet'); // Navigate to /home without refreshing the page
            setBackLos(false);
              }
    
          
        if (backLos) {
          window.Telegram.WebApp.BackButton.show();
          window.Telegram.WebApp.BackButton.onClick(handleBackButtonClick);
        } else {
          window.Telegram.WebApp.BackButton.hide();
          window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
        }
      
        // Cleanup handler when component unmounts
        return () => {
          window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
    
        };
      }, [backLos, setBackLos, locations]);

      

    const formatNumber = (num) => {
        if (num < 100000) {
          return new Intl.NumberFormat().format(num).replace(/,/g, " ");
        } else if (num < 1000000) {
          return new Intl.NumberFormat().format(num).replace(/,/g, " ");
        } else {
          return (num / 1000000).toFixed(3).replace(".", ".") + " M";
        }
      };

      const qualifications = [
        {
          title: "Tasks & activities earn",
          totalBalance: balance,
          icon: (
            <GrTask 
              size={26}
              className="w-[26px] h-[26px] text-[#f5bb5f]"
            />
          ),
          id: 1,
        },
        {
            title: "Referral activities earn",
            totalBalance: refBonus,
            icon: (
              <TbUsersPlus
                size={26}
                className="w-[26px] h-[26px] text-[#f5bb5f]"
              />
            ),
            id: 2,
        },
        {
            title: "Mining profits per hour",
            totalBalance: profitHour,
            icon: (
              <GiMining
                size={26}
                className="w-[26px] h-[26px] text-[#f5bb5f]"
              />
            ),
            id: 3,
        },
        {
            title: "Special cards purchased",
            totalBalance: purchasedCards.length,
            icon: (
              <CgCardSpades
                size={26}
                className="w-[26px] h-[26px] text-[#f5bb5f]"
              />
            ),
            id: 4,
        },
      ]

  return (
    <Animate>


    <div className='w-full flex justify-center items-center flex-col space-y-3'>


<div className='w-full flex items-center justify-center py-8'>
    <img alt="daxy" src="/tracex.webp" 
            className="w-[160px] h-[160px] bounce-animation-2s"
            />
</div>


      <div className='w-full relative h-screen bg-divider shadowtop rounded-tl-[40px] rounded-tr-[40px]'>
        <div className='w-full h-screen homescreen rounded-tl-[40px] rounded-tr-[40px] mt-[2px] px-5'>

        <div id="refer" className='w-full flex flex-col scroller h-[70vh] overflow-y-auto pb-[250px]'>
{/*  */}

<div className='w-full flex flex-col text-center justify-center items-center pt-6'>
    <h1 className='font-semibold text-[20px]'>
    Eligibility for Airdrop Rewards
    </h1>

    <p className='text-[14px] text-[#c6c6c6] leading-[24px] px-3 pb-8'>
    Listing and launching soon! Participate in activities to ensure your eligibility.
            </p>


</div>


<div className='w-full flex flex-col space-y-[10px]'>

{qualifications.map((data, index) => (

<div key={index} className="w-full bg-cards text-[14px] rounded-[6px] px-4 py-4 space-x-2 flex items-center justify-between">
              <span className="flex items-center justify-center mt-[1px]">
                <span className="w-[34px] h-[34px]">
                  {data.icon}
                </span>
                <span className="sr-only">{data.title}</span>
              </span>
                  <div className="flex flex-1 flex-col">
                    <div className="flex w-full justify-between items-center font-medium">
                      <h4 className="">
                       {data.title}
                      </h4>
                      <span className="">
                      {data.totalBalance <= 0 ? (
                        <span className='text-secondary'>{formatNumber(data.totalBalance)}</span>
                      ) : (
                        <span className='text-accent font-semibold'>
                        +{formatNumber(data.totalBalance)}
                        </span>
                      )}
                      
                      
                      </span>
                    </div>
                    <div className="flex w-full justify-between items-center text-secondary">
                      {/* <h4 className="text-[11px]">{balance}</h4> */}
                      {/* <span className="text-[12px]">${formatNumber(data.balance * data.price)}</span> */}
                    </div>
                  </div>
                </div>

))}
</div>



</div>

</div>

      </div>
    </div>
    </Animate>
  )
}

export default Qualify