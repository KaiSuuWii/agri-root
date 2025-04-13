import { useState, useEffect } from "react";
import {
  fetchWeatherForecast,
  subscribeToForecastUpdates,
} from "../../../services/api/forecastService";
import ForecastCard from "./ForecastCard";

export const Forecast = () => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        await fetchWeatherForecast();
      } catch (error) {
        console.error("Error fetching forecast:", error);
      } finally {
        setLoading(false);
      }
    };

    // Listen to the latest forecast from Firebase
    const unsubscribe = subscribeToForecastUpdates((data) => {
      setForecastData(data);
      setLoading(false);
    });

    // Fetch new forecast data every hour
    fetchForecast();
    const interval = setInterval(fetchForecast, 3600000);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading forecast...</div>;
  }

  return (
    <div className="bg-[#0F4D19]/47 rounded-lg p-4">
      <h3 className="text-lg font-bold mb-2 text-white">5-Day Forecast</h3>
      <div className="flex-col gap-2 space-y-1">
        {forecastData?.slice(0, 5).map((forecast, index) => (
          <ForecastCard key={index} forecast={forecast} />
        ))}
      </div>
    </div>
  );
};
