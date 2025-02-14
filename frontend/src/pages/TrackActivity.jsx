import { useEffect } from "react";
import Cookies from "cookies-js";

const TrackActivity = ({ userId }) => {
  let startTime = Date.now();
  let totalActiveTime = Number(localStorage.getItem("activeTime") || 0);
  const token = Cookies.get("user");

  const saveActivity = () => {
    // console.log("saveActivity() called");

    const elapsedTime = (Date.now() - startTime) / 1000; // Convert to seconds
    totalActiveTime += elapsedTime;
    
    // console.log(" Elapsed Time:", elapsedTime);
    // console.log(" Total Active Time Before Storing:", totalActiveTime);

    localStorage.setItem("activeTime", totalActiveTime);
    // console.log(" Stored Active Time in localStorage:", localStorage.getItem("activeTime"));

    if (!userId || !token) {
      console.log(" Missing userId or token. Skipping request.");
      return;
    }

    const data = JSON.stringify({ userId, activeTime: elapsedTime, token });
    // console.log("Sending Data:", data);

    const success = navigator.sendBeacon(`${import.meta.env.VITE_URL}/activity/newActivity`, data);
    // console.log(success ? "Beacon sent successfully" : " Beacon failed");

    startTime = Date.now();
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      // console.log("Tab is hidden, saving activity...");
      saveActivity();
    }
  };

  const handleBeforeUnload = (event) => {
    // console.log("Page is unloading, saving activity...");
    saveActivity();
  };

  useEffect(() => {
    // console.log("Component Mounted, Checking localStorage...");
    // console.log("Current localStorage Value:", localStorage.getItem("activeTime"));

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null;
};

export default TrackActivity;
