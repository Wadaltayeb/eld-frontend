// Mock planner to let the front-end flow work before wiring a backend.
// It returns a plausible route, stops, and daily logs.

export async function mockPlanTrip({ currentLocation, pickupLocation, dropoffLocation, cycleHoursUsed }) {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 900));

  // Polyline path (lat, lng pairs). Replace with real routing data later.
  const polyline = [
    [15.500, 32.560],
    [16.200, 33.900],
    [17.100, 35.400],
    [18.200, 36.200],
    [19.600, 37.200],
  ];

  const route = {
    polyline,
    totalDistanceMiles: 820,
    totalDurationHours: 16.5,
    legs: [
      { from: currentLocation, to: pickupLocation },
      { from: pickupLocation, to: dropoffLocation },
    ],
  };

  const stops = [
    {
      type: 'pickup',
      label: 'Pickup (1h on-duty)',
      eta: 'Day 1 08:00',
      durationMin: 60,
      location: { lat: polyline[0][0], lng: polyline[0][1] },
    },
    {
      type: 'break',
      label: '30-min break',
      eta: 'Day 1 12:00',
      durationMin: 30,
      location: { lat: polyline[1][0], lng: polyline[1][1] },
    },
    {
      type: 'fuel',
      label: 'Fuel stop',
      eta: 'Day 1 15:30',
      durationMin: 20,
      location: { lat: polyline[2][0], lng: polyline[2][1] },
    },
    {
      type: 'rest',
      label: '10h off-duty',
      eta: 'Day 1 20:00',
      durationMin: 600,
      location: { lat: polyline[3][0], lng: polyline[3][1] },
    },
    {
      type: 'dropoff',
      label: 'Dropoff (1h on-duty)',
      eta: 'Day 2 11:00',
      durationMin: 60,
      location: { lat: polyline[4][0], lng: polyline[4][1] },
    },
  ];

  const dailyLogs = [
    {
      dateLabel: 'Day 1',
      blocks: [
        { status: 'ON', startMin: 7 * 60, endMin: 8 * 60 },
        { status: 'D', startMin: 8 * 60, endMin: 12 * 60 },
        { status: 'ON', startMin: 12 * 60, endMin: 12 * 60 + 30 },
        { status: 'D', startMin: 12 * 60 + 30, endMin: 17 * 60 },
        { status: 'OFF', startMin: 20 * 60, endMin: 24 * 60 },
      ],
    },
    {
      dateLabel: 'Day 2',
      blocks: [
        { status: 'D', startMin: 7 * 60, endMin: 11 * 60 },
        { status: 'ON', startMin: 11 * 60, endMin: 12 * 60 }, // dropoff
        { status: 'OFF', startMin: 12 * 60, endMin: 24 * 60 },
      ],
    },
  ];

  const notes = [
    `Cycle hours used: ${cycleHoursUsed}h`,
    'Pickup and dropoff each include 1 hour on-duty.',
    'Fueling planned within 1,000 miles.',
    '30-min break included within 8 on-duty hours.',
  ];

  return { route, stops, dailyLogs, notes };
}
