import PropTypes from "prop-types";

const FertilizerDetails = ({ recommendation, lotSize }) => {
  const calculateFertilizerAmount = (quantity) => {
    if (!quantity) return "0.00";
    return (quantity * lotSize).toFixed(2);
  };

  return (
    <>
      <div>
        <h4 className="font-semibold text-gray-800">Fertilizer Type:</h4>
        <p className="text-gray-600">{recommendation.fertilizer_type}</p>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800">Application Method:</h4>
        <p className="text-gray-600">{recommendation.fertilizer_application}</p>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-800">
          Total Fertilizer Required:
        </h4>
        <p className="text-gray-600">
          {recommendation.quantity_recommendation.primary_fertilizer.name}
        </p>
        <p className="text-gray-600">
          Amount:{" "}
          {calculateFertilizerAmount(
            recommendation.quantity_recommendation.primary_fertilizer.quantity
          )}{" "}
          kg
        </p>
      </div>
    </>
  );
};

FertilizerDetails.propTypes = {
  recommendation: PropTypes.shape({
    fertilizer_type: PropTypes.string.isRequired,
    fertilizer_application: PropTypes.string.isRequired,
    quantity_recommendation: PropTypes.shape({
      primary_fertilizer: PropTypes.shape({
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  lotSize: PropTypes.number.isRequired,
};

export default FertilizerDetails;
