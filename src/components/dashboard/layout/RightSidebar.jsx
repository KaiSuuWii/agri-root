import { useState, useEffect } from "react";
import PropTypes from "prop-types";
// import { fertilizers } from "../../../models/fertilizerData";
import cornImage from "../../../assets/images/corn.png";
import { mlService } from "../../../services/api/mlService";
import CropInfo from "../crop_recommendations/CropInfo";
import ApplicationSchedule from "../crop_recommendations/ApplicationSchedule";
import FertilizerDetails from "../crop_recommendations/FertilizerDetails";
import ApplicationDetails from "../crop_recommendations/ApplicationDetails";

const RightSidebar = ({ lotSize = 1, mode = "scan", areaData = null }) => {
  const [recommendation, setRecommendation] = useState(null);
  const [applicationTiming, setApplicationTiming] = useState("basal");

  useEffect(() => {
    if (mode === "scan") {
      const unsubscribe = mlService.subscribeToRecommendations((data) => {
        console.log("Received ML recommendation:", data);
        setRecommendation(data);
      });
      return () => unsubscribe();
    } else if (mode === "view" && areaData) {
      setRecommendation(areaData.recommendation);
    }
  }, [mode, areaData]);

  const getCurrentApplicationData = () => {
    if (!recommendation?.quantity_recommendation?.application_schedule)
      return null;
    return recommendation.quantity_recommendation.application_schedule[
      applicationTiming
    ];
  };

  const applicationData = getCurrentApplicationData();

  return (
    <div className="w-full md:w-90 bg-[#0F4D19]/47 p-2 rounded-lg h-full flex flex-col">
      <CropInfo cropName="Corn" cropImage={cornImage} />

      <div className="px-2 flex-grow">
        <h3 className="my-2 text-lg text-center text-white font-semibold">
          {mode === "view" ? "Historical AI Suggestion" : "Live AI Suggestion"}
        </h3>
        <div className="bg-white rounded-lg p-4 h-full overflow-y-auto">
          {recommendation ? (
            <div className="space-y-4">
              <ApplicationSchedule
                value={applicationTiming}
                onChange={setApplicationTiming}
              />

              <FertilizerDetails
                recommendation={recommendation}
                lotSize={lotSize}
              />

              <ApplicationDetails
                applicationData={applicationData}
                lotSize={lotSize}
              />
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              {mode === "view"
                ? "No historical recommendations available"
                : "No recommendations available"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

RightSidebar.propTypes = {
  lotSize: PropTypes.number,
  mode: PropTypes.oneOf(["scan", "view"]),
  areaData: PropTypes.object,
};

export default RightSidebar;
