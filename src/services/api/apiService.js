// src/services/apiService.js

const API_BASE_URL =
  "http://AgriRoot-env-1.eba-wusizhpp.ap-southeast-2.elasticbeanstalk.com";

export const apiService = {
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

      return await response.json();
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
