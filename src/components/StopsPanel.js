import React from 'react';

/**
 * Displays the list of planned stops along the route.
 * Includes ETA and location coordinates.
 */
function StopsPanel({ route, stops, notes }) {
  return (
    <div className="card">
      <h3 className="card-title">Planned Stops</h3>
      <table className="stops-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Label</th>
            <th>ETA</th>
            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
        </thead>
        <tbody>
          {stops.map((stop, idx) => (
            <tr key={idx}>
              <td>{stop.type}</td>
              <td>{stop.label}</td>
              <td>{stop.eta}</td>
              <td>{stop.location.lat}</td>
              <td>{stop.location.lng}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {notes?.length > 0 && (
        <div className="card" style={{ marginTop: '15px' }}>
          <h3 className="card-title">Trip Notes</h3>
          <ul className="notes-list">
            {notes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StopsPanel;