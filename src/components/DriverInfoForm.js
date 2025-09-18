import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DriverInfoForm() {
  const initialState = {
    driverName: '',
    vehicleId: '',
    location: '',
    date: '',
    carrierName: '',
    mainOffice: '',
    homeTerminal: '',
    milesDrivingToday: '',
    totalMileageToday: '',
    truckNumber: '',
    trailerNumber: '',
    licensePlate: '',
    manifestNumber: '',
    shippingDocs: '',
    shipperCommodity: '',
    recapA: '',
    recapB: '',
    recapC: '',
    recapD: '',
    recapE: '',
    recapF: '',
    recapG: '',
    recapH: '',
    recapI: '',
  };

  const [formData, setFormData] = useState(initialState);
  const [saved, setSaved] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    e.target.classList.remove('input-error');
    setErrorMessage('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const missing = Object.entries(formData).filter(([_, v]) => !v);
    if (missing.length > 0) {
      const firstMissing = missing[0][0];
      setErrorMessage(`Please complete the field: ${firstMissing}`);
      const target = document.querySelector(`[name="${firstMissing}"]`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.focus();
        target.classList.add('input-error');
      }
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/drivers/create/', formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      console.error('❌ Error saving driver info:', err);
      setErrorMessage('Failed to save. Please check your connection or backend.');
    }
  }

  function handleClear() {
    setShowClearConfirm(true);
  }

  function confirmClear() {
    setFormData(initialState);
    setShowClearConfirm(false);
    setErrorMessage('');
  }

  useEffect(() => {
    const dateInput = document.querySelector('input[name="date"]');
    if (dateInput) {
      dateInput.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && !dateInput.value) {
          e.preventDefault();
          dateInput.focus();
          dateInput.classList.add('input-error');
          setErrorMessage('Please enter the date before continuing');
        }
      });
    }
  }, []);

  return (
    <div className="form-card">
      <h3 className="card-title">Driver Information</h3>

      <div className="user-guide-box">
        <h4>🧭 User Guidance</h4>
        <p>
          To ensure a smooth experience, please fill out all required fields before confirming your information.
          This helps us generate a complete and accurate driver summary.  
          Once completed, you’ll find a button at the bottom of the page to print or export your data.
        </p>
      </div>

      {errorMessage && (
        <div className="error-box">
          <span>❌ {errorMessage}</span>
        </div>
      )}

      <form className="input-form" onSubmit={handleSubmit}>
        {/* Header Info */}
        {[
          ['Driver Name', 'driverName'],
          ['Vehicle ID', 'vehicleId'],
          ['Location', 'location'],
          ['Date', 'date', 'date'],
          ['Name of Carrier', 'carrierName'],
          ['Main Office Address', 'mainOffice'],
          ['Home Terminal Address', 'homeTerminal'],
          ['Total Miles Driving Today', 'milesDrivingToday'],
          ['Total Mileage Today', 'totalMileageToday'],
          ['Truck/Tractor Number', 'truckNumber'],
          ['Trailer Number', 'trailerNumber'],
          ['License Plate(s) / State', 'licensePlate'],
        ].map(([label, name, type = 'text']) => (
          <div className="field" key={name}>
            <label>{label}</label>
            <input name={name} type={type} value={formData[name]} onChange={handleChange} />
          </div>
        ))}

        {/* Shipping Info */}
        <h4 className="section-title">Shipping Information</h4>
        {[
          ['DVIR / Manifest No. / Other', 'manifestNumber'],
          ['Shipping Document No(s.)', 'shippingDocs'],
          ['Name of Shipper & Commodity', 'shipperCommodity'],
        ].map(([label, name]) => (
          <div className="field" key={name}>
            <label>{label}</label>
            <input name={name} value={formData[name]} onChange={handleChange} />
          </div>
        ))}

        {/* Recap Section */}
        <h4 className="section-title">Recap</h4>
        {[
          ['Total hours on duty last 8 days', 'recapA'],
          ['Total hours driving last 8 days', 'recapB'],
          ['Total hours on duty today', 'recapC'],
          ['Total hours driving today', 'recapD'],
          ['Total hours on duty last 7 days', 'recapE'],
          ['Total hours driving last 7 days', 'recapF'],
          ['Total hours off duty last 8 days', 'recapG'],
          ['Total hours off duty last 7 days', 'recapH'],
          ['Available hours today', 'recapI'],
        ].map(([label, name]) => (
          <div className="field" key={name}>
            <label>{label}</label>
            <input name={name} value={formData[name]} onChange={handleChange} />
          </div>
        ))}

        <div className="button-row">
          <button type="submit" className="primary">💾 Save Info</button>
          <button type="button" className="ghost" onClick={handleClear}>🧹 Clear Form</button>
        </div>

        {saved && (
          <div className="save-message">
            ✅ Driver information saved successfully.<br />
            You can download this info using the <strong>Print</strong> button at the bottom of the page.
          </div>
        )}

        {showClearConfirm && (
          <div className="confirm-box">
            <p>Are you sure you want to clear all fields?</p>
            <div className="button-row">
              <button type="button" className="ghost" onClick={confirmClear}>✅ Yes, Clear</button>
              <button type="button" className="ghost" onClick={() => setShowClearConfirm(false)}>❌ Cancel</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default DriverInfoForm;