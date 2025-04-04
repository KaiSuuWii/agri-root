import { fertilizers } from "../../../models/fertilizerData";

function RightSidebar() {
  return (
    <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold">Type of Crop: Corn</h2>
      <h3 className="mt-4 font-semibold">Suggested Fertilizers:</h3>
      {fertilizers.map((fertilizer, index) => (
        <div key={index} className="mb-2 p-3 bg-gray-100 rounded-lg shadow-sm">
          {index + 1}. {fertilizer}
        </div>
      ))}
      <button className="mt-4 bg-black text-white p-2 rounded-lg">
        View Full Recommendation
      </button>
    </div>
  );
}

export default RightSidebar;
