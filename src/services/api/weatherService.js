import { sidebarItems } from "../../models/weatherData";

export const weatherService = {
  /**
   * Get all weather data
   * @returns {Promise<Array>} Array of weather data
   */
  getWeatherData: async () => {
    // In a real app, this would be an API call to OpenWeatherMap
    return sidebarItems;
  },

  /**
   * Get weather data by label
   * @param {string} label - The weather parameter label
   * @returns {Promise<Object>} Weather data
   */
  getWeatherByLabel: async (label) => {
    const result = sidebarItems.find((item) => item.label === label);
    return result || null;
  },
};
