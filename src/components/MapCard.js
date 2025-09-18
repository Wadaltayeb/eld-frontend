import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * MapCard displays the route between current, pickup, and dropoff locations.
 * It auto-zooms, shows location markers, draws a polyline, and calculates total distance.
 */
function MapCard({ current, pickup, dropoff }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!current || !pickup || !dropoff) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([current.lat, current.lng], 6);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Add location markers
    L.marker([current.lat, current.lng]).addTo(map).bindPopup('Current Location');
    L.marker([pickup.lat, pickup.lng]).addTo(map).bindPopup('Pickup Location');
    L.marker([dropoff.lat, dropoff.lng]).addTo(map).bindPopup('Dropoff Location');

    // Draw route line
    const routeLine = L.polyline([
      [current.lat, current.lng],
      [pickup.lat, pickup.lng],
      [dropoff.lat, dropoff.lng],
    ], { color: 'blue' }).addTo(map);

    // Auto zoom to fit route
    map.fitBounds(routeLine.getBounds());

    // Haversine distance calculation
    const toRad = deg => deg * Math.PI / 180;
    const haversine = (a, b) => {
      const R = 6371;
      const dLat = toRad(b.lat - a.lat);
      const dLng = toRad(b.lng - a.lng);
      const lat1 = toRad(a.lat);
      const lat2 = toRad(b.lat);
      const aVal = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
    };

    const leg1 = haversine(current, pickup);
    const leg2 = haversine(pickup, dropoff);
    const totalDistance = (leg1 + leg2).toFixed(2);

    // Display distance box
    const distanceControl = L.control({ position: 'bottomleft' });
    distanceControl.onAdd = () => {
      const div = L.DomUtil.create('div', 'distance-box');
      div.innerHTML = `🚚 Total Distance: <strong>${totalDistance} km</strong>`;
      return div;
    };
    distanceControl.addTo(map);

    // Cleanup on unmount
    return () => map.remove();
  }, [current, pickup, dropoff]);

  return (
    <div className="card fade-in-up delay-6">
      <h3 className="card-title">Route Map</h3>

      <div className="map-instruction">
        📍 Please enter locations accurately to get better results. Example: <code>Rabak, Sudan</code>
      </div>

      <div ref={mapRef} className="map-container" />
    </div>
  );
}

export default MapCard;