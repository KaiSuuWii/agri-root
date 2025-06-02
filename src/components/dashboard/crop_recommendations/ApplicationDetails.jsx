import PropTypes from "prop-types";

const ApplicationDetails = ({ applicationData, lotSize }) => {
  const calculateFertilizerAmount = (quantity) => {
    if (!quantity) return "0.00";
    return (quantity * lotSize).toFixed(2);
  };

  if (!applicationData) return null;

  return (
    <div className="space-y-2">
      <div>
        <p className="text-base font-medium">Amount for this application:</p>
        <p className="text-gray-600">
          {calculateFertilizerAmount(applicationData.quantity)} kg
          {applicationData.percentage ? ` (${applicationData.percentage})` : ""}
        </p>
      </div>
      <div>
        <p className="text-base font-medium">When to apply:</p>
        <p className="text-gray-600">
          {applicationData.timing || applicationData.notes}
        </p>
      </div>
    </div>
  );
};

ApplicationDetails.propTypes = {
  applicationData: PropTypes.shape({
    quantity: PropTypes.number.isRequired,
    percentage: PropTypes.string,
    timing: PropTypes.string,
    notes: PropTypes.string,
  }),
  lotSize: PropTypes.number.isRequired,
};

export default ApplicationDetails;
