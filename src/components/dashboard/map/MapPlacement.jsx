const MapPlacement = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-bold mb-2">Area of Analysis</h2>
      <div className="h-60 bg-gray-200 rounded-lg flex items-center justify-center">
        {/* Replace this with actual map implementation */}
        <div className="text-gray-500">
          <p className="text-center">[Map Placeholder]</p>
          <p className="text-sm mt-2">Location: Sample Farm</p>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <p>Latitude: 14.5995° N</p>
          <p>Longitude: 120.9842° E</p>
        </div>
        <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
          View Full Details
        </button>
      </div>
    </div>
  );
};

export default MapPlacement;
