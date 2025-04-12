import { useState } from "react";
import { useFertilizerRecommendation } from "../../../hooks/useFertilizerRecommendation";
import { useSensorData } from "../../../hooks/useSensorData";

function Fertilizers() {
  const { sensorData } = useSensorData();
  const { recommendation, loading, error, predictFertilizer } = useFertilizerRecommendation();
  const [predicting, setPredicting] = useState(false);

  const handleGetRecommendation = async () => {
    if (!sensorData) return;
    
    try {
      setPredicting(true);
      
      // Format sensor data for API
      const formattedData = {
        N: sensorData.nitrogen || 65,
        P: sensorData.phosphorous || 30,
        K: sensorData.potassium || 70,
        temperature: sensorData.temperature || 27.5,
        humidity: sensorData.humidity || 55,
        ph: sensorData.soil_ph || 6.2,
        rainfall: sensorData.rainfall || 680
      };
      
      await predictFertilizer(formattedData);
    } catch (err) {
      console.error("Error getting recommendation:", err);
    } finally {
      setPredicting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Fertilizer Recommendation</h2>
        <button 
          onClick={handleGetRecommendation}
          disabled={predicting || !sensorData}
          className="bg-black text-white px-3 py-1 rounded-lg text-sm hover:bg-black/80 transition-colors disabled:bg-gray-300"
        >
          {predicting ? "Processing..." : "Get Recommendation"}
        </button>
      </div>
      
      {loading && !recommendation && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Loading recommendations...</p>
        </div>
      )}
      
      {error && !recommendation && (
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      {recommendation && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="mb-4">
            <h3 className="text-md font-semibold">Recommended Fertilizer</h3>
            <p className="text-lg font-bold text-green-700">
              {recommendation.fertilizer_type}
            </p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-md font-semibold">Application Method</h3>
            <p className="text-sm">
              {recommendation.fertilizer_application}
            </p>
          </div>
          
          {/* Show additional details if available from API */}
          {recommendation.pH_status && (
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-white p-2 rounded shadow-sm">
                <h4 className="text-xs font-semibold">pH Status</h4>
                <p className="text-sm">{recommendation.pH_status}</p>
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <h4 className="text-xs font-semibold">Rainfall Status</h4>
                <p className="text-sm">{recommendation.rainfall_status}</p>
              </div>
              {recommendation.npk_status && (
                <>
                  <div className="bg-white p-2 rounded shadow-sm">
                    <h4 className="text-xs font-semibold">Nitrogen</h4>
                    <p className="text-sm">{recommendation.npk_status.N}</p>
                  </div>
                  <div className="bg-white p-2 rounded shadow-sm">
                    <h4 className="text-xs font-semibold">Phosphorus</h4>
                    <p className="text-sm">{recommendation.npk_status.P}</p>
                  </div>
                  <div className="bg-white p-2 rounded shadow-sm">
                    <h4 className="text-xs font-semibold">Potassium</h4>
                    <p className="text-sm">{recommendation.npk_status.K}</p>
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* Timestamp if available */}
          {recommendation.timestamp && (
            <div className="mt-4 text-xs text-gray-500">
              <p>
                Updated: {new Date(recommendation.timestamp).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      )}
      
      {!recommendation && !loading && !error && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            No fertilizer recommendations available. Click Get Recommendation to generate one.
          </p>
        </div>
      )}
    </div>
  );
}

export default Fertilizers;