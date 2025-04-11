import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../services/firebase/firebaseConfig";

export const Forecast = () => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const lat = "8.049672";
        const lon = "124.897026";
        const apiKey = "08a35c077c179370b9de692053ef20cd";

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
          throw new Error("Weather forecast fetch failed");
        }

        const data = await response.json();

        // Filter for forecasts at 15:00:00 only
        const dailyForecasts = data.list
          .filter((item) => item.dt_txt.endsWith("15:00:00"))
          .map((item) => ({
            date: new Date(item.dt * 1000),
            dateString: item.dt_txt.split(" ")[0],
            temp: Math.round(item.main.temp),
            weather: item.weather[0].main,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            humidity: item.main.humidity,
            precipitation: item.pop * 100, // Convert probability to percentage
          }));

        // Store in Firebase
        const forecastCollection = collection(db, "weather-forecast");
        await addDoc(forecastCollection, {
          forecast: dailyForecasts,
          timestamp: new Date(),
        });

        setForecastData(dailyForecasts);
      } catch (error) {
        console.error("Error fetching forecast:", error);
      } finally {
        setLoading(false);
      }
    };

    // Listen to the latest forecast from Firebase
    const forecastCollection = collection(db, "weather-forecast");
    const forecastQuery = query(
      forecastCollection,
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(forecastQuery, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setForecastData(data.forecast);
        setLoading(false);
      }
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
      <h3 className="text-lg font-semibold mb-2 text-white">5-Day Forecast</h3>
      <div className="flex-col gap-2 space-y-1">
        {forecastData?.slice(0, 5).map((forecast, index) => (
          <div
            key={index}
            className="bg-gray-100/90 rounded-lg p-2 flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <img
                src={`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`}
                alt={forecast.description}
                className="w-8 h-8"
              />
              <div>
                <div className="text-sm font-semibold capitalize">
                  {forecast.weather}
                </div>
                <div className="text-base font-semibold">{forecast.temp}°</div>
              </div>
            </div>

            <div className="flex-1 justify-start px-4">
              <div className="text-xs">
                <span className="text-gray-600">Precipitation:</span>{" "}
                {forecast.precipitation}%
              </div>
              <div className="text-xs">
                <span className="text-gray-600">Humidity:</span>{" "}
                {forecast.humidity}%
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-light">
                {new Date(forecast.dateString).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="text-xs font-bold">
                {new Date(forecast.dateString).toLocaleDateString("en-US", {
                  weekday: "long",
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
