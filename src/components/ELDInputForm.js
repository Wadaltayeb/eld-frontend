import React, { useState, useRef } from 'react';

const STATUS_OPTIONS = [
  { value: 'OFF', label: 'Off Duty' },
  { value: 'SB', label: 'Sleeper Berth' },
  { value: 'D', label: 'Driving' },
  { value: 'ON', label: 'On Duty (Not Driving)' },
];

function createEmptyDay() {
  return STATUS_OPTIONS.map(opt => ({
    status: opt.value,
    startTime: '',
    endTime: '',
    error: false
  }));
}

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function isValidTimeFormat(str) {
  return /^\d{2}:\d{2}$/.test(str);
}

function ELDInputForm({ onSubmit }) {
  const [days, setDays] = useState([{ blocks: createEmptyDay(), locked: true }]);
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef(null);

  function addDay() {
    const incompleteIndex = days.findIndex(day =>
      day.blocks.some(b => b.startTime === '' || b.endTime === '')
    );
    if (incompleteIndex !== -1) {
      scrollToDay(incompleteIndex);
      highlightErrors(incompleteIndex);
      setErrorMessage('⚠️ Please complete all time fields before adding a new day.');
      return;
    }
    setDays([...days, { blocks: createEmptyDay(), locked: false }]);
    setErrorMessage('');
    setTimeout(() => scrollToDay(days.length), 100);
  }

  function updateBlock(dayIndex, blockIndex, field, value) {
    const updated = [...days];
    updated[dayIndex].blocks[blockIndex][field] = value;
    updated[dayIndex].blocks[blockIndex].error = false;
    setDays(updated);
    setErrorMessage('');
  }

  function removeDay(index) {
    const updated = [...days];
    updated.splice(index, 1);
    setDays(updated);
  }

  function scrollToDay(index) {
    const el = document.getElementById(`day-${index}`);
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function highlightErrors(index) {
    const updated = [...days];
    updated[index].blocks = updated[index].blocks.map(b => ({
      ...b,
      error: b.startTime === '' || b.endTime === ''
    }));
    setDays(updated);
  }

  function handleSubmit() {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    for (let i = 0; i < days.length; i++) {
      const day = days[i];
      const blocks = day.blocks;

      for (let b of blocks) {
        if (!isValidTimeFormat(b.startTime) || !isValidTimeFormat(b.endTime)) {
          b.error = true;
          setErrorMessage('⚠️ Please enter time in HH:MM format (e.g. 00:00 or 14:30). 00:00 equals 12:00 AM.');
          setDays([...days]);
          return;
        }

        const start = timeToMinutes(b.startTime);
        const end = timeToMinutes(b.endTime);
        if (end <= start) {
          b.error = true;
          setErrorMessage('🚫 End time must be after start time.');
          setDays([...days]);
          return;
        }
      }

      const sorted = [...blocks].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
      for (let j = 1; j < sorted.length; j++) {
        const prevEnd = timeToMinutes(sorted[j - 1].endTime);
        const currStart = timeToMinutes(sorted[j].startTime);
        if (currStart < prevEnd) {
          setErrorMessage('🚫 Time blocks must not overlap.');
          return;
        }
      }
    }

    const formatted = days.map(day =>
      day.blocks.map(b => ({
        status: b.status,
        startMin: timeToMinutes(b.startTime),
        endMin: timeToMinutes(b.endTime)
      }))
    );

    onSubmit(formatted);
    setErrorMessage('');
  }

  return (
    <div className="card" ref={formRef}>
      <h3 className="card-title">Driver Status Input</h3>
      <p className="instruction">
        Enter start and end times for each status using 24-hour format (HH:MM).  
        Example: <strong>00:00</strong> = 12:00 AM, <strong>14:30</strong> = 2:30 PM.
      </p>

      {errorMessage && <div className="error-banner">{errorMessage}</div>}

      {days.map((day, dayIdx) => (
        <div key={dayIdx} id={`day-${dayIdx}`} className="day-block">
          <h4>Day {dayIdx + 1}</h4>
          <table className="status-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {day.blocks.map((block, blockIdx) => (
                <tr key={blockIdx}>
                  <td>{STATUS_OPTIONS[blockIdx].label}</td>
                  <td>
                    <input
                      type="text"
                      placeholder="00:00"
                      value={block.startTime}
                      onChange={(e) => updateBlock(dayIdx, blockIdx, 'startTime', e.target.value)}
                      className={block.error ? 'error' : ''}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="00:00"
                      value={block.endTime}
                      onChange={(e) => updateBlock(dayIdx, blockIdx, 'endTime', e.target.value)}
                      className={block.error ? 'error' : ''}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!day.locked && (
            <button onClick={() => removeDay(dayIdx)} className="remove-day">🗑️ Remove Day</button>
          )}
        </div>
      ))}

      <div className="actions">
        <button onClick={addDay}>➕ Add Day</button>
        <button className="primary" onClick={handleSubmit}>📊 Render Timeline</button>
      </div>
    </div>
  );
}

export default ELDInputForm;