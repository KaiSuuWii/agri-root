import PropTypes from "prop-types";

export const WeatherDesc = ({ weather, description, date }) => (
  <div className="bg-white rounded-lg p-3 shadow-sm mb-2">
    <div className="mb-2">
      <p className="text-xs text-gray-600">
        Brgy. Kibangay, Lantapan, Bukidnon
      </p>
      <p className="text-[10px] text-gray-500">
        {new Date(date).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
    <div>
      <p className="text-sm font-bold text-gray-900 capitalize">{weather}</p>
      <p className="text-xs text-gray-600 capitalize">{description}</p>
    </div>
  </div>
);

WeatherDesc.propTypes = {
  weather: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  date: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]).isRequired,
};

export default WeatherDesc;
