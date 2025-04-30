import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const preprocessedDataService = {
  /**
   * Process and store averaged sensor data with weather information
   * @param {Array} sensorReadings - Array of sensor readings
   * @param {Object} weatherData - Current weather data
   * @param {Array} forecastData - 5-day forecast data
   */
  processAndStoreData: async (sensorReadings, weatherData, forecastData) => {
    try {
      if (!sensorReadings || sensorReadings.length === 0) {
        console.warn("No sensor readings to process");
        return;
      }

      // Get the latest preprocessed data to check reading number
      const preprocessedCollection = collection(db, "preprocessed-data");
      const latestQuery = query(
        preprocessedCollection,
        orderBy("reading_number", "desc"),
        limit(1)
      );

      const latestSnapshot = await getDocs(latestQuery);
      let currentReadingNumber = 1;

      if (!latestSnapshot.empty) {
        const latestData = latestSnapshot.docs[0].data();
        currentReadingNumber = latestData.reading_number + 1;
      }

      // Check if we need to start a new average (date changed or reading number reset)
      const today = new Date();
      const dateStr = today.toISOString().split("T")[0];
      today.setHours(0, 0, 0, 0);

      const latestDateSnapshot = await getDocs(
        query(
          preprocessedCollection,
          where("date", ">=", dateStr),
          orderBy("date", "desc"),
          limit(1)
        )
      );

      // If we already have data for today, check if we need to reset the reading number
      if (!latestDateSnapshot.empty) {
        const latestDateData = latestDateSnapshot.docs[0].data();
        if (latestDateData.reading_number >= currentReadingNumber) {
          // This is a new day, but reading number is higher than expected
          // This means we need to start a new average
          currentReadingNumber = 1;
        }
      } else {
        // This is a new day, start with reading number 1
        currentReadingNumber = 1;
      }

      // Calculate averages for sensor readings
      const averages = {
        nitrogen: 0,
        phosphorus: 0,
        potassium: 0,
        ph: 0,
        moisture: 0,
        temperature: 0,
      };

      let validReadings = 0;
      sensorReadings.forEach((reading) => {
        if (reading.status === "SUCCEED") {
          averages.nitrogen += reading.nitrogen || 0;
          averages.phosphorus += reading.phosphorus || 0;
          averages.potassium += reading.potassium || 0;
          averages.ph += reading.ph || 0;
          averages.moisture += reading.moisture || 0;
          averages.temperature += reading.temperature || 0;
          validReadings++;
        }
      });

      // Calculate final averages
      if (validReadings > 0) {
        Object.keys(averages).forEach((key) => {
          averages[key] = Number((averages[key] / validReadings).toFixed(2));
        });
      }

      // Create the preprocessed data object
      const now = new Date();
      const preprocessedData = {
        date: dateStr,
        time: now.toTimeString().split(" ")[0],
        reading_number: currentReadingNumber,
        ...averages,
        status: "SUCCEED",
        timestamp: Math.floor(now.getTime() / 1000),
        weather: {
          temperature: weatherData?.temp || 0,
          humidity: weatherData?.humidity || 0,
          precipitation: weatherData?.precipitation || 0,
        },
        forecast: forecastData.map((forecast) => ({
          temperature: forecast.temp,
          humidity: forecast.humidity,
          precipitation: forecast.precipitation,
        })),
      };

      // Store in Firebase
      await addDoc(preprocessedCollection, preprocessedData);

      return preprocessedData;
    } catch (error) {
      console.error("Error processing and storing preprocessed data:", error);
      throw error;
    }
  },

  /**
   * Subscribe to preprocessed data updates
   * @param {Function} callback - Callback function to handle updates
   * @returns {Function} Unsubscribe function
   */
  subscribeToPreprocessedData: (callback) => {
    const preprocessedCollection = collection(db, "preprocessed-data");
    const preprocessedQuery = query(
      preprocessedCollection,
      orderBy("timestamp", "desc"),
      limit(1)
    );

    return onSnapshot(preprocessedQuery, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        callback(data);
      }
    });
  },

  /**
   * Get historical preprocessed data
   * @param {number} days - Number of days of historical data to retrieve
   * @returns {Promise<Array>} Array of historical preprocessed data
   */
  getHistoricalData: async (days = 7) => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split("T")[0];

      const preprocessedCollection = collection(db, "preprocessed-data");
      const historicalQuery = query(
        preprocessedCollection,
        where("date", ">=", startDateStr),
        orderBy("date", "desc")
      );

      const snapshot = await getDocs(historicalQuery);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting historical preprocessed data:", error);
      throw error;
    }
  },
};
