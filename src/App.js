import React, { useState, useRef, useEffect } from 'react';
import TripForm from './components/TripForm';
import DriverInfoForm from './components/DriverInfoForm';
import ELDInputForm from './components/ELDInputForm';
import DriverSummary from './components/DriverSummary';
import LegendCard from './components/LegendCard';
//import ELDTimeline from './components/ELDTimeline';
import ELDCanvas from './components/ELDCanvas';
import MapView from './components/MapView';
import './design.css';
import './App.css';

window.onerror = function (msg, url, line, col, error) {
  const details = `
    <h2 style="color:red;">Runtime Error</h2>
    <p><strong>Message:</strong> ${msg}</p>
    <p><strong>Location:</strong> ${url}:${line}:${col}</p>
    <pre style="background:#222; color:#eee; padding:10px;">${error?.stack}</pre>
  `;
  document.body.innerHTML = details;
};

function App() {
  const [cities, setCities] = useState([]);
  const [driverInfo, setDriverInfo] = useState(null);
  const [customBlocks, setCustomBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tripSummary, setTripSummary] = useState(null);
  const mapSectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const targets = document.querySelectorAll(
      '.fade-in-up, .fade-in-left, .fade-in-right, .zoom-in'
    );
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  function normalizeCityName(name) {
    return name
      .trim()
      .replace(/\s+$/, '')
      .replace(/الخرطوم/i, 'Khartoum')
      .replace(/بحري/i, 'Bahri')
      .replace(/كوستي/i, 'Kosti')
      .replace(/مدني/i, 'Wad Madani')
      .replace(/سنار/i, 'Sennar')
      .replace(/ربك/i, 'Rabak')
      .replace(/بورتسودان/i, 'Port Sudan')
      .replace(/الأبيض/i, 'El Obeid')
      .replace(/نيالا/i, 'Nyala')
      .replace(/عطبرة/i, 'Atbara');
  }

  function handleConfirm({ currentLocation, pickupLocation, dropoffLocation }) {
    setLoading(true);
    setTimeout(() => {
      setCities([
        normalizeCityName(currentLocation),
        normalizeCityName(pickupLocation),
        normalizeCityName(dropoffLocation)
      ]);
      setLoading(false);
      setTimeout(() => {
        mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }, 2000);
  }

  function handleReset() {
    setCities([]);
    setTripSummary(null);
  }

  function handleExportCSV() {
    alert('CSV export is not available without resolved trip data.');
  }

  const fuelStops = tripSummary?.distanceMiles
    ? Math.max(1, Math.ceil(tripSummary.distanceMiles / 1000))
    : 0;

  return (
    <div className="app-shell fade-in-up">
      {loading && (
        <div className="global-loader">
          ⏳ Loading... Please wait
        </div>
      )}
    
      <header className="topbar fade-in-up delay-2">
        <div className="brand fade-in-left delay-3">
          <div className="truck-logo zoom-in delay-4" />
          <span>DRIVELEDGER Planner</span>
        </div>
      </header>

      <main className="layout fade-in-right delay-5">
        <section className="left-pane fade-in-up delay-6">
          <div className="card zoom-in delay-7">
            <DriverInfoForm onSubmit={setDriverInfo} />
          </div>

          <div className="card fade-in-left delay-8">
            <TripForm onConfirm={handleConfirm} onReset={handleReset} />
          </div>

          <div className="card fade-in-right delay-9">
            <ELDInputForm onSubmit={setCustomBlocks} />
          </div>
        </section>

        <section className="right-pane fade-in-up delay-10" ref={mapSectionRef}>
          <MapView cities={cities} onSummary={setTripSummary} setGlobalLoading={setLoading} />

          {tripSummary && (
            <div className="card zoom-in delay-11">
              <h3 className="card-title">Trip Summary</h3>
              <p>🚚 Distance: <strong>{tripSummary.distanceMiles} miles</strong></p>
              <p>⏱️ Estimated Time: <strong>{tripSummary.durationMin} min</strong></p>
              <p>⛽ Fuel Stops: <strong>{fuelStops}</strong></p>
            </div>
          )}

          {customBlocks.some(day => Array.isArray(day) && day.length > 0) && (
            <div className="card fade-in-left delay-12">
              <h3 className="card-title">Manual Timeline</h3>
              <ELDCanvas blocksByDay={customBlocks} />
            </div>
          )}

          {driverInfo && (
            <div className="card fade-in-right delay-13">
              <DriverSummary
                info={{
                  ...driverInfo,
                  distanceToday: tripSummary?.distanceMiles || 0,
                  estimatedTime: tripSummary?.durationMin || 0,
                  fuelStops: fuelStops
                }}
              />
            </div>
          )}

          <div className="card fade-in-up delay-14">
            <LegendCard />
          </div>
        </section>
      </main>

      <footer className="fade-in-up delay-15">
        <button className="ghost" onClick={() => window.print()}>🖨️ Print</button>
        <button className="ghost" onClick={handleExportCSV}>📤 Export CSV</button>
      </footer>
    </div>
  );
}

export default App;