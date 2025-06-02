import { usePreprocessedData } from "../../../hooks/usePreprocessedData";
import { SensorReading } from "../../../models/SensorReading";
import { dataIntegrationService } from "../../../services/api/dataIntegrationService";
import { apiService } from "../../../services/api/apiService";
import { preprocessedDataService } from "../../../services/api/preprocessedDataService";
import DonutChart from "./DonutChart";
import { useEffect, useState } from "react";
import { useDashboard } from "../../../context/DashboardContext";

const SensorResults = () => {
  const { mode, hasDrawnPlot, hasSelectedArea, selectedAreaData } =
    useDashboard();
  const { preprocessedData, loading } = usePreprocessedData();
  const [sensorData, setSensorData] = useState(null);

  // Initialize data processing and prediction when in scan mode
  useEffect(() => {
    if (mode === "scan" && hasDrawnPlot) {
      const initializeProcessing = async () => {
        try {
          console.log("Starting data processing initialization...");
          const cleanup =
            await dataIntegrationService.initializeDataProcessing();
          console.log("Data processing initialized successfully");
          return cleanup;
        } catch (error) {
          console.error("Failed to initialize data processing:", error);
        }
      };

      const cleanupFn = initializeProcessing();

      return () => {
        if (cleanupFn) {
          cleanupFn.then((cleanup) => {
            if (cleanup) cleanup();
          });
        }
      };
    }
  }, [mode, hasDrawnPlot]);

  // Separate effect for real-time data subscription
  useEffect(() => {
    if (mode === "scan" && hasDrawnPlot) {
      // Subscribe to real-time preprocessed data updates
      const unsubscribePreprocessedData =
        preprocessedDataService.subscribeToPreprocessedData((newData) => {
          console.log("Received new preprocessed data:", newData);
          setSensorData(newData);
        });

      // Initialize automatic predictions
      console.log("Setting up automatic predictions...");
      const unsubscribePredict = apiService.subscribeAndPredict();

      return () => {
        unsubscribePredict();
        unsubscribePreprocessedData();
      };
    }
  }, [mode, hasDrawnPlot]);

  // Update sensor data based on mode and areaData
  useEffect(() => {
    if (mode === "view" && hasSelectedArea && selectedAreaData) {
      setSensorData(selectedAreaData.sensorData);
    } else if (mode === "scan" && hasDrawnPlot) {
      // In scan mode, always use the latest preprocessed data
      if (preprocessedData) {
        console.log(
          "Updating with latest preprocessed data:",
          preprocessedData
        );
        setSensorData(preprocessedData);
      }
    }
  }, [mode, selectedAreaData, preprocessedData, hasDrawnPlot, hasSelectedArea]);

  if (loading && mode === "scan" && hasDrawnPlot) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <p className="text-sm">Loading sensor data...</p>
      </div>
    );
  }

  // Create default sensor data when no area is selected or drawn
  const defaultSensorData = {
    nitrogen: "--",
    phosphorus: "--",
    potassium: "--",
    ph: "--",
    moisture: "--",
  };

  const isResetState =
    (mode === "scan" && !hasDrawnPlot) || (mode === "view" && !hasSelectedArea);

  const currentSensorData = isResetState
    ? defaultSensorData
    : {
        nitrogen: sensorData?.nitrogen || 0,
        phosphorus: sensorData?.phosphorus || 0,
        potassium: sensorData?.potassium || 0,
        soil_ph: sensorData?.ph || 0,
        soil_moisture: sensorData?.moisture || 0,
      };

  const sensorReading = new SensorReading(currentSensorData);

  const sensorTypes = [
    { key: "nitrogen", label: "Nitrogen" },
    { key: "phosphorus", label: "Phosphorus" },
    { key: "potassium", label: "Potassium" },
    { key: "ph", label: "pH", sensorKey: "soil_ph" },
  ];

  const sensorResults = sensorTypes.map(({ key, label, sensorKey }) => {
    const mappedKey = sensorKey || key;
    const result = sensorReading.getStatus(mappedKey);
    const value = currentSensorData[sensorKey || key];
    // If in reset state, override color to gray
    const status = isResetState ? "reset" : result.status;
    return {
      label,
      ...result,
      status,
      min: SensorReading.THRESHOLDS[mappedKey]?.min || 0,
      max: SensorReading.THRESHOLDS[mappedKey]?.max || 100,
      currentValue: value === "--" ? "--" : value || 0,
      unit: SensorReading.THRESHOLDS[mappedKey]?.unit || "",
    };
  });

  return (
    <div className="">
      <h2 className="text-lg text-[#00441B] font-bold font-poppins mb-2">
        Soil Health Analysis
      </h2>

      {/* Sensor Results Grid */}
      <div className="bg-[#0F4D19]/47 p-4 rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 gap-4">
          {sensorResults.map((sensor, index) => (
            <DonutChart
              key={index}
              value={sensor.currentValue}
              max={sensor.max}
              label={sensor.label}
              status={sensor.status}
              idealRange={sensor.ideal}
              unit={sensor.unit}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SensorResults;
