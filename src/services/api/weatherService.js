import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const WEATHER_API_KEY = "08a35c077c179370b9de692053ef20cd";
const WEATHER_LAT = "8.049672";
const WEATHER_LON = "124.897026";

const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

export const weatherService = {
  fetchWeatherData: async () => {
    try {
      const response = await fetch(
        `${BASE_URL}?lat=${WEATHER_LAT}&lon=${WEATHER_LON}&appid=${WEATHER_API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("Weather data fetch failed");
      }

      const data = await response.json();
      const currentWeather = data.list[0];

      // Prepare weather data for storage
      const weatherData = {
        temperature: currentWeather.main.temp,
        humidity: currentWeather.main.humidity,
        precipitation: currentWeather.rain ? currentWeather.rain["3h"] || 0 : 0,
        weather: currentWeather.weather[0].main,
        description: currentWeather.weather[0].description,
        timestamp: new Date(),
      };

      // Store in Firestore
      const weatherCollection = collection(db, "open-weather-data");
      await addDoc(weatherCollection, weatherData);

      return weatherData;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  },
};

// Default export
export default weatherService;
