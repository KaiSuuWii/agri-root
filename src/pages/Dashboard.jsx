import Sidebar from "../components/dashboard/layout/Sidebar";
// import RightSidebar from "../components/dashboard/layout/RightSidebar";
import CenterNavigation from "../components/dashboard/layout/CenterNavigation";
import Header from "../components/dashboard/layout/Header";
import RightSidebar from "../components/dashboard/layout/RightSidebar";
import { useState } from "react";

const Dashboard = () => {
  const [lotSize, setLotSize] = useState(1); // Default to 1 hectare
  const [mapMode, setMapMode] = useState("view"); // Default to view mode
  const [selectedAreaData, setSelectedAreaData] = useState(null);

  const handleAreaSelect = ({ mode, areaData }) => {
    setMapMode(mode);
    setSelectedAreaData(areaData);
    if (areaData) {
      setLotSize(areaData.lotSize);
    }
  };

  return (
    <div className="bg-[#D6ECE2] min-h-screen p-4 md:p-6">
      {/* Mobile Layout */}
      <div className="flex flex-col md:hidden space-y-4">
        <Header />
        <CenterNavigation
          onLotSizeChange={setLotSize}
          onAreaSelect={handleAreaSelect}
        />
        <Sidebar mode={mapMode} areaData={selectedAreaData} />
        <RightSidebar
          lotSize={lotSize}
          mode={mapMode}
          areaData={selectedAreaData}
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex">
        <Header />
      </div>
      <div className="hidden md:flex">
        <Sidebar mode={mapMode} areaData={selectedAreaData} />
        <CenterNavigation
          onLotSizeChange={setLotSize}
          onAreaSelect={handleAreaSelect}
        />
        <RightSidebar
          lotSize={lotSize}
          mode={mapMode}
          areaData={selectedAreaData}
        />
      </div>
    </div>
  );
};

export default Dashboard;
