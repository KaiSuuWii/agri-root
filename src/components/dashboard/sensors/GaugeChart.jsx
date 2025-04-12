import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import PropTypes from "prop-types";

const GaugeChart = ({ value, min, max, status }) => {
  // Convert value to percentage
  const percentage = ((value - min) / (max - min)) * 100;
  const normalizedValue = Math.min(Math.max(percentage, 0), 100);

  const data = [
    { name: "value", value: normalizedValue },
    { name: "remaining", value: 100 - normalizedValue },
  ];

  const colors = {
    Optimal: "#22c55e", // Green
    High: "#fbbf24", // Yellow
    Low: "#fbbf24", // Yellow
    "Extremely High": "#ef4444", // Red
    "Extremely Low": "#ef4444", // Red
    Unknown: "#94a3b8", // Gray
  };

  return (
    <ResponsiveContainer width="100%" height={80}>
      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <Pie
          data={data}
          cx="50%"
          cy="100%"
          startAngle={180}
          endAngle={0}
          innerRadius={35}
          outerRadius={45}
          paddingAngle={0}
          dataKey="value"
        >
          <Cell fill={colors[status]} strokeWidth={0} />
          <Cell fill="#e5e7eb" strokeWidth={0} />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

GaugeChart.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  status: PropTypes.oneOf([
    "Optimal",
    "High",
    "Low",
    "Extremely High",
    "Extremely Low",
    "Unknown",
  ]).isRequired,
};

export default GaugeChart;
