/**
 * @typedef {Object} SensorData
 * @property {string} label - The name of the sensor
 * @property {string} value - The current value
 * @property {string} status - The health status
 */

/**
 * @type {SensorData[]}
 */
export const sensorResults = [
  { label: "Nitrogen", value: "54%", status: "Healthy" },
  { label: "Phosphorous", value: "67%", status: "Healthy" },
  { label: "Potassium", value: "34%", status: "Healthy" },
];
