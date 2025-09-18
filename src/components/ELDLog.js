import React from 'react';
import ELDCanvas from './ELDCanvas';

/**
 * Displays a single day's ELD log including activity blocks and visual timeline.
 */
function ELDLog({ day }) {
  return (
    <div className="eld-log">
      <div className="eld-log-header">
        <strong>{day.date}</strong>
        <span>{day.label}</span>
      </div>

      <table className="eld-log-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Start</th>
            <th>End</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {day.blocks.map((block, idx) => (
            <tr key={idx}>
              <td>{block.status}</td>
              <td>{formatTime(block.startMin)}</td>
              <td>{formatTime(block.endMin)}</td>
              <td>{(block.endMin - block.startMin) / 60} hrs</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '10px' }}>
        <ELDCanvas blocks={day.blocks} />
      </div>
    </div>
  );
}

/**
 * Converts minutes to HH:MM format.
 * @param {number} min - Minutes since midnight.
 * @returns {string} - Formatted time string.
 */
function formatTime(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export default ELDLog;