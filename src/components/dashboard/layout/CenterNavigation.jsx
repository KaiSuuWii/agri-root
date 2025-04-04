import SensorResults from "../sensors/SensorResults";
// import Fertilizers from "../fertilizers/Fertilizers";
import MapPlacement from "../map/MapPlacement";

const CenterNavigation = () => {
  return (
    <div className="flex-1 mx-4 md:mx-6 space-y-4">
      {/* Mobile: Full width, Desktop: Maintains spacing */}
      <div className="w-full">
        <SensorResults />
      </div>

      {/* Two column layout for fertilizers and map on larger screens */}
      <div className="grid grid-cols-1 gap-x-4">
        {/* <div className="w-full">
          <Fertilizers />
        </div> */}
        <div className="w-full">
          <MapPlacement />
        </div>
      </div>
    </div>
  );
};

export default CenterNavigation;
