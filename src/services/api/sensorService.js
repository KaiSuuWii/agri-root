import { sensorResults } from "../../models/sensorData";

export const sensorService = {
  /**
   * Get all sensor results
   * @returns {Promise<Array>} Array of sensor results
   */
  getSensorResults: async () => {
    // In a real app, this would be an API call
    return sensorResults;
  },

  /**
   * Get sensor result by label
   * @param {string} label - The sensor label
   * @returns {Promise<Object>} Sensor result
   */
  getSensorByLabel: async (label) => {
    const result = sensorResults.find((sensor) => sensor.label === label);
    return result || null;
  },
};
