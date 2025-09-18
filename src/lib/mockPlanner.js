/**
 * Simulates trip planning based on resolved locations.
 * Returns route polyline, stops, daily logs, and notes.
 * @param {Object} input - Input payload containing resolved locations.
 * @returns {Object} - Trip data including route, stops, logs, and notes.
 */
export async function mockPlanTrip({ resolved }) {
  const { current, pickup, dropoff } = resolved;

  // Construct route polyline from current to pickup to dropoff
  const route = {
    polyline: [current, pickup, dropoff]
  };

  // Define mock stops along the route
  const stops = [
    {
      type: 'pickup',
      label: 'Pickup cargo',
      location: pickup,
      eta: '08:00'
    },
    {
      type: 'fuel',
      label: 'Fuel stop',
      location: {
        lat: (pickup.lat + dropoff.lat) / 2,
        lng: (pickup.lng + dropoff.lng) / 2
      },
      eta: '12:00'
    },
    {
      type: 'dropoff',
      label: 'Dropoff cargo',
      location: dropoff,
      eta: '16:00'
    }
  ];

  // Simulated daily log blocks for driver activity
  const dailyLogs = [
    {
      date: '2025-09-17',
      label: 'Trip Day',
      blocks: [
        { status: 'ON', startMin: 0, endMin: 60 },
        { status: 'D', startMin: 60, endMin: 180 },
        { status: 'OFF', startMin: 180, endMin: 240 },
        { status: 'D', startMin: 240, endMin: 360 },
        { status: 'ON', startMin: 360, endMin: 420 },
        { status: 'OFF', startMin: 420, endMin: 1440 }
      ],
      drivingHours: 4,
      onDutyHours: 5,
      offDutyHours: 15
    }
  ];

  // Notes summarizing the trip events
  const notes = [
    'Cargo was picked up on time.',
    'Fuel stop occurred midway through the route.',
    'Cargo was successfully delivered at the destination.'
  ];

  return { route, stops, dailyLogs, notes };
}