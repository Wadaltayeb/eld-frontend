import React from 'react';

function DriverSummary({ info }) {
  if (!info) return null;

  return (
    <div className="summary-grid">
      <h3 className="card-title">Driver Summary</h3>

      {/* 🧍 Driver Information */}
      <h4 className="section-title">🧍 Driver Information</h4>
      <div className="summary-item"><strong>Driver Name:</strong> {info.driverName}</div>
      <div className="summary-item"><strong>Vehicle ID:</strong> {info.vehicleId}</div>
      <div className="summary-item"><strong>Location:</strong> {info.location}</div>
      <div className="summary-item"><strong>Date:</strong> {info.date}</div>

      {/* 🏢 Carrier & Vehicle Details */}
      <h4 className="section-title">🏢 Carrier & Vehicle Details</h4>
      <div className="summary-item"><strong>Name of Carrier:</strong> {info.carrierName}</div>
      <div className="summary-item"><strong>Main Office Address:</strong> {info.mainOffice}</div>
      <div className="summary-item"><strong>Home Terminal Address:</strong> {info.homeTerminal}</div>
      <div className="summary-item"><strong>Total Miles Driving Today:</strong> {info.milesDrivingToday} miles</div>
      <div className="summary-item"><strong>Total Mileage Today:</strong> {info.totalMileageToday} miles</div>
      <div className="summary-item"><strong>Truck/Tractor Number:</strong> {info.truckNumber}</div>
      <div className="summary-item"><strong>Trailer Number:</strong> {info.trailerNumber}</div>
      <div className="summary-item"><strong>License Plate(s) / State:</strong> {info.licensePlate}</div>

      {/* 📦 Shipping Information */}
      <h4 className="section-title">📦 Shipping Information</h4>
      <div className="summary-item"><strong>DVIR / Manifest No. / Other:</strong> {info.manifestNumber}</div>
      <div className="summary-item"><strong>Shipping Document No(s.):</strong> {info.shippingDocs}</div>
      <div className="summary-item"><strong>Name of Shipper & Commodity:</strong> {info.shipperCommodity}</div>

      {/* 📋 Recap Section */}
      <h4 className="section-title">📋 Recap</h4>
      <div className="summary-item"><strong>Total hours on duty last 8 days:</strong> {info.recapA} hrs</div>
      <div className="summary-item"><strong>Total hours driving last 8 days:</strong> {info.recapB} hrs</div>
      <div className="summary-item"><strong>Total hours on duty today:</strong> {info.recapC} hrs</div>
      <div className="summary-item"><strong>Total hours driving today:</strong> {info.recapD} hrs</div>
      <div className="summary-item"><strong>Total hours on duty last 7 days:</strong> {info.recapE} hrs</div>
      <div className="summary-item"><strong>Total hours driving last 7 days:</strong> {info.recapF} hrs</div>
      <div className="summary-item"><strong>Total hours off duty last 8 days:</strong> {info.recapG} hrs</div>
      <div className="summary-item"><strong>Total hours off duty last 7 days:</strong> {info.recapH} hrs</div>
      <div className="summary-item"><strong>Available hours today:</strong> {info.recapI} hrs</div>

      {/* 🧭 Trip Summary */}
      <h4 className="section-title">🧭 Trip Summary</h4>
      <div className="summary-item"><strong>Distance Today:</strong> {info.distanceToday} miles</div>
      <div className="summary-item"><strong>Estimated Time:</strong> {info.estimatedTime} min</div>
      <div className="summary-item"><strong>Fuel Stops:</strong> {info.fuelStops}</div>
    </div>
  );
}

export default DriverSummary;