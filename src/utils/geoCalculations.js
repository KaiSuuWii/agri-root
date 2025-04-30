/**
 * Calculates the area of a polygon in square meters using the Shoelace formula (Surveyor's formula)
 * @param {Array<Array<number>>} coordinates Array of [lat, lng] coordinate pairs
 * @returns {number} Area in square meters
 */
export function calculatePolygonArea(coordinates) {
  // Convert lat/lng to meters using Mercator projection
  const earthRadius = 6371000; // Earth's radius in meters
  const points = coordinates.map(([lat, lng]) => {
    const x =
      lng * (Math.PI / 180) * earthRadius * Math.cos((lat * Math.PI) / 180);
    const y = lat * (Math.PI / 180) * earthRadius;
    return [x, y];
  });

  // Apply Shoelace formula
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i][0] * points[j][1];
    area -= points[j][0] * points[i][1];
  }
  area = Math.abs(area) / 2;

  return area;
}

/**
 * Converts square meters to hectares
 * @param {number} squareMeters Area in square meters
 * @returns {number} Area in hectares
 */
export function squareMetersToHectares(squareMeters) {
  return squareMeters / 10000;
}

/**
 * Gets the lot size in both square meters and hectares
 * @param {Array<Array<number>>} coordinates Array of [lat, lng] coordinate pairs
 * @returns {Object} Object containing area in square meters and hectares
 */
export function getLotSize(coordinates) {
  const areaInSquareMeters = calculatePolygonArea(coordinates);
  const areaInHectares = squareMetersToHectares(areaInSquareMeters);

  return {
    squareMeters: Math.round(areaInSquareMeters * 100) / 100, // Round to 2 decimal places
    hectares: Math.round(areaInHectares * 10000) / 10000, // Round to 4 decimal places
  };
}
