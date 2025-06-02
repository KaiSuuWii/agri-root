import SensorResults from "../sensors/SensorResults";
// import Fertilizers from "../fertilizers/Fertilizers";
import MapPlacement from "../map/MapPlacement";
import PropTypes from "prop-types";
import { useDashboard } from "../../../context/DashboardContext";

const CenterNavigation = ({ onLotSizeChange, onAreaSelect }) => {
  const { setMode, setHasSelectedArea, setSelectedAreaData } = useDashboard();

  const handleAreaSelect = (data) => {
    setMode(data.mode);
    setSelectedAreaData(data.areaData);
    setHasSelectedArea(!!data.areaData);
    if (onAreaSelect) {
      onAreaSelect(data);
    }
  };

  return (
    <div className="flex-1 mx-2 space-y-2 min-w-0">
      {/* Mobile: Full width, Desktop: Maintains spacing */}
      <div className="w-full">
        <SensorResults />
      </div>

      {/* Two column layout for fertilizers and map on larger screens */}
      <div className="w-full">
        <MapPlacement
          onLotSizeChange={onLotSizeChange}
          onAreaSelect={handleAreaSelect}
        />
      </div>
    </div>
  );
};

CenterNavigation.propTypes = {
  onLotSizeChange: PropTypes.func.isRequired,
  onAreaSelect: PropTypes.func,
};

export default CenterNavigation;
