import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../services/firebase/firebaseConfig";

export const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const weatherCollection = collection(db, "open-weather-data");
    const weatherQuery = query(
      weatherCollection,
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(
      weatherQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          // Convert Firestore Timestamp to Date if needed
          if (data.timestamp) {
            data.timestamp = data.timestamp.toDate();
          }
          setWeatherData(data);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching weather data:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { weatherData, loading, error };
};
