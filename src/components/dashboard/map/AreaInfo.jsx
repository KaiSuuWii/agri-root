import PropTypes from "prop-types";

const AreaInfo = ({ lotSize, pointsPlaced }) => {
  return (
    <div className="text-white">
      {lotSize && (
        <p>
          Area: {lotSize.hectares.toFixed(2)} hectares (
          {lotSize.squareMeters.toFixed(2)} m²)
        </p>
      )}
      {pointsPlaced > 0 && <p>Points placed: {pointsPlaced}</p>}
    </div>
  );
};

AreaInfo.propTypes = {
  lotSize: PropTypes.shape({
    hectares: PropTypes.number,
    squareMeters: PropTypes.number,
  }),
  pointsPlaced: PropTypes.number,
};

export default AreaInfo;
