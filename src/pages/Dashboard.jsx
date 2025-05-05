import Sidebar from "../components/dashboard/layout/Sidebar";
// import RightSidebar from "../components/dashboard/layout/RightSidebar";
import CenterNavigation from "../components/dashboard/layout/CenterNavigation";
import Header from "../components/dashboard/layout/Header";
import RightSidebar from "../components/dashboard/layout/RightSidebar";
import { useState } from "react";
import { DashboardProvider } from "../context/DashboardContext";

const Dashboard = () => {
  const [lotSize, setLotSize] = useState(1); // Default to 1 hectare

  return (
    <DashboardProvider>
      <div className="bg-[#D6ECE2] min-h-screen p-4 md:p-6">
        {/* Mobile Layout */}
        <div className="flex flex-col md:hidden space-y-4">
          <Header />
          <CenterNavigation onLotSizeChange={setLotSize} />
          <Sidebar />
          <RightSidebar lotSize={lotSize} />
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex">
          <Header />
        </div>
        <div className="hidden md:flex">
          <Sidebar />
          <CenterNavigation onLotSizeChange={setLotSize} />
          <RightSidebar lotSize={lotSize} />
        </div>
      </div>
    </DashboardProvider>
  );
};

export default Dashboard;
