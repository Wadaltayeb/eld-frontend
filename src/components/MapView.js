import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

const provider = new OpenStreetMapProvider();

function MapView({ cities, onSummary, setGlobalLoading }) {
  const mapRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (mapRef.current._leafletMap) {
      mapRef.current._leafletMap.remove();
      mapRef.current._leafletMap = null;
    }

    const map = L.map(mapRef.current).setView([15.5, 32.5], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current._leafletMap = map;

    map.whenReady(() => {
      setGlobalLoading(false);
    });
  }, [setGlobalLoading]);

  useEffect(() => {
    const map = mapRef.current?._leafletMap;
    const layer = layerRef.current;
    if (!map || !layer || cities.length < 3) return;

    setGlobalLoading(true);
    layer.clearLayers();

    async function resolve(name) {
      const res = await provider.search({ query: name.trim().replace(/\s+$/, '') });
      if (!res[0]) throw new Error(`City not found: ${name}`);
      return {
        name,
        lat: res[0].y,
        lng: res[0].x
      };
    }

    Promise.all(cities.map(resolve))
      .then((points) => {
        points.forEach((p) => {
          const icon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
          });
          L.marker([p.lat, p.lng], { icon }).addTo(layer).bindPopup(p.name);
        });

        const pickup = points[1];
        const dropoff = points[2];
        const line = L.polyline([[pickup.lat, pickup.lng], [dropoff.lat, dropoff.lng]], {
          color: '#0077cc',
          weight: 4,
          opacity: 0.8
        }).addTo(layer);

        map.flyToBounds(line.getBounds(), { padding: [50, 50], duration: 1.5 });

        map.once('moveend', () => {
          map.invalidateSize();
          setGlobalLoading(false);
        });

        const R = 6371;
        const dLat = (dropoff.lat - pickup.lat) * Math.PI / 180;
        const dLon = (dropoff.lng - pickup.lng) * Math.PI / 180;
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(pickup.lat * Math.PI / 180) *
            Math.cos(dropoff.lat * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = R * c;
        const distanceMiles = (distanceKm * 0.621371).toFixed(1);
        const durationMin = Math.round((distanceMiles / 60) * 60);

        if (onSummary) {
          onSummary({ distanceMiles, durationMin });
        }
      })
      .catch((err) => {
        console.error(err);
        alert(`❌ Failed to locate one of the cities.`);
        setGlobalLoading(false);
      });
  }, [cities, onSummary, setGlobalLoading]);

  return (
    <div className="card">
      <h3 className="card-title">Route Map</h3>
      <div className="map-instruction">
        📍 Enter city names in Arabic or English. Example: <code>Khartoum</code> or <code>الخرطوم</code>
      </div>
      <div className="map-wrapper">
        <div ref={mapRef} className="map-container" />
      </div>
    </div>
  );
}

export default MapView;