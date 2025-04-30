import PropTypes from "prop-types";

const MapControls = ({
  isDrawing,
  onStartDrawing,
  onFinishDrawing,
  onSaveArea,
  onViewAreas,
  onScanArea,
  onCancelDrawing,
  mode,
  hasUnsavedPolygon,
}) => {
  return (
    <div className="flex gap-2">
      {mode === "scan" ? (
        // Scan mode buttons
        <>
          {!isDrawing && !hasUnsavedPolygon ? (
            <button
              onClick={onStartDrawing}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
            >
              Draw Area
            </button>
          ) : (
            <>
              {isDrawing ? (
                <>
                  <button
                    onClick={onFinishDrawing}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-colors"
                  >
                    Finish Drawing
                  </button>
                  <button
                    onClick={onCancelDrawing}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                hasUnsavedPolygon && (
                  <>
                    <button
                      onClick={onSaveArea}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition-colors"
                    >
                      Save Area
                    </button>
                    <button
                      onClick={onCancelDrawing}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )
              )}
            </>
          )}
          <button
            onClick={onViewAreas}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            View Areas
          </button>
        </>
      ) : (
        // View mode button
        <button
          onClick={onScanArea}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
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
  mode: PropTypes.oneOf(["scan", "view"]).isRequired,
  hasUnsavedPolygon: PropTypes.bool.isRequired,
};

export default MapControls;
