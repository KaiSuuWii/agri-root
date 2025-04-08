import { Weather } from "../weather/Weather";

const Sidebar = () => {
  return (
    <div className="w-full md:w-1/4 bg-green-200/80 p-4 rounded-lg shadow-md mb-4 md:mb-0">
      <h1 className="text-3xl font-extrabold text-[#C8AE7E] mb-4">Agri-Root</h1>

      {/* Weather Component */}
      <div className="mb-4 bg-black/20 rounded-lg backdrop-blur-sm">
        <Weather />
      </div>

      <button className="mt-4 bg-black text-white p-2 rounded-lg w-full hover:bg-black/80 transition-colors">
        Need Help
      </button>
    </div>
  );
};

export default Sidebar;
