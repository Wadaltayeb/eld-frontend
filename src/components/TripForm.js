import React, { useState } from 'react';

function TripForm({ onConfirm, onReset }) {
  const [form, setForm] = useState({
    currentLocation: '',
    pickupLocation: '',
    dropoffLocation: ''
  });

  function handleChange(field, value) {
    setForm({ ...form, [field]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const trimmed = {
      currentLocation: form.currentLocation.trim().replace(/\s+$/, ''),
      pickupLocation: form.pickupLocation.trim().replace(/\s+$/, ''),
      dropoffLocation: form.dropoffLocation.trim().replace(/\s+$/, '')
    };

    if (!trimmed.currentLocation || !trimmed.pickupLocation || !trimmed.dropoffLocation) {
      alert('❌ All location fields are required.');
      return;
    }

    onConfirm(trimmed);
  }

  function handleReset() {
    setForm({
      currentLocation: '',
      pickupLocation: '',
      dropoffLocation: ''
    });
    onReset();
  }

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <div className="form-hint">
        📍 Enter city names in Arabic or English. Example: <code>Khartoum</code> or <code>الخرطوم</code>
      </div>

      <div className="field">
        <label>Current Location</label>
        <input
          type="text"
          value={form.currentLocation}
          onChange={(e) => handleChange('currentLocation', e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label>Pickup Location</label>
        <input
          type="text"
          value={form.pickupLocation}
          onChange={(e) => handleChange('pickupLocation', e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label>Dropoff Location</label>
        <input
          type="text"
          value={form.dropoffLocation}
          onChange={(e) => handleChange('dropoffLocation', e.target.value)}
          required
        />
      </div>

      <div className="actions">
        <button className="primary" type="submit">Confirm</button>
        <button className="ghost" type="button" onClick={handleReset}>Reset</button>
      </div>
    </form>
  );
}

export default TripForm;