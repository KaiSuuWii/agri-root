import { useSensorData } from "../../../hooks/useSensorData";
import { SensorReading } from "../../../models/SensorReading";
import DonutChart from "./DonutChart";

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
    <div className="">
      <h2 className="text-lg text-[#00441B] font-bold font-poppins mb-2">
        Soil Health Analysis
      </h2>

      {/* Sensor Results Grid */}
      <div className="bg-[#0F4D19]/47 p-4 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sensorResults.map((sensor, index) => (
            <DonutChart
              key={index}
              value={parseInt(sensor.value)}
              max={sensor.max}
              label={sensor.label}
              status={sensor.status}
              idealRange={sensor.ideal}
            />
          ))}
        </div>
        {sensorData?.timestamp && (
          <p className="text-[10px] text-white mt-2">
            Last updated: {sensorData.getFormattedTimestamp()}
          </p>
        )}
      </div>

      {/* Timestamp */}
    </div>
  );
};

export default SensorResults;
