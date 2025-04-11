// import { fertilizers } from "../../../models/fertilizerData";
import cornImage from "../../../assets/images/corn.png";

function RightSidebar() {
  return (
    <div className="w-full md:w-90 bg-[#0F4D19]/47 p-2 rounded-lg">
      <div className="text-center mb-4">
        <h2 className="text-base text-white font-bold">Type of Crop: Corn</h2>
        <div className="w-32 h-32 mx-auto my-2 rounded-full overflow-hidden bg-white">
          <img
            src={cornImage}
            alt="Corn crop"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="px-2">
        <h3 className="my-2 text-lg text-center text-white font-semibold">
          AI Suggestion
        </h3>
        <div className="h-50 overflow-y-auto bg-white rounded-lg"></div>
      </div>
    </div>
  );
}

export default RightSidebar;
