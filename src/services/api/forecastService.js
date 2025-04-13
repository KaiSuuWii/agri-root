import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const fetchWeatherForecast = async () => {
  try {
    const lat = "8.049672";
    const lon = "124.897026";
    const apiKey = "08a35c077c179370b9de692053ef20cd";

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error("Weather forecast fetch failed");
    }

    const data = await response.json();

    // Filter for forecasts at 15:00:00 only
    const dailyForecasts = data.list
      .filter((item) => item.dt_txt.endsWith("03:00:00"))
      .map((item) => ({
        date: new Date(item.dt * 1000),
        dateString: item.dt_txt.split(" ")[0],
        temp: Math.round(item.main.temp),
        weather: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        precipitation: item.pop * 100, // Convert probability to percentage
      }));

    // Store in Firebase
    const forecastCollection = collection(db, "weather-forecast");
    await addDoc(forecastCollection, {
      forecast: dailyForecasts,
      timestamp: new Date(),
    });

    return dailyForecasts;
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
};

export const subscribeToForecastUpdates = (callback) => {
  const forecastCollection = collection(db, "weather-forecast");
  const forecastQuery = query(
    forecastCollection,
    orderBy("timestamp", "desc"),
    limit(1)
  );

  return onSnapshot(forecastQuery, (snapshot) => {
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      callback(data.forecast);
    }
  });
};
