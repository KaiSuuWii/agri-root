import { useSensorData } from "../../../hooks/useSensorData";
import { SensorReading } from "../../../models/SensorReading";
import GaugeChart from "./GaugeChart";

const SensorResults = () => {
  const { sensorData, loading } = useSensorData();

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        Loading sensor data...
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

  const npkRatio = sensorData?.getNPKRatio() || {
    actual: "0:0:0",
    ideal: "4:2:1",
    isBalanced: false,
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-bold mb-2">Soil Health Analysis</h2>

      {/* NPK Ratio */}
      <div className="mb-4 p-3 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-1">NPK Ratio</h3>
        <div className="flex justify-between items-center">
          <div>
            <p>Current: {npkRatio.actual}</p>
            <p>Ideal: {npkRatio.ideal}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              npkRatio.isBalanced
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {npkRatio.isBalanced ? "Balanced" : "Needs Adjustment"}
          </span>
        </div>
      </div>

      {/* Sensor Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sensorResults.map((sensor, index) => (
          <div key={index} className="bg-gray-100 p-3 rounded-lg">
            <div className="flex justify-between items-start mb-0">
              <h3 className="text-lg font-semibold">{sensor.label}</h3>
              <span
                className={`px-2 py-0.5 rounded-full text-sm ${
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

            <div className="flex flex-col items-center -mt-2">
              <GaugeChart
                value={sensor.currentValue}
                min={sensor.min}
                max={sensor.max}
                status={sensor.status}
              />

              <div className="text-center -mt-2">
                <p className="text-3xl font-bold">{sensor.value}</p>
                <p className="text-sm text-gray-600">Ideal: {sensor.ideal}</p>
                <p className="text-sm mt-1">{sensor.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Timestamp */}
      {sensorData?.timestamp && (
        <p className="text-sm text-gray-500 mt-4">
          Last updated: {sensorData.getFormattedTimestamp()}
        </p>
      )}
    </div>
  );
};

export default SensorResults;
