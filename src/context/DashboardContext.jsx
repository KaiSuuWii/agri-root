import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [mode, setMode] = useState("view"); // 'scan' or 'view'
  const [hasDrawnPlot, setHasDrawnPlot] = useState(false);
  const [hasSelectedArea, setHasSelectedArea] = useState(false);
  const [selectedAreaData, setSelectedAreaData] = useState(null);

  const value = {
    mode,
    setMode,
    hasDrawnPlot,
    setHasDrawnPlot,
    hasSelectedArea,
    setHasSelectedArea,
    selectedAreaData,
    setSelectedAreaData,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

DashboardProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
