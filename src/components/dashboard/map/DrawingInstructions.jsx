import PropTypes from "prop-types";

const DrawingInstructions = ({ drawingMode }) => {
  return (
    <div className="absolute top-4 left-4 bg-white p-2 rounded shadow z-[1000]">
      <p className="text-sm">
        {drawingMode === "setCenter"
          ? "Click on the map to set the center point"
          : "Click to add polygon points. Double-click last point to finish"}
      </p>
    </div>
  );
};

DrawingInstructions.propTypes = {
  drawingMode: PropTypes.oneOf(["setCenter", "drawPolygon"]),
};

export default DrawingInstructions;
