import PropTypes from "prop-types";

export const WeatherCard = ({ icon: Icon, title, value, unit }) => (
  <div className="bg-white rounded-lg p-2 mb-2 shadow-sm">
    <div className="flex items-center">
      <Icon className="w-5 h-5 text-blue-500 mr-2" />
      <div>
        <h3 className="text-xs text-gray-600">{title}</h3>
        <p className="text-sm font-bold text-gray-900">
          {value}
          <span className="text-xs ml-1 font-medium">{unit}</span>
        </p>
      </div>
    </div>
  </div>
);

WeatherCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  unit: PropTypes.string.isRequired,
};

export default WeatherCard;
