import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { preprocessedDataService } from "./preprocessedDataService";

export const dataIntegrationService = {
  /**
   * Fetch the latest soil health data readings
   */
  fetchLatestSoilData: async () => {
    try {
      console.log("Fetching latest soil data...");
      const soilCollection = collection(db, "soil-health-data");

      // Simplified query: just get the most recent readings
      const soilQuery = query(
        soilCollection,
        orderBy("timestamp", "desc"),
        limit(10) // Get last 10 readings to calculate average
      );

      const snapshot = await getDocs(soilQuery);
      const readings = snapshot.docs.map((doc) => doc.data());
      console.log(`Found ${readings.length} recent soil readings:`, readings);
      return readings;
    } catch (error) {
      console.error("Error fetching soil data:", error);
      throw error;
    }
  },

  /**
   * Fetch weather forecast data
   */
  fetchWeatherData: async () => {
    try {
      console.log("Fetching weather data...");
      const weatherCollection = collection(db, "weather-forecast");
      const weatherQuery = query(
        weatherCollection,
        orderBy("timestamp", "desc"),
        limit(1)
      );

      const snapshot = await getDocs(weatherQuery);
      if (snapshot.empty) {
        console.log("No weather data found");
        return { current: null, forecast: [] };
      }

      const weatherData = snapshot.docs[0].data();
      console.log("Retrieved weather data:", weatherData);
      return {
        current: {
          temp: weatherData.current?.temp || 0,
          humidity: weatherData.current?.humidity || 0,
          precipitation: weatherData.current?.precipitation || 0,
        },
        forecast: weatherData.forecast || [],
      };
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  },

  /**
   * Process and store the latest data
   */
  processLatestData: async () => {
    try {
      console.log("Starting data processing...");
      // Fetch soil health readings
      const soilReadings = await dataIntegrationService.fetchLatestSoilData();
      if (soilReadings.length === 0) {
        console.warn("No soil readings found");
        return;
      }

      // Fetch weather data
      const { current: weatherData, forecast } =
        await dataIntegrationService.fetchWeatherData();

      console.log("Processing data with:", {
        soilReadings: soilReadings.length,
        hasWeatherData: !!weatherData,
        forecastDays: forecast.length,
      });

      // Process and store the data
      const result = await preprocessedDataService.processAndStoreData(
        soilReadings,
        weatherData,
        forecast
      );

      console.log("Successfully processed and stored data:", result);
      return true;
    } catch (error) {
      console.error("Error in data integration process:", error);
      throw error;
    }
  },

  /**
   * Initialize the data processing
   * This should be called when the application starts
   */
  initializeDataProcessing: async () => {
    try {
      console.log("Initializing data processing...");
      // Process immediately
      await dataIntegrationService.processLatestData();

      // Set up periodic processing (every 15 minutes)
      const intervalMinutes = 15;
      console.log(
        `Setting up ${intervalMinutes} minute interval for data processing`
      );
      const interval = setInterval(
        dataIntegrationService.processLatestData,
        intervalMinutes * 60 * 1000
      );

      // Return cleanup function
      return () => clearInterval(interval);
    } catch (error) {
      console.error("Error initializing data processing:", error);
      throw error;
    }
  },
};
