import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "cookies-js"

const TrackPageVisit = ({ userId }) => {
    // console.log(userId, "hiii")
  const location = useLocation();
  const token = Cookies.get('user');

  useEffect(() => {
    axios.post(`${import.meta.env.VITE_URL}/activity/page-visit`, { userId, page: location.pathname, token: token })
      .catch(err => console.error("Error tracking page visit:", err));
  }, [location, userId]);

  return null;
};

export default TrackPageVisit;
