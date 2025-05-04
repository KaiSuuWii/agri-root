import { useState, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Marker } from "react-leaflet";
import PropTypes from "prop-types";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { getLotSize } from "../../../utils/geoCalculations";
import { processRecommendationForArea } from "../../../utils/areaCalculations";
import MapControls from "./MapControls";
import DrawingControl from "./DrawingControl";
import AreaInfo from "./AreaInfo";
import DrawingInstructions from "./DrawingInstructions";
import { areaDataService } from "../../../services/api/areaDataService";
import { preprocessedDataService } from "../../../services/api/preprocessedDataService";
import { mlService } from "../../../services/api/mlService";

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapView = ({ onLotSizeChange, onAreaSelect }) => {
  // State for center, polygon points, and drawing mode
  const [center, setCenter] = useState([8.043953, 124.888905]);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [drawingMode, setDrawingMode] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState("view"); // Changed from "scan" to "view"
  const [savedAreas, setSavedAreas] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [currentSensorData, setCurrentSensorData] = useState(null);
  const [currentRecommendation, setCurrentRecommendation] = useState(null);
  const [hasUnsavedPolygon, setHasUnsavedPolygon] = useState(false);

  // Subscribe to saved areas
  useEffect(() => {
    const unsubscribe = areaDataService.subscribeToAreas((areas) => {
      setSavedAreas(areas);
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to sensor data
  useEffect(() => {
    const unsubscribe = preprocessedDataService.subscribeToPreprocessedData(
      (data) => {
        setCurrentSensorData(data);
      }
    );

    return () => unsubscribe();
  }, []);

  // Subscribe to ML recommendations
  useEffect(() => {
    const unsubscribe = mlService.subscribeToRecommendations((data) => {
      setCurrentRecommendation(data);
    });

    return () => unsubscribe();
  }, []);

  // Handler for setting center
  const handleCenterSet = useCallback((newCenter) => {
    setCenter(newCenter);
    setDrawingMode("drawPolygon");
  }, []);

  // Handler for adding polygon points
  const handlePointAdd = useCallback((point) => {
    setPolygonPoints((prev) => [...prev, point]);
  }, []);

  // Handler for starting the drawing process
  const handleStartDrawing = () => {
    setIsDrawing(true);
    setDrawingMode("setCenter");
    setPolygonPoints([]);
    setHasUnsavedPolygon(false);
  };

  // Handler for finishing the drawing
  const handleFinishDrawing = () => {
    setIsDrawing(false);
    setDrawingMode(null);
    if (polygonPoints.length >= 3) {
      setHasUnsavedPolygon(true);
    }
  };

  // Handler for canceling the drawing
  const handleCancelDrawing = () => {
    setIsDrawing(false);
    setDrawingMode(null);
    setPolygonPoints([]);
    setHasUnsavedPolygon(false);
  };

  // Handler for saving the current area
  const handleSaveArea = async () => {
    if (polygonPoints.length < 3) return;

    const lotSize = getLotSize(polygonPoints);

    try {
      // Convert polygon points array to an object with numbered keys
      const polygonPointsObject = polygonPoints.reduce((acc, point, index) => {
        acc[`point${index}`] = {
          lat: point[0],
          lng: point[1],
        };
        return acc;
      }, {});

      // Process the recommendation based on the lot size
      const processedRecommendation = processRecommendationForArea(
        currentRecommendation,
        lotSize.hectares
      );

      const areaData = {
        polygon: polygonPointsObject,
        center: {
          lat: center[0],
          lng: center[1],
        },
        lotSize: lotSize.hectares,
        sensorData: currentSensorData,
        recommendation: processedRecommendation,
        timestamp: new Date(),
      };

      await areaDataService.saveAreaData(areaData);
      setPolygonPoints([]);
      setIsDrawing(false);
      setDrawingMode(null);
      setHasUnsavedPolygon(false);
    } catch (error) {
      console.error("Error saving area:", error);
    }
  };

  // Handler for viewing saved areas
  const handleViewAreas = () => {
    if (hasUnsavedPolygon) {
      if (
        window.confirm(
          "You have an unsaved polygon. Do you want to discard it and view saved areas?"
        )
      ) {
        handleCancelDrawing();
        setMode("view");
      }
    } else {
      setMode("view");
    }
  };

  // Handler for scanning new area
  const handleScanArea = () => {
    setMode("scan");
    setSelectedAreaId(null);
    if (onAreaSelect) {
      onAreaSelect({
        mode: "scan",
        areaData: null,
      });
    }
  };

  // Handler for selecting an area
  const handleAreaSelect = (areaId) => {
    setSelectedAreaId(areaId);
    const selectedArea = savedAreas.find((area) => area.id === areaId);
    if (selectedArea) {
      if (onAreaSelect) {
        onAreaSelect({
          mode,
          areaData: selectedArea,
        });
      }
    }
  };

  // Calculate lot size if polygon is complete
  const lotSize = polygonPoints.length >= 3 ? getLotSize(polygonPoints) : null;

  // Call onLotSizeChange whenever lotSize changes
  useEffect(() => {
    if (lotSize) {
      onLotSizeChange(lotSize.hectares);
    } else {
      onLotSizeChange(1); // Default to 1 hectare when no area is drawn
    }
  }, [lotSize, onLotSizeChange]);

  // Add effect to notify parent of mode changes
  useEffect(() => {
    if (onAreaSelect && mode === "scan") {
      onAreaSelect({
        mode: "scan",
        areaData: null,
      });
    }
  }, [mode, onAreaSelect]);

  return (
    <div className="bg-[#0F4D19]/47 p-4 rounded-lg mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-white font-bold">Area of Analysis</h2>
        <MapControls
          isDrawing={isDrawing}
          onStartDrawing={handleStartDrawing}
          onFinishDrawing={handleFinishDrawing}
          onSaveArea={handleSaveArea}
          onViewAreas={handleViewAreas}
          onScanArea={handleScanArea}
          onCancelDrawing={handleCancelDrawing}
          mode={mode}
          hasUnsavedPolygon={hasUnsavedPolygon}
        />
      </div>
      <div className="h-80 rounded-lg overflow-hidden relative">
        <MapContainer
          center={center}
          zoom={21}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />

          {/* Drawing control */}
          {mode === "scan" && drawingMode && (
            <DrawingControl
              mode={drawingMode}
              onCenterSet={handleCenterSet}
              onPointAdd={handlePointAdd}
            />
          )}

          {/* Center marker - show during center selection and before polygon drawing */}
          {mode === "scan" &&
            (drawingMode === "setCenter" ||
              (isDrawing &&
                drawingMode === "drawPolygon" &&
                polygonPoints.length === 0)) && <Marker position={center} />}

          {/* Current polygon being drawn */}
          {mode === "scan" && polygonPoints.length >= 3 && (
            <Polygon
              positions={polygonPoints}
              color="#FF0000"
              fillColor="#FF0000"
              fillOpacity={0.3}
              weight={2}
            />
          )}

          {/* Saved polygons */}
          {mode === "view" &&
            savedAreas.map((area) => {
              const polygonPointsArray = Object.keys(area.polygon)
                .sort((a, b) => {
                  const numA = parseInt(a.replace("point", ""));
                  const numB = parseInt(b.replace("point", ""));
                  return numA - numB;
                })
                .map((key) => [area.polygon[key].lat, area.polygon[key].lng]);

              console.log("Area ID:", area.id, "Selected ID:", selectedAreaId);
              const isSelected = area.id === selectedAreaId;
              const polygonColor = isSelected ? "#B91C1C" : "#808080";
              console.log("Is Selected:", isSelected, "Color:", polygonColor);

              return (
                <Polygon
                  key={area.id}
                  positions={polygonPointsArray}
                  pathOptions={{
                    color: polygonColor,
                    fillColor: polygonColor,
                    fillOpacity: 0.3,
                    weight: 2,
                  }}
                  eventHandlers={{
                    click: () => handleAreaSelect(area.id),
                  }}
                />
              );
            })}
        </MapContainer>

        {/* Drawing instructions overlay */}
        {mode === "scan" && isDrawing && (
          <DrawingInstructions drawingMode={drawingMode} />
        )}
      </div>

      <div className="mt-4">
        <AreaInfo lotSize={lotSize} pointsPlaced={polygonPoints.length} />
      </div>
    </div>
  );
};

MapView.propTypes = {
  onLotSizeChange: PropTypes.func.isRequired,
  onAreaSelect: PropTypes.func,
};

export default MapView;
