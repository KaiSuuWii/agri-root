import { useState } from "react";
import { Marker, useMapEvents } from "react-leaflet";
import PropTypes from "prop-types";

const DrawingControl = ({ mode, onCenterSet, onPointAdd }) => {
  const [mousePos, setMousePos] = useState(null);

  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      if (mode === "setCenter") {
        onCenterSet([lat, lng]);
      } else if (mode === "drawPolygon") {
        onPointAdd([lat, lng]);
      }
    },
    mousemove: (e) => {
      if (mode === "setCenter") {
        setMousePos([e.latlng.lat, e.latlng.lng]);
      }
    },
    mouseout: () => {
      setMousePos(null);
    },
  });

  return mode === "setCenter" && mousePos ? (
    <Marker position={mousePos} opacity={0.5} />
  ) : null;
};

DrawingControl.propTypes = {
  mode: PropTypes.oneOf(["setCenter", "drawPolygon"]).isRequired,
  onCenterSet: PropTypes.func.isRequired,
  onPointAdd: PropTypes.func.isRequired,
};

export default DrawingControl;
