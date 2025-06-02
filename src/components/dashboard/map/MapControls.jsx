import PropTypes from "prop-types";
import { useDashboard } from "../../../context/DashboardContext";

const MapControls = ({
  isDrawing,
  onStartDrawing,
  onFinishDrawing,
  onSaveArea,
  onViewAreas,
  onScanArea,
  onCancelDrawing,
  hasUnsavedPolygon,
}) => {
  const { mode, setMode, setHasDrawnPlot, setHasSelectedArea } = useDashboard();

  const handleStartDrawing = () => {
    setHasDrawnPlot(false);
    onStartDrawing();
  };

  const handleFinishDrawing = () => {
    setHasDrawnPlot(true);
    onFinishDrawing();
  };

  const handleSaveArea = () => {
    setHasDrawnPlot(false);
    onSaveArea();
  };

  const handleViewAreas = () => {
    setMode("view");
    setHasSelectedArea(false);
    onViewAreas();
  };

  const handleScanArea = () => {
    setMode("scan");
    setHasDrawnPlot(false);
    onScanArea();
  };

  const handleCancelDrawing = () => {
    setHasDrawnPlot(false);
    onCancelDrawing();
  };

  return (
    <div className="flex gap-2">
      {mode === "scan" ? (
        // Scan mode buttons
        <>
          {!isDrawing && !hasUnsavedPolygon ? (
            <button
              onClick={handleStartDrawing}
              className="bg-[#0F4D19] text-white px-4 py-2 rounded-lg hover:bg-[#1A7A2E] transition-colors"
            >
              Draw Area
            </button>
          ) : (
            <>
              {isDrawing ? (
                <>
                  <button
                    onClick={handleFinishDrawing}
                    className="bg-[#0F4D19] text-white px-4 py-2 rounded-lg hover:bg-[#1A7A2E] transition-colors"
                  >
                    Finish Drawing
                  </button>
                  <button
                    onClick={handleCancelDrawing}
                    className="bg-[#0F4D19] text-white px-4 py-2 rounded-lg hover:bg-[#1A7A2E] transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                hasUnsavedPolygon && (
                  <>
                    <button
                      onClick={handleSaveArea}
                      className="bg-[#0F4D19] text-white px-4 py-2 rounded-lg hover:bg-[#1A7A2E] transition-colors"
                    >
                      Save Area
                    </button>
                    <button
                      onClick={handleCancelDrawing}
                      className="bg-[#0F4D19] text-white px-4 py-2 rounded-lg hover:bg-[#1A7A2E] transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )
              )}
            </>
          )}
          <button
            onClick={handleViewAreas}
            className="bg-[#0F4D19] text-white px-4 py-2 rounded-lg hover:bg-[#1A7A2E] transition-colors"
          >
            View Areas
          </button>
        </>
      ) : (
        // View mode button
        <button
          onClick={handleScanArea}
          className="bg-[#0F4D19] text-white px-4 py-2 rounded-lg hover:bg-[#1A7A2E] transition-colors"
        >
          Scan Area
        </button>
      )}
    </div>
  );
};

MapControls.propTypes = {
  isDrawing: PropTypes.bool.isRequired,
  onStartDrawing: PropTypes.func.isRequired,
  onFinishDrawing: PropTypes.func.isRequired,
  onSaveArea: PropTypes.func.isRequired,
  onViewAreas: PropTypes.func.isRequired,
  onScanArea: PropTypes.func.isRequired,
  onCancelDrawing: PropTypes.func.isRequired,
  hasUnsavedPolygon: PropTypes.bool.isRequired,
};

export default MapControls;
