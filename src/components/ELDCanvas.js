import React, { useRef, useEffect } from 'react';

const STATUS_ORDER = ['OFF', 'SB', 'D', 'ON'];
const COLORS = {
  OFF: '#6b7280',
  SB: '#1e3a8a',
  D: '#10b981',
  ON: '#f59e0b',
};

function ColorLegend() {
  return (
    <div style={{
      display: 'flex',
      gap: '20px',
      marginBottom: '20px',
      fontSize: '16px',
      fontWeight: '500'
    }}>
      {STATUS_ORDER.map(status => (
        <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            backgroundColor: COLORS[status],
            border: '2px solid #ccc'
          }} />
          <span>{status}</span>
        </div>
      ))}
    </div>
  );
}

function DayCanvas({ blocks }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!Array.isArray(blocks) || blocks.length === 0) return;

    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const delayBeforeDraw = 600; // milliseconds
    setTimeout(() => drawCanvas(blocks), delayBeforeDraw);
  }, [blocks]);

  function drawCanvas(blocks) {
    const canvas = canvasRef.current;
    canvas.width = 1440;
    canvas.height = 800;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const hourWidth = width / 24;
    const rowHeight = height / 4;

    // Draw hour grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.font = '16px Segoe UI';
    ctx.fillStyle = '#374151';
    for (let h = 0; h <= 24; h++) {
      const x = h * hourWidth;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      ctx.fillText(`${h}:00`, x + 4, 20);
    }

    // Draw horizontal status lines
    STATUS_ORDER.forEach((_, i) => {
      const y = rowHeight * (i + 0.5);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    });

    // Sort blocks by startMin
    const sorted = [...blocks].sort((a, b) => a.startMin - b.startMin);

    // Animate drawing each block
    let index = 0;
    function drawNextBlock() {
      if (index >= sorted.length) return;

      const block = sorted[index];
      const x1 = (block.startMin / 60) * hourWidth;
      const x2 = (block.endMin / 60) * hourWidth;
      const y = rowHeight * (STATUS_ORDER.indexOf(block.status) + 0.5);

      ctx.strokeStyle = COLORS[block.status];
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';

      ctx.beginPath();
      if (index === 0 || block.startMin > sorted[index - 1].endMin) {
        ctx.moveTo(x1, y);
      } else {
        const prev = sorted[index - 1];
        const prevX = (prev.endMin / 60) * hourWidth;
        const prevY = rowHeight * (STATUS_ORDER.indexOf(prev.status) + 0.5);
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(prevX, y);
      }
      ctx.lineTo(x2, y);
      ctx.stroke();

      const durationMin = block.endMin - block.startMin;
      const label = `${Math.floor(durationMin / 60)}h ${durationMin % 60}m`;
      ctx.fillStyle = COLORS[block.status];
      ctx.font = '16px Segoe UI';
      ctx.fillText(label, x1 + 6, y - 14);

      index++;
      setTimeout(() => requestAnimationFrame(drawNextBlock), 300); // slow motion
    }

    drawNextBlock();
  }

  return (
    <div ref={containerRef}>
      <ColorLegend />
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          maxWidth: '100%',
          background: '#ffffff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          marginBottom: '40px',
        }}
      />
    </div>
  );
}

function ELDCanvas({ blocksByDay }) {
  if (!Array.isArray(blocksByDay) || blocksByDay.length === 0) return null;

  return (
    <>
      {blocksByDay.map((blocks, index) =>
        Array.isArray(blocks) && blocks.length > 0 ? (
          <DayCanvas key={index} blocks={blocks} />
        ) : null
      )}
    </>
  );
}

export default ELDCanvas;