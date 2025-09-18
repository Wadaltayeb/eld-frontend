/**
 * Calculates the distance between two geographic points using the Haversine formula.
 * @param {{lat: number, lng: number}} pointA - First point.
 * @param {{lat: number, lng: number}} pointB - Second point.
 * @returns {number} - Distance in kilometers.
 */
export function calculateDistance(pointA, pointB) {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = deg2rad(pointB.lat - pointA.lat);
  const dLng = deg2rad(pointB.lng - pointA.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(pointA.lat)) *
      Math.cos(deg2rad(pointB.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Converts degrees to radians.
 * @param {number} deg - Degrees.
 * @returns {number} - Radians.
 */
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}