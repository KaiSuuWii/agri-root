import PropTypes from "prop-types";

const DonutChart = ({ value, max, label, status, idealRange }) => {
  const percentage = (value / max) * 100;

  const getStatusColor = (status) => {
    if (status === "Optimal") return "border-green-500";
    if (status === "Unknown") return "border-gray-400";
    if (status.startsWith("Slightly")) return "border-yellow-500";
    if (status === "Low" || status === "High") return "border-red-500";
    return "border-gray-400";
  };

  const getStatusBadgeStyle = (status) => {
    if (status === "Optimal") return "bg-green-100 text-green-800";
    if (status === "Unknown") return "bg-gray-100 text-gray-800";
    if (status.startsWith("Slightly")) return "bg-red-100 text-yellow-800";
    if (status === "Low" || status === "High") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white p-3 rounded-lg">
      <div className="flex items-start gap-3">
        {/* Donut Chart */}
        <div className="relative w-24 h-24 flex-shrink-0 -rotate-90">
          <div
            className={`w-full h-full rounded-full border-[17px] ${getStatusColor(
              status
            )}`}
            style={{
              clipPath: `polygon(0 0, 100% 0, 100% ${percentage}%, 0 ${percentage}%)`,
            }}
          ></div>
          <div
            className="w-full h-full rounded-full border-[17px] border-gray-200 absolute top-0"
            style={{
              clipPath: `polygon(0 ${percentage}%, 100% ${percentage}%, 100% 100%, 0 100%)`,
            }}
          ></div>

          {/* Percentage in Center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center rotate-90">
            <span className="text-lg font-bold">{value}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold mb-1.5">{label}</h3>
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs ${getStatusBadgeStyle(
              status
            )}`}
          >
            {status}
          </span>
          <p className="text-[10px] text-gray-600 mt-1">
            Ideal Range: {idealRange}
          </p>
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
