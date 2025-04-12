/**
 * @typedef {Object} WeatherData
 * @property {string} label - The weather parameter name
 * @property {string} value - The current value
 */

/**
 * @type {WeatherData[]}
 */
class WeatherData {
  constructor(temperature, humidity, precipitation, weather, description) {
    this.temperature = temperature || 0;
    this.humidity = humidity || 0;
    this.precipitation = precipitation || 0;
    this.weather = weather || "null";
    this.description = description || "null";
  }

  static fromAPI(apiData) {
    const mainData = apiData.list[0];
    return new WeatherData(
      mainData.main.temp,
      mainData.main.humidity,
      mainData.rain ? mainData.rain["3h"] || 0 : 0,
      mainData.weather[0].main,
      mainData.weather[0].description
    );
  }

  toFirestore() {
    return {
      temperature: this.temperature,
      humidity: this.humidity,
      precipitation: this.precipitation,
      weather: this.weather,
      description: this.description,
    };
  }
}

export default WeatherData;
