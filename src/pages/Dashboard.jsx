import Sidebar from "../components/dashboard/layout/Sidebar";
// import RightSidebar from "../components/dashboard/layout/RightSidebar";
import CenterNavigation from "../components/dashboard/layout/CenterNavigation";

const Dashboard = () => {
  return (
    <div className="bg-green-300 min-h-screen p-4 md:p-6">
      {/* Mobile Layout */}
      <div className="flex flex-col md:hidden space-y-4">
        <CenterNavigation />
        <Sidebar />
        {/* <RightSidebar /> */}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex">
        <Sidebar />
        <CenterNavigation />
        {/* <RightSidebar /> */}
      </div>
    </div>
  );
};

export default Dashboard;
