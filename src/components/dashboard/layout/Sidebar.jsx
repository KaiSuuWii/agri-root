import { Weather } from "../weather/Weather";
import { Forecast } from "../weather/Forecast";

const Sidebar = () => {
  return (
    <div className="w-full md:w-96 rounded-lg">
      {/* Weather Component */}
      <div className="rounded-lg">
        <div className="mb-2">
          <Weather />
        </div>
        <Forecast />
      </div>

      <button className="mt-2 bg-black text-white p-1.5 rounded-lg w-full hover:bg-black/80 transition-colors text-sm">
        Need Help
      </button>
    </div>
  );
};

export default Sidebar;
