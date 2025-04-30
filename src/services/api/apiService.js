// src/services/apiService.js
import { mlService } from "./mlService";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

const API_BASE_URL = "https://agrithesis-production.up.railway.app";

const formatPredictionData = (prediction, sensorData) => {
  // Default values for NPK status based on thresholds
  const getNPKStatus = (value, threshold = 30) =>
    value < threshold ? "Low" : "Optimal";

  return {
    fertilizer_type:
      "NPK-rich Complete Fertilizer (Split Application Recommended)",
    fertilizer_application:
      "Split Application - Apply in small doses with irrigation",
    pH_status:
      sensorData.ph >= 6.0 && sensorData.ph <= 7.0 ? "Optimal" : "Suboptimal",
    rainfall_status: sensorData.rainfall < 100 ? "Insufficient" : "Sufficient",
    npk_status: {
      N: getNPKStatus(sensorData.N),
      P: getNPKStatus(sensorData.P),
      K: getNPKStatus(sensorData.K),
    },
    quantity_recommendation: {
      primary_fertilizer: {
        name: "Complete Fertilizer (14-14-14)",
        quantity: prediction.recommended_amount || 514.3,
        unit: "kg/ha",
      },
      secondary_fertilizer: {
        name: "",
        quantity: 0.0,
        unit: "kg/ha",
      },
      application_schedule: {
        basal: {
          timing: "Apply at planting time or before planting",
          percentage: "40%",
          quantity: (prediction.recommended_amount || 514.3) * 0.4,
          fertilizer: "Complete Fertilizer (14-14-14)",
        },
        first_top_dressing: {
          timing: "Apply 25-30 days after planting",
          percentage: "30%",
          quantity: (prediction.recommended_amount || 514.3) * 0.3,
          fertilizer: "Complete Fertilizer (14-14-14)",
        },
        second_top_dressing: {
          timing: "Apply 45-50 days after planting (before tasseling)",
          percentage: "30%",
          quantity: (prediction.recommended_amount || 514.3) * 0.3,
          fertilizer: "Complete Fertilizer (14-14-14)",
        },
      },
    },
    timestamp: new Date(),
    sensorData,
  };
};

const validateSensorData = (data) => {
  const requiredFields = [
    "N",
    "P",
    "K",
    "temperature",
    "humidity",
    "ph",
    "rainfall",
  ];
  const missingFields = requiredFields.filter(
    (field) => data[field] === undefined || data[field] === null
  );

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  // Ensure all values are numbers and within reasonable ranges
  if (typeof data.N !== "number" || data.N < 0) data.N = 0;
  if (typeof data.P !== "number" || data.P < 0) data.P = 0;
  if (typeof data.K !== "number" || data.K < 0) data.K = 0;
  if (typeof data.temperature !== "number") data.temperature = 25;
  if (typeof data.humidity !== "number" || data.humidity < 0) data.humidity = 0;
  if (typeof data.ph !== "number" || data.ph < 0) data.ph = 7;
  if (typeof data.rainfall !== "number" || data.rainfall < 0) data.rainfall = 0;

  return data;
};

export const apiService = {
  /**
   * Subscribe to preprocessed data and automatically trigger predictions
   * @returns {Function} Unsubscribe function
   */
  subscribeAndPredict: () => {
    const preprocessedCollection = collection(db, "preprocessed-data");
    const latestQuery = query(
      preprocessedCollection,
      orderBy("timestamp", "desc"),
      limit(1)
    );

    // Set up real-time listener for preprocessed data
    const unsubscribe = onSnapshot(latestQuery, async (snapshot) => {
      if (!snapshot.empty) {
        try {
          await apiService.predictFertilizerFromLatest();
        } catch (error) {
          console.error("Error auto-predicting fertilizer:", error);
          // Store a default prediction if API fails
          const latestData = snapshot.docs[0].data();
          const sensorData = {
            N: latestData.nitrogen || 0,
            P: latestData.phosphorus || 0,
            K: latestData.potassium || 0,
            temperature: latestData.weather?.temperature || 25,
            humidity: latestData.weather?.humidity || 70,
            ph: latestData.ph || 7,
            rainfall: latestData.weather?.precipitation || 0,
          };
          const defaultPrediction = formatPredictionData(
            { recommended_amount: 514.3 },
            sensorData
          );
          await mlService.addRecommendation(defaultPrediction);
        }
      }
    });

    return unsubscribe;
  },

  /**
   * Get fertilizer prediction based on latest preprocessed data
   * @returns {Promise<Object>} Prediction result
   */
  predictFertilizerFromLatest: async () => {
    try {
      // Get the latest preprocessed data
      const preprocessedCollection = collection(db, "preprocessed-data");
      const latestQuery = query(
        preprocessedCollection,
        orderBy("timestamp", "desc"),
        limit(1)
      );

      const latestSnapshot = await getDocs(latestQuery);
      if (latestSnapshot.empty) {
        throw new Error("No preprocessed data available");
      }

      const latestData = latestSnapshot.docs[0].data();
      const forecast = latestData.forecast?.[0] || {};

      // Format data for prediction
      const sensorData = {
        N: latestData.nitrogen || 0,
        P: latestData.phosphorus || 0,
        K: latestData.potassium || 0,
        temperature:
          forecast.temperature || latestData.weather?.temperature || 25,
        humidity: forecast.humidity || latestData.weather?.humidity || 70,
        ph: latestData.ph || 7,
        rainfall:
          forecast.precipitation || latestData.weather?.precipitation || 0,
      };

      // Validate sensor data before sending
      const validatedData = validateSensorData(sensorData);

      console.log("Sending sensor data to API:", validatedData); // Debug log

      // Send to prediction endpoint
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText); // Debug log
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const prediction = await response.json();
      console.log("Received prediction from API:", prediction); // Debug log

      // Format and store the prediction in the database
      const formattedPrediction = formatPredictionData(
        prediction,
        validatedData
      );
      await mlService.addRecommendation(formattedPrediction);

      return formattedPrediction;
    } catch (error) {
      console.error("Error predicting fertilizer:", error);
      // Re-throw the error to be handled by the caller
      throw error;
    }
  },

  /**
   * Get fertilizer prediction based on soil data
   * @param {Object} sensorData - Soil sensor data
   * @returns {Promise<Object>} Prediction result
   */
  predictFertilizer: async (sensorData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sensorData),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const prediction = await response.json();

      // Format and store the prediction in the database
      const formattedPrediction = formatPredictionData(prediction, sensorData);
      await mlService.addRecommendation(formattedPrediction);

      return formattedPrediction;
    } catch (error) {
      console.error("Error predicting fertilizer:", error);
      throw error;
    }
  },

  /**
   * Get the latest recommendation from API
   * @returns {Promise<Object>} Latest recommendation data
   */
  getLatestRecommendation: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/recommendation`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching recommendation:", error);
      throw error;
    }
  },

  /**
   * Train the model (admin function)
   * @returns {Promise<Object>} Training result
   */
  trainModel: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/train`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error training model:", error);
      throw error;
    }
  },

  /**
   * Check API health
   * @returns {Promise<boolean>} API health status
   */
  checkHealth: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error("API health check failed:", error);
      return false;
    }
  },
};

export default apiService;
