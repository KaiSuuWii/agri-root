import SensorResults from "../sensors/SensorResults";
// import Fertilizers from "../fertilizers/Fertilizers";
import MapPlacement from "../map/MapPlacement";

const CenterNavigation = () => {
  return (
    <div className="flex-1 mx-2 space-y-2 min-w-0">
      {/* Mobile: Full width, Desktop: Maintains spacing */}
      <div className="w-full">
        <SensorResults />
      </div>

      {/* Two column layout for fertilizers and map on larger screens */}
      <div className="w-full">
        <MapPlacement />
      </div>
    </div>
  );
};

export default CenterNavigation;
