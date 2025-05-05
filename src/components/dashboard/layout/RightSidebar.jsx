import { useState, useEffect } from "react";
import PropTypes from "prop-types";
// import { fertilizers } from "../../../models/fertilizerData";
import cornImage from "../../../assets/images/corn.png";
import { mlService } from "../../../services/api/mlService";
import CropInfo from "../crop_recommendations/CropInfo";
import ApplicationSchedule from "../crop_recommendations/ApplicationSchedule";
import FertilizerDetails from "../crop_recommendations/FertilizerDetails";
import ApplicationDetails from "../crop_recommendations/ApplicationDetails";
import { useDashboard } from "../../../context/DashboardContext";
import { processRecommendationForArea } from "../../../utils/areaCalculations";

const RightSidebar = ({ lotSize = 1 }) => {
  const { mode, hasDrawnPlot, hasSelectedArea, selectedAreaData } =
    useDashboard();
  const [recommendation, setRecommendation] = useState(null);
  const [applicationTiming, setApplicationTiming] = useState("basal");

  useEffect(() => {
    if (mode === "scan" && hasDrawnPlot) {
      const unsubscribe = mlService.subscribeToRecommendations((data) => {
        console.log("Received ML recommendation:", data);
        const processedRecommendation = processRecommendationForArea(
          data,
          lotSize
        );
        setRecommendation(processedRecommendation);
      });
      return () => unsubscribe();
    } else if (mode === "view" && hasSelectedArea && selectedAreaData) {
      const processedRecommendation = processRecommendationForArea(
        selectedAreaData.recommendation,
        lotSize
      );
      setRecommendation(processedRecommendation);
    }
  }, [mode, selectedAreaData, hasDrawnPlot, hasSelectedArea, lotSize]);

  const renderContent = () => {
    if (mode === "scan" && !hasDrawnPlot) {
      return (
        <p className="text-gray-500 text-center">
          Draw an area on the map to get recommendations
        </p>
      );
    }

    if (mode === "view" && !hasSelectedArea) {
      return (
        <p className="text-gray-500 text-center">
          Select an area to view recommendations
        </p>
      );
    }

    if (!recommendation) {
      return (
        <p className="text-gray-500 text-center">
          {mode === "view"
            ? "No historical recommendations available"
            : "No recommendations available"}
        </p>
      );
    }

    return (
      <div className="space-y-4">
        <ApplicationSchedule
          value={applicationTiming}
          onChange={setApplicationTiming}
        />
        <FertilizerDetails
          recommendation={recommendation}
          lotSize={mode === "scan" ? lotSize : selectedAreaData?.lotSize || 1}
        />
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-800">Application Schedule:</h4>
          <div className="mt-2">
            {applicationTiming === "basal" && (
              <ApplicationDetails
                applicationData={
                  recommendation.quantity_recommendation.application_schedule
                    .basal
                }
                lotSize={
                  mode === "scan" ? lotSize : selectedAreaData?.lotSize || 1
                }
              />
            )}
            {applicationTiming === "first_top_dressing" && (
              <ApplicationDetails
                applicationData={
                  recommendation.quantity_recommendation.application_schedule
                    .first_top_dressing
                }
                lotSize={
                  mode === "scan" ? lotSize : selectedAreaData?.lotSize || 1
                }
              />
            )}
            {applicationTiming === "second_top_dressing" && (
              <ApplicationDetails
                applicationData={
                  recommendation.quantity_recommendation.application_schedule
                    .second_top_dressing
                }
                lotSize={
                  mode === "scan" ? lotSize : selectedAreaData?.lotSize || 1
                }
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full md:w-90 bg-[#0F4D19]/47 p-2 rounded-lg h-full flex flex-col">
      <CropInfo cropName="Corn" cropImage={cornImage} />

      <div className="px-2 flex-grow">
        <h3 className="my-2 text-lg text-center text-white font-semibold">
          {mode === "view" ? "Historical AI Suggestion" : "Live AI Suggestion"}
        </h3>
        <div className="bg-white rounded-lg p-4 h-full overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

RightSidebar.propTypes = {
  lotSize: PropTypes.number,
};

export default RightSidebar;
