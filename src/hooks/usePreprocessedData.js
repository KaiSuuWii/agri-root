import { useState, useEffect } from "react";
import { preprocessedDataService } from "../services/api/preprocessedDataService";

export const usePreprocessedData = (days = 7) => {
  const [preprocessedData, setPreprocessedData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = preprocessedDataService.subscribeToPreprocessedData(
      (data) => {
        setPreprocessedData(data);
        setLoading(false);
      }
    );

    // Fetch historical data
    const fetchHistoricalData = async () => {
      try {
        setLoading(true);
        const data = await preprocessedDataService.getHistoricalData(days);
        setHistoricalData(data);
      } catch (err) {
        console.error("Error fetching historical data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [days]);

  return { preprocessedData, historicalData, loading, error };
};
