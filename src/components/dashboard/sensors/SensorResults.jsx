import { useState, useEffect } from "react";
import { sensorService } from "../../../services/api/sensorService";

const SensorResults = () => {
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const data = await sensorService.getSensorResults();
        setSensorData(data);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSensorData();
  }, []);

  if (loading) {
    return <div>Loading sensor data...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-bold mb-2">Sensor Results</h2>
      <div className="grid grid-cols-3 gap-4">
        {sensorData.map((sensor, index) => (
          <div key={index} className="bg-gray-200 p-3 rounded-lg text-center">
            <p className="font-bold">{sensor.value}</p>
            <p>{sensor.label}</p>
            <p className="text-green-600">{sensor.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SensorResults;
