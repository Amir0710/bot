"use client"

import { useEffect, useState, useRef } from "react";
import Animate from "../Components/Animate";
import { Outlet } from "react-router-dom";
import { FaMicrophone, FaStop, FaPlay, FaPause, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { db, storage } from "../firebase/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const VoiceRecordings = () => {
  const [recordings, setRecordings] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  const [myAudioBlob, setMyAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPlayingId, setCurrentPlayingId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [recordingName, setRecordingName] = useState("")
  const [uploadError, setUploadError] = useState("")
  const [currentUser, setCurrentUser] = useState(null)

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerRef = useRef(null)
  const audioRef = useRef(new Audio())
  
  const handleUpload = async (audioBlob, recordingName, recordingTime) => {
    await uploadRecording(audioBlob, recordingName, recordingTime, setRecordings, setUploading, setUploadError);
  };


  const fetchCurrentUser = async () => {
    return new Promise((resolve, reject) => {
      const auth = getAuth();
  
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log("Authenticated User:", user.uid);
  
          try {
            const userDocRef = doc(db, "telegramUsers", user.uid);
            const userDoc = await getDoc(userDocRef);
  
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const currentUserData = {
                id: user.uid,
                fullName: userData.fullName || "Anonymous User",
              };
  
              localStorage.setItem("currentUser", JSON.stringify(currentUserData));
              resolve(currentUserData); // Return user data
            } else {
              console.warn("User document not found in Firestore");
              resolve(null);
            }
          } catch (error) {
            console.error("Error fetching user from Firestore:", error);
            reject(error);
          }
        } else {
          console.warn("No authenticated user found");
          resolve(null);
        }
      });
    });
  };

  const handleAudioRecording = (blob) => {
    setMyAudioBlob(blob);
  };

  const uploadRecording = async (audioBlob, recordingName, recordingTime, setRecordings, setUploading, setUploadError) => {
    if (!audioBlob || !recordingName.trim()) return;
  
    setUploading(true);
    setUploadError("");
  
    try {
      const currentUser = await fetchCurrentUser();
      
      if (!currentUser) {
        setUploadError("User information not available. Please sign in.");
        setUploading(false);
        return;
      }
  
      // Upload audio blob to Firebase Storage
      const storageRef = ref(storage, `recordings/${Date.now()}_${recordingName.trim().replace(/\s+/g, "_")}.wav`);
      const snapshot = await uploadBytes(storageRef, audioBlob);
      const downloadURL = await getDownloadURL(snapshot.ref);
  
      // Save metadata to Firestore
      const newRecording = {
        name: recordingName.trim(),
        url: downloadURL,
        timestamp: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        duration: recordingTime,
        userId: currentUser.id,
        userName: currentUser.fullName, // Use fullName from Firestore
      };
  
      const docRef = await addDoc(collection(db, "recordings"), newRecording);
  
      // Update local state
      setRecordings((prev) => [{ id: docRef.id, ...newRecording }, ...prev]);
      
      console.log("Recording uploaded successfully:", newRecording);
    } catch (error) {
      console.error("Error uploading recording:", error);
      setUploadError("Failed to upload recording. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  
  

  // Fetch recordings from Firestore
  const fetchRecordings = async () => {
    try {
      const recordingsRef = collection(db, "recordings")
      const querySnapshot = await getDocs(recordingsRef)
      const recordingsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setRecordings(recordingsData)
    } catch (error) {
      console.error("Error fetching recordings:", error)
    }
  }

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        setAudioBlob(audioBlob)

        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)

        audioChunksRef.current = []
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)
      setUploadError("")

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error starting recording:", error)
      setUploadError("Microphone access denied. Please allow microphone access and try again.")
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      clearInterval(timerRef.current)
      setIsRecording(false)
    }
  }

  // Format time (seconds to MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }



  // Play/pause recording
  const togglePlayback = (recording) => {
    if (currentPlayingId === recording.id && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      if (isPlaying) {
        audioRef.current.pause()
      }

      audioRef.current.src = recording.url
      audioRef.current.play()
      setIsPlaying(true)
      setCurrentPlayingId(recording.id)

      audioRef.current.onended = () => {
        setIsPlaying(false)
        setCurrentPlayingId(null)
      }
    }
  }

  // Test audio playback
  const testPlayback = () => {
    if (!audioUrl) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.src = audioUrl
      audioRef.current.play()
      setIsPlaying(true)

      audioRef.current.onended = () => {
        setIsPlaying(false)
      }
    }
  }

  // Vote on recording
  const handleVote = async (recordingId, voteType) => {
    const updatedRecordings = recordings.map((recording) => {
      if (recording.id === recordingId) {
        if (voteType === "up") {
          return { ...recording, upvotes: (recording.upvotes || 0) + 1 }
        } else {
          return { ...recording, downvotes: (recording.downvotes || 0) + 1 }
        }
      }
      return recording
    })

    setRecordings(updatedRecordings)
  }

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "?"
    const parts = name.split(" ")
    if (parts.length === 1) {
      return parts[0][0] ? parts[0][0].toUpperCase() : "?"
    }
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }

  // Hash function to generate a color based on the user's name
  const stringToColor = (str) => {
    if (!str) return "#6e7582"
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    let color = "#"
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      color += ("00" + value.toString(16)).slice(-2)
    }
    return color
  }

  // Fetch data when component mounts
  useEffect(() => {
    fetchCurrentUser()
    fetchRecordings()

    // Clean up
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <Animate>
      <div id="voice-recordings" className="w-full h-[70vh] scroller rounded-[10px] overflow-y-auto pt-2 pb-[180px]">
        {/* User info display */}
        <div className="bg-cards w-full rounded-[15px] p-[14px] mb-4">
          <div className="flex items-center">
            <div
              className="w-[40px] h-[40px] rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: stringToColor(currentUser?.fullName) }}
            >
              <span className="font-semibold text-[15px]">{getInitials(currentUser?.fullName)}</span>
            </div>
            <div>
              <p className="font-semibold text-[15px] text-[#ffffff]">
                {currentUser?.fullName || "Anonymous User"}
              </p>
              <p className="text-[13px] text-[#a0a0a0]">Recording as: {currentUser?.fullName || "Anonymous"}</p>
            </div>
          </div>
        </div>
  
        {/* Recording interface */}
        <div className="bg-cards w-full rounded-[15px] p-[14px] mb-4">
          <h2 className="text-[18px] font-semibold text-white mb-3">Record Your Voice</h2>
  
          {!audioBlob ? (
            <div className="flex flex-col items-center justify-center">
              <div className="text-center mb-4">
                {isRecording ? (
                  <div className="text-red-500 animate-pulse font-medium">Recording... {formatTime(recordingTime)}</div>
                ) : (
                  <div className="text-gray-300">Tap to start recording</div>
                )}
              </div>
  
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isRecording ? "bg-red-600" : "bg-[#9945FF]"
                }`}
              >
                {isRecording ? (
                  <FaStop className="text-white text-xl" />
                ) : (
                  <FaMicrophone className="text-white text-xl" />
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Name your recording"
                  value={recordingName}
                  onChange={(e) => setRecordingName(e.target.value)}
                  className="flex-1 bg-[#2a2a2a] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
                />
                <button onClick={testPlayback} className="px-3 py-2 rounded-lg bg-[#2a2a2a] text-white">
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button
                  onClick={uploadRecording}
                  disabled={uploading || !recordingName.trim()}
                  className={`px-4 py-2 rounded-lg flex items-center justify-center ${
                    uploading || !recordingName.trim() ? "bg-gray-600" : "bg-[#9945FF]"
                  }`}
                >
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <IoSend className="text-white text-xl" />
                  )}
                </button>
              </div>
  
              {uploadError && <div className="text-red-400 text-sm mt-2">{uploadError}</div>}
  
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setAudioBlob(null);
                    setAudioUrl(null);
                    setUploadError("");
                  }}
                  className="text-red-400 text-sm"
                >
                  Cancel
                </button>
                <div className="text-gray-300 text-sm">Duration: {formatTime(recordingTime)}</div>
              </div>
            </div>
          )}
        </div>
  
        {/* Recordings list */}
        <div className="w-full space-y-4">
          {recordings.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No recordings yet. Be the first to share your voice!</div>
          ) : (
            recordings.map((recording) => (
              <div key={recording.id} className="bg-cards w-full rounded-[15px] p-[14px] flex flex-col">
                <div className="flex items-center space-x-3 mb-3">
                  <div
                    className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
                    style={{ backgroundColor: stringToColor(recording.userName || "Unknown") }}
                  >
                    <span className="font-semibold text-[15px]">{getInitials(recording.userName || "Unknown")}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[15px] text-[#ffffff]">{recording.userName || "Unknown"}</p>
                    <p className="text-[13px] text-[#a0a0a0]">{recording.name}</p>
                  </div>
                  <div className="ml-auto text-[13px] text-[#a0a0a0]">{formatTime(recording.duration || 0)}</div>
                </div>
  
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => togglePlayback(recording)}
                    className="bg-[#2a2a2a] rounded-full w-10 h-10 flex items-center justify-center"
                  >
                    {currentPlayingId === recording.id && isPlaying ? (
                      <FaPause className="text-white" />
                    ) : (
                      <FaPlay className="text-white" />
                    )}
                  </button>
  
                  <div className="flex items-center space-x-4">
                    <button onClick={() => handleVote(recording.id, "up")} className="flex items-center space-x-1">
                      <FaThumbsUp className="text-green-400" />
                      <span className="text-[14px] text-white">{recording.upvotes || 0}</span>
                    </button>
  
                    <button onClick={() => handleVote(recording.id, "down")} className="flex items-center space-x-1">
                      <FaThumbsDown className="text-red-400" />
                      <span className="text-[14px] text-white">{recording.downvotes || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
  
        {/* Upload Button and Status Messages */}
        <div className="mt-6 text-center">
          <button
            onClick={() => handleUpload(myAudioBlob, "My Recording", 30)}
            className="px-4 py-2 rounded-lg bg-[#9945FF] text-white font-semibold"
          >
            Upload Recording
          </button>
          {uploading && <p className="text-yellow-400 mt-2">Uploading...</p>}
          {uploadError && <p className="text-red-400 mt-2">{uploadError}</p>}
        </div>
      </div>
      <Outlet />
    </Animate>
  );
  
}

export default VoiceRecordings