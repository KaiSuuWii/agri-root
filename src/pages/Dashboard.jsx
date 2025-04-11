import Sidebar from "../components/dashboard/layout/Sidebar";
// import RightSidebar from "../components/dashboard/layout/RightSidebar";
import CenterNavigation from "../components/dashboard/layout/CenterNavigation";
import Header from "../components/dashboard/layout/Header";
import RightSidebar from "../components/dashboard/layout/RightSidebar";
const Dashboard = () => {
  return (
    <div className="bg-[#D6ECE2] min-h-screen p-4 md:p-6">
      {/* Mobile Layout */}
      <div className="flex flex-col md:hidden space-y-4">
        <CenterNavigation />
        <Sidebar />
        {/* <RightSidebar /> */}
      </div>

      {/* Desktop Layout */}
      <Header />
      <div className="hidden md:flex">
        <Sidebar />
        <CenterNavigation />
        <RightSidebar />
      </div>
    </div>
  );
};

export default Dashboard;
