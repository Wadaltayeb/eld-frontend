import React from 'react';

/**
 * Displays a recap of driver hours over the past 7 and 8 days.
 * Includes driving, on-duty, off-duty, and available hours.
 */
function RecapPanel({ logs }) {
  if (!logs || logs.length === 0) return null;

  const sum = (arr, field) =>
    arr.reduce((acc, day) => acc + (day[field] || 0), 0);

  const last8 = logs.slice(-8);
  const last7 = logs.slice(-7);
  const today = logs[logs.length - 1];

  const recap = {
    A: sum(last8, 'onDutyHours'),
    B: sum(last8, 'drivingHours'),
    C: today?.onDutyHours || 0,
    D: today?.drivingHours || 0,
    E: sum(last7, 'onDutyHours'),
    F: sum(last7, 'drivingHours'),
    G: sum(last8, 'offDutyHours'),
    H: sum(last7, 'offDutyHours'),
    I: Math.max(0, 70 - sum(last7, 'onDutyHours')), // Available hours tomorrow
  };

  return (
    <div className="card">
      <h3 className="card-title">Driver Recap</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th>Code</th>
            <th>Description</th>
            <th>Hours</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>A</td><td>Total On-Duty (Last 8 Days)</td><td>{recap.A}</td></tr>
          <tr><td>B</td><td>Total Driving (Last 8 Days)</td><td>{recap.B}</td></tr>
          <tr><td>C</td><td>On-Duty Today</td><td>{recap.C}</td></tr>
          <tr><td>D</td><td>Driving Today</td><td>{recap.D}</td></tr>
          <tr><td>E</td><td>Total On-Duty (Last 7 Days)</td><td>{recap.E}</td></tr>
          <tr><td>F</td><td>Total Driving (Last 7 Days)</td><td>{recap.F}</td></tr>
          <tr><td>G</td><td>Total Off-Duty (Last 8 Days)</td><td>{recap.G}</td></tr>
          <tr><td>H</td><td>Total Off-Duty (Last 7 Days)</td><td>{recap.H}</td></tr>
          <tr><td>I</td><td>Available Hours Tomorrow</td><td>{recap.I}</td></tr>
        </tbody>
      </table>
    </div>
  );
}

export default RecapPanel;