import { useState, useEffect } from "react";
import { soilDataService } from "../services/api/soilDataService";
import { SensorReading } from "../models/SensorReading";

export const useSensorData = () => {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = soilDataService.subscribeToReadings((readings) => {
      if (readings && readings.length > 0) {
        // Convert raw data to SensorReading model
        const latestReading = new SensorReading(readings[0]);
        setSensorData(latestReading);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { sensorData, loading };
};
