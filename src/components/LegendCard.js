import React from 'react';

/**
 * Displays a legend explaining the meaning of each status color.
 */
function LegendCard() {
  return (
    <div className="card">
      <h3 className="card-title">Status Legend</h3>
      <div className="remarks">
        <div className="remarks-item" style={{ borderLeftColor: '#6b7280' }}>
          ⬜ <strong>Off Duty</strong> – Gray
        </div>
        <div className="remarks-item" style={{ borderLeftColor: '#1e3a8a' }}>
          🛏️ <strong>Sleeper Berth</strong> – Dark Blue
        </div>
        <div className="remarks-item" style={{ borderLeftColor: '#10b981' }}>
          🚚 <strong>Driving</strong> – Green
        </div>
        <div className="remarks-item" style={{ borderLeftColor: '#f59e0b' }}>
          🧰 <strong>On Duty (Not Driving)</strong> – Orange
        </div>
      </div>
    </div>
  );
}

export default LegendCard;