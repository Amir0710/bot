"use client"

import { useEffect, useRef, useState } from "react"
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5"
import { MdOutlineKeyboardArrowRight } from "react-icons/md"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/firestore"
import { useUser } from "../context/userContext"

export const Address = () => {
  const { id, isAddressSaved, setWalletAddress, setIsAddressSaved, walletAddress: savedWalletAddress } = useUser()
  const [walletAddress, setWalletAddressState] = useState("")
  const [disconnect, setDisconnect] = useState(false)
  const [openInfoTwo, setOpenInfoTwo] = useState(false)
  const [openInfo, setOpenInfo] = useState(false)
  const [inputAddress, setInputAddress] = useState("")
  const [addressError, setAddressError] = useState("")

  // Initialize state from context
  useEffect(() => {
    if (savedWalletAddress) {
      setWalletAddressState(savedWalletAddress)
    }
  }, [savedWalletAddress])

  const infoRefTwo = useRef(null)
  const infoRef = useRef(null)

  const handleClickOutside = (event) => {
    if (infoRefTwo.current && !infoRefTwo.current.contains(event.target)) {
      setOpenInfoTwo(false)
    }
    if (infoRef.current && !infoRef.current.contains(event.target)) {
      setOpenInfo(false)
    }
  }

  useEffect(() => {
    if (openInfoTwo || openInfo) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openInfoTwo, openInfo])

  // Function to handle disconnection
  const handleDisconnect = async () => {
    const userRef = doc(db, "telegramUsers", id.toString())
    try {
      // Update Firestore document
      await updateDoc(userRef, {
        address: "",
        isAddressSaved: false,
      })
      setIsAddressSaved(false)
      setWalletAddress("")
      setWalletAddressState("")
      setDisconnect(!disconnect)
      setOpenInfo(false)

      console.log("Address disconnected successfully")
    } catch (error) {
      console.error("Error deleting address:", error)
    }
  }

  const validateSolanaAddress = (address) => {
    // Basic validation - Solana addresses are 44 characters long and Base58 encoded
    if (!address) return "Address cannot be empty"
    if (address.length !== 44) return "Solana addresses should be 44 characters long"
    // Base58 character set check (simplified)
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/
    if (!base58Regex.test(address)) return "Invalid characters in Solana address"
    return ""
  }

  const handleAddressSubmit = async () => {
    const error = validateSolanaAddress(inputAddress)
    setAddressError(error)
    
    if (!error) {
      await saveAddressToFirestore(inputAddress)
      setOpenInfoTwo(false)
    }
  }

  const downloadPhantom = (platform) => {
    let url = '';
    
    // Use deep links for mobile platforms
    if (platform === 'ios') {
      // iOS deep link to App Store
      url = 'https://apps.apple.com/app/phantom-crypto-wallet/id1598432977';
    } else if (platform === 'android') {
      // Android deep link to Play Store
      url = 'https://play.google.com/store/apps/details?id=app.phantom';
    }
    
    // Open in new tab or use Telegram's openLink if available
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(url);
    } else {
      window.open(url, '_blank');
    }
  }

  const disco = () => {
    setDisconnect(!disconnect)
  }

  // Function to save address to Firestore
  const saveAddressToFirestore = async (address) => {
    const userRef = doc(db, "telegramUsers", id.toString())
    try {
      await updateDoc(userRef, {
        address: address,
        isAddressSaved: true,
      })
      setIsAddressSaved(true)
      setWalletAddress(address)
      setWalletAddressState(address)
      console.log("Address saved successfully")
    } catch (error) {
      console.error("Error saving address:", error)
    }
  }

  return (
    <>
      <div className="w-full rounded-[15px] flex flex-col justify-center items-end relative">
        {walletAddress || savedWalletAddress ? (
          <button
            onClick={() => setOpenInfo(true)}
            className="bg-[#a4a4a424] flex h-full w-fit rounded-full items-center py-[10px] px-3 relative space-x-1"
          >
            <img src="/phantomlogo.png" alt="solana" className="w-[16px] -mt-[2px]" />
            <div className="text-[13px] small-text2 text-left pr-3 text-nowrap text-white flex flex-1 flex-col">
              <h4 className="font-semibold text-[#d1d1d1] line-clamp-1 break-all text-wrap">
                {(walletAddress || savedWalletAddress).slice(0, 4)}...{(walletAddress || savedWalletAddress).slice(-4)}
              </h4>
            </div>
            <IoCheckmarkCircle size={20} className="text-[#40863d]" />
          </button>
        ) : (
          <button
            onClick={() => setOpenInfoTwo(true)}
            className="bg-[#AB9FF1] flex h-full w-fit rounded-full items-center py-[10px] px-3 relative space-x-1"
          >
            <img src="/phantom.webp" alt="Logo Solana" className="w-[16px] h-[16px]" />
            <div className="text-[13px] small-text2 text-left pr-6 text-nowrap text-white flex flex-1 flex-col">
              Add your wallet
            </div>
            <MdOutlineKeyboardArrowRight size={20} className="text-[#fff] absolute right-2" />
          </button>
        )}
      </div>

      {/* Connected Wallet Modal */}
      <div
        className={`${
          openInfo === true ? "visible" : "invisible"
        } fixed bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
        <div
          ref={infoRef}
          className={`${
            openInfo === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
          } w-full bg-modal absolute bottom-0 left-0 right-0 rounded-tr-[20px] rounded-tl-[20px] flex flex-col justify-center p-8`}
        >
          <div className="w-fit flex justify-center absolute right-6 top-6">
            <button
              onClick={() => setOpenInfo(false)}
              className="w-fit flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]"
            >
              <IoCloseCircle size={32} className="text-[#8f8f8f]" />
            </button>
          </div>

          <div className="w-full flex justify-center flex-col items-center space-y-3 pt-6 pb-32">
            <div className="w-full items-center justify-center flex flex-col space-y-2">
              <span className="w-[72px] flex items-center">
                <img src="/phantomlogo.png" alt="solana" className="w-full" />
              </span>
              <h3 className="font-semibold text-green-500 text-[22px] w-full text-center">Your wallet is connected</h3>
              <p className="text-[#bfbfbf] text-[14px] w-full text-center">
                {walletAddress || savedWalletAddress}
              </p>
              <p className="pb-6 text-[#bfbfbf] text-[14px] w-full text-center">
                Continue performing tasks and await airdrop distribution!
              </p>

              <div className="w-full flex flex-col items-center justify-center space-y-4">
                <div className="w-full flex flex-col items-center justify-center space-y-1">
                  <button onClick={disco} className="bg-red-500 w-fit py-2 px-10 text-center rounded-[25px]">
                    Disconnect wallet
                  </button>
                  <div
                    className={`${disconnect ? "flex" : "hidden"} px-4 py-2 text-[13px] text-center rounded-[8px] flex flex-col`}
                  >
                    <p className="text-[#ffffff] pb-2">
                      Are you sure you want to disconnect? Only connected wallets are eligible for airdrop
                    </p>
                    <div className="w-full flex justify-center">
                      <button
                        onClick={handleDisconnect}
                        className="font-medium bg-[#eb4848] w-fit rounded-[25px] px-4 py-1"
                      >
                        Yes Disconnect wallet
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setOpenInfo(false)}
                  className="bg-[#fff] text-[#000] py-2 px-8 text-center rounded-[25px]"
                >
                  Go back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Wallet Address Modal */}
      <div
        className={`${
          openInfoTwo === true ? "visible" : "invisible"
        } fixed bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
        <div
          ref={infoRefTwo}
          className={`${
            openInfoTwo === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
          } w-full bg-modal absolute bottom-0 left-0 right-0 rounded-tr-[20px] rounded-tl-[20px] flex flex-col justify-center p-8`}
        >
          <div className="w-fit flex justify-center absolute right-6 top-6">
            <button
              onClick={() => setOpenInfoTwo(false)}
              className="w-fit flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]"
            >
              <IoCloseCircle size={32} className="text-[#8f8f8f]" />
            </button>
          </div>

          <div className="w-full flex justify-center flex-col items-center space-y-3 pt-6 pb-32">
            <div className="w-full items-center justify-center flex flex-col space-y-2">
              <span className="w-[72px] flex items-center">
                <img src="/phantomlogo.png" alt="solana" className="w-full" />
              </span>
              <h3 className="font-semibold text-[22px] w-full text-center flex items-center justify-center gap-2">
                Add Your Solana Address
              </h3>
              <p className="pb-6 text-[#bfbfbf] text-[14px] w-full text-center">
                Enter your Solana wallet address to receive airdrop allocation. If you don't have a wallet, 
                download Phantom using the buttons below.
              </p>

              <div className="w-full flex flex-col items-center justify-center space-y-4">
                <div className="w-full mb-4">
                  <label className="block text-[#bfbfbf] text-sm font-medium mb-2">
                    Solana Wallet Address
                  </label>
                  <input
                    type="text"
                    value={inputAddress}
                    onChange={(e) => {
                      setInputAddress(e.target.value)
                      setAddressError("")
                    }}
                    className="w-full py-3 px-4 bg-[#2d2d2d] rounded-[10px] text-white focus:outline-none focus:ring-2 focus:ring-[#AB9FF1]"
                    placeholder="Enter your Solana address"
                  />
                  {addressError && (
                    <p className="text-red-500 text-sm mt-1">{addressError}</p>
                  )}
                </div>

                <div className="w-full px-4 py-4 bg-[#2d2d2d] rounded-[10px] mb-4">
                  <h4 className="font-medium text-[16px] text-white mb-2">Download Phantom Wallet</h4>
                  <p className="text-[#bfbfbf] text-[14px] mb-3">
                    Don't have a Solana wallet? Install the official Phantom app:
                  </p>
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => downloadPhantom('ios')}
                      className="flex-1 bg-[#3a3a3a] py-2 rounded-[8px] text-[14px] text-white flex items-center justify-center"
                    >
                      <img src="/app-store.png" alt="Apple" className="w-4 h-4 mr-2" />
                      iOS App
                    </button>
                    <button 
                      onClick={() => downloadPhantom('android')}
                      className="flex-1 bg-[#3a3a3a] py-2 rounded-[8px] text-[14px] text-white flex items-center justify-center"
                    >
                      <img src="/google.png" alt="Android" className="w-4 h-4 mr-2" />
                      Android App
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddressSubmit}
                  className="bg-[#AB9FF1] text-white w-full py-3 rounded-[10px] font-medium flex items-center justify-center"
                >
                  Save Address
                </button>
                
                <button
                  onClick={() => setOpenInfoTwo(false)}
                  className="bg-[#3a3a3a] text-white w-full py-3 rounded-[10px] font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Address;