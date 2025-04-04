import { useState, useEffect } from "react";
import { weatherService } from "../../../services/api/weatherService";

const Sidebar = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await weatherService.getWeatherData();
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (loading) {
    return <div>Loading weather data...</div>;
  }

  return (
    <div className="w-full md:w-1/4 bg-green-200/80 p-4 rounded-lg shadow-md mb-4 md:mb-0">
      <h1 className="text-3xl font-extrabold text-[#C8AE7E] mb-4">Agri-Root</h1>
      {weatherData.map((item, index) => (
        <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow-sm">
          {item.label}: <span className="font-bold">{item.value}</span>
        </div>
      ))}
      <button className="mt-4 bg-black text-white p-2 rounded-lg">
        Need Help
      </button>
    </div>
  );
};

export default Sidebar;
