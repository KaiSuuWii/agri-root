import PropTypes from "prop-types";

const ForecastCard = ({ forecast }) => {
  return (
    <div className="bg-gray-100/90 rounded-lg p-2 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img
          src={`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`}
          alt={forecast.description}
          className="w-8 h-8"
        />
        <div>
          <div className="text-sm font-semibold capitalize">
            {forecast.weather}
          </div>
          <div className="text-base font-semibold">{forecast.temp}°</div>
        </div>
      </div>

      <div className="flex-1 justify-start px-4">
        <div className="text-xs">
          <span className="text-gray-600">Precipitation:</span>{" "}
          {forecast.precipitation}%
        </div>
        <div className="text-xs">
          <span className="text-gray-600">Humidity:</span> {forecast.humidity}%
        </div>
      </div>

      <div className="text-right">
        <div className="text-sm font-light">
          {new Date(forecast.dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </div>
        <div className="text-xs font-bold">
          {new Date(forecast.dateString).toLocaleDateString("en-US", {
            weekday: "long",
          })}
        </div>
      </div>
    </div>
  );
};

ForecastCard.propTypes = {
  forecast: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    weather: PropTypes.string.isRequired,
    temp: PropTypes.number.isRequired,
    precipitation: PropTypes.number.isRequired,
    humidity: PropTypes.number.isRequired,
    dateString: PropTypes.string.isRequired,
  }).isRequired,
};

export default ForecastCard;
