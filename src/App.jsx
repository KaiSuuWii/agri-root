import Sidebar from "./components/Sidebar";
import SensorResults from "./components/SensorResults";
import Fertilizers from "./components/Fertilizers";
import RightSidebar from "./components/RightSidebar";

function App() {
  return (
    <div className="bg-green-300 min-h-screen p-6 flex">
      <Sidebar />
      <div className="flex-1 mx-6">
        <SensorResults />
        <Fertilizers />
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Area of Analysis</h2>
          <div className="h-40 bg-gray-300 rounded-lg flex items-center justify-center">[Map Placeholder]</div>
          <button className="mt-4 bg-gray-700 text-white p-2 rounded-lg">View Full Details</button>
        </div>
      </div>
      <RightSidebar />
    </div>
  );
}

export default App;
