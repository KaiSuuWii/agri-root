import PropTypes from "prop-types";

const ApplicationSchedule = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Application Schedule
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded-md"
      >
        <option value="basal">Basal Application</option>
        <option value="first_top_dressing">First Top Dressing</option>
        <option value="second_top_dressing">Second Top Dressing</option>
      </select>
    </div>
  );
};

ApplicationSchedule.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ApplicationSchedule;
