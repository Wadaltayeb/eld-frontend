/*// src/utils/geocode.js
export async function geocodeCity(city) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`
  );
  const data = await res.json();
  if (!data || data.length === 0) return null;
  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon)
  };
}
*/

















/**
 * Resolves a city name to its geographic coordinates.
 * Throws an error if the city is not found in the mock database.
 * @param /*{string} cityName - The name of the city to resolve.
 * @returns  /*{{lat: number, lng: number}} - Latitude and longitude of the city.
 */
export async function resolveOneOrThrow(cityName) {
  if (!cityName || typeof cityName !== 'string') {
    throw new Error('Invalid city name');
  }

  // Mock database of known cities and their coordinates
  const mockDatabase = {
    'Khartoum': { lat: 15.5007, lng: 32.5599 },
    'Kosti': { lat: 13.1600, lng: 32.6600 },
    'El Obeid': { lat: 13.1833, lng: 30.2167 },
    'Port Sudan': { lat: 19.6167, lng: 37.2167 },
    'Gedaref': { lat: 14.0333, lng: 35.3833 },
    'Nyala': { lat: 12.0500, lng: 24.8833 },
    'Atbara': { lat: 17.7000, lng: 33.9833 },
    'Sennar': { lat: 13.5500, lng: 33.6333 },
    'Wad Madani': { lat: 14.4000, lng: 33.5000 }
  };

  const result = mockDatabase[cityName.trim()];
  if (!result) {
    const error = new Error('City not found');
    error.code = 'GEOCODE_NOT_FOUND';
    throw error;
  }

  return result;
}