import { WiThermometer, WiHumidity, WiRaindrops } from "react-icons/wi";
import { useWeatherData } from "../../../hooks/useWeatherData";
import { weatherService } from "../../../services/api/weatherService";
import { useEffect } from "react";
import WeatherCard from "./WeatherCard";
import WeatherDesc from "./WeatherDesc";

export const Weather = () => {
  const { weatherData, loading, error } = useWeatherData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await weatherService.fetchWeatherData();
      } catch (err) {
        console.error("Error fetching initial weather data:", err);
      }
    };
    fetchData();

    const interval = setInterval(async () => {
      try {
        await weatherService.fetchWeatherData();
      } catch (err) {
        console.error("Error fetching weather data:", err);
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-2">
        <p className="text-xs text-gray-600">Loading weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2">
        <p className="text-xs text-red-500">Error loading weather data</p>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="p-2">
        <p className="text-xs text-gray-600">No weather data available</p>
      </div>
    );
  }

  const weatherCards = [
    {
      icon: WiThermometer,
      title: "Temperature",
      value: weatherData.temperature.toFixed(1),
      unit: "°C",
    },
    {
      icon: WiHumidity,
      title: "Humidity",
      value: weatherData.humidity,
      unit: "%",
    },
    {
      icon: WiRaindrops,
      title: "Precipitation",
      value: weatherData.precipitation,
      unit: "mm",
    },
  ];

  return (
    <div className="p-4 bg-[#0F4D19]/47 rounded-lg">
      <h2 className="text-lg font-bold text-white mb-2">Weather Conditions</h2>
      <div>
        <WeatherDesc
          weather={weatherData.weather}
          description={weatherData.description}
          date={weatherData.timestamp}
        />
        {weatherCards.map((card, index) => (
          <WeatherCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default Weather;
