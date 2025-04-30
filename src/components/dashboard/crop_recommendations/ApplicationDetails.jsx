import PropTypes from "prop-types";

const ApplicationDetails = ({ applicationData, lotSize }) => {
  const calculateFertilizerAmount = (quantity) => {
    if (!quantity) return "0.00";
    return (quantity * lotSize).toFixed(2);
  };

  if (!applicationData) return null;

  return (
    <div className="border-t pt-4">
      <h4 className="font-semibold text-gray-800">
        Current Application Details:
      </h4>
      <div className="space-y-2 mt-2">
        <div>
          <p className="text-sm font-medium text-gray-700">
            Amount for this application:
          </p>
          <p className="text-gray-600">
            {calculateFertilizerAmount(applicationData.quantity)} kg (
            {applicationData.percentage})
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">When to apply:</p>
          <p className="text-gray-600">{applicationData.timing}</p>
        </div>
      </div>
    </div>
  );
};

ApplicationDetails.propTypes = {
  applicationData: PropTypes.shape({
    quantity: PropTypes.number.isRequired,
    percentage: PropTypes.string.isRequired,
    timing: PropTypes.string.isRequired,
  }),
  lotSize: PropTypes.number.isRequired,
};

export default ApplicationDetails;
