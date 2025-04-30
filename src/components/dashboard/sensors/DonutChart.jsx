import PropTypes from "prop-types";

const DonutChart = ({ value, max, label, status, idealRange }) => {
  const percentage = (value / max) * 100;

  const getStatusColor = (status) => {
    if (status === "Optimal") return "border-green-500";
    if (status === "Unknown") return "border-gray-400";
    if (status === "Acidic") return "border-yellow-500";
    if (status === "Low" || status === "High") return "border-red-500";
    return "border-gray-400";
  };

  const getStatusBadgeStyle = (status) => {
    if (status === "Optimal") return "bg-green-100 text-green-800";
    if (status === "Unknown") return "bg-gray-100 text-gray-800";
    if (status === "Acidic") return "bg-yellow-100 text-yellow-800";
    if (status === "Low" || status === "High") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Donut Chart */}
        <div className="relative w-24 h-24 flex-shrink-0 -rotate-90">
          <div
            className={`w-full h-full rounded-full border-[16px] ${getStatusColor(
              status
            )}`}
            style={{
              clipPath: `polygon(0 0, 100% 0, 100% ${percentage}%, 0 ${percentage}%)`,
            }}
          ></div>
          <div
            className="w-full h-full rounded-full border-[16px] border-gray-200 absolute top-0"
            style={{
              clipPath: `polygon(0 ${percentage}%, 100% ${percentage}%, 100% 100%, 0 100%)`,
            }}
          ></div>

          {/* Value in Center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center rotate-90">
            <span className="text-base font-bold">{value}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-sm font-semibold mb-1">{label}</h3>
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs leading-none ${getStatusBadgeStyle(
              status
            )}`}
          >
            {status}
          </span>
          <p className="text-xs text-gray-600 mt-1">Ideal: {idealRange}</p>
        </div>
      </div>
    </div>
  );
};

DonutChart.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  idealRange: PropTypes.string.isRequired,
};

export default DonutChart;
