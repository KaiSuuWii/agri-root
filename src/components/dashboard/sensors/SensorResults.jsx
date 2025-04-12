import { useSensorData } from "../../../hooks/useSensorData";
import { SensorReading } from "../../../models/SensorReading";
import GaugeChart from "./GaugeChart";

const SensorResults = () => {
  const { sensorData, loading } = useSensorData();

  if (loading) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <p className="text-sm">Loading sensor data...</p>
      </div>
    );
  }

  const sensorTypes = [
    "nitrogen",
    "phosphorous",
    "potassium",
    "soil_ph",
    "soil_moisture",
  ];

  const sensorResults = sensorTypes.map((type) => {
    const result = sensorData?.getStatus(type) || {
      status: "Unknown",
      message: "No data available",
      value: "0",
      ideal: "N/A",
    };
    return {
      label: type
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      ...result,
      min: SensorReading.THRESHOLDS[type]?.min || 0,
      max: SensorReading.THRESHOLDS[type]?.max || 100,
      currentValue: sensorData?.[type] || 0,
    };
  });

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm">
      <h2 className="text-base font-bold mb-2">Soil Health Analysis</h2>

      {/* Sensor Results Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {sensorResults.map((sensor, index) => (
          <div key={index} className="bg-gray-50 p-2 rounded-lg">
            <div className="flex justify-between items-start">
              <h3 className="text-xs font-semibold">{sensor.label}</h3>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  sensor.status === "Optimal"
                    ? "bg-green-100 text-green-800"
                    : sensor.status === "Unknown"
                    ? "bg-gray-100 text-gray-800"
                    : sensor.status.startsWith("Extremely")
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {sensor.status}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-24 h-16">
                <GaugeChart
                  value={sensor.currentValue}
                  min={sensor.min}
                  max={sensor.max}
                  status={sensor.status}
                />
              </div>

              <div className="text-center">
                <p className="text-lg font-bold leading-tight">
                  {sensor.value}
                </p>
                <p className="text-[10px] text-gray-600">
                  Ideal: {sensor.ideal}
                </p>
                <p className="text-[10px] text-gray-600 mt-0.5 line-clamp-1">
                  {sensor.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Timestamp */}
      {sensorData?.timestamp && (
        <p className="text-[10px] text-gray-500 mt-2">
          Last updated: {sensorData.getFormattedTimestamp()}
        </p>
      )}
    </div>
  );
};

export default SensorResults;
