import PropTypes from "prop-types";
import MapView from "./MapView";

const MapPlacement = ({ onLotSizeChange, onAreaSelect }) => {
  return (
    <MapView onLotSizeChange={onLotSizeChange} onAreaSelect={onAreaSelect} />
  );
};

MapPlacement.propTypes = {
  onLotSizeChange: PropTypes.func.isRequired,
  onAreaSelect: PropTypes.func,
};

export default MapPlacement;
