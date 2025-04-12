import { useState, useEffect } from "react";
import { mlService } from "../services/api/mlService";
import apiService from "../services/api/apiService";

export const useFertilizerRecommendation = () => {
  const [firebaseRec, setFirebaseRec] = useState(null);
  const [apiRec, setApiRec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get data from Firebase
  useEffect(() => {
    const fetchFirebaseData = async () => {
      try {
        const data = await mlService.getLatestRecommendation();
        setFirebaseRec(data);
      } catch (err) {
        console.error("Firebase error:", err);
      }
    };

    fetchFirebaseData();
    
    // Set up real-time updates from Firebase
    const unsubscribe = mlService.subscribeToRecommendations((data) => {
      setFirebaseRec(data);
    });
    
    return () => unsubscribe();
  }, []);

  // Get data from AWS API
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        setLoading(true);
        const data = await apiService.getLatestRecommendation();
        setApiRec(data);
        setError(null);
      } catch (err) {
        console.error("API error:", err);
        // Don't set error if we have Firebase data as fallback
        if (!firebaseRec) {
          setError("Could not fetch from API");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApiData();
  }, [firebaseRec]);

  // Function to get new prediction from sensor data
  const predictFertilizer = async (sensorData) => {
    try {
      setLoading(true);
      const result = await apiService.predictFertilizer(sensorData);
      setApiRec(result);
      return result;
    } catch (err) {
      setError("Prediction failed");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    firebaseRec, 
    apiRec, 
    loading, 
    error, 
    predictFertilizer,
    // Combined data with API taking precedence
    recommendation: apiRec || firebaseRec
  };
};