import { useState, useRef, useEffect } from 'react';

const T = {
  bg: "#02060f",
  card: "rgba(11,20,42,0.95)",
  gold: "#f0a500",
  text: "#f0f6ff",
  text2: "#8899b8",
  text3: "#3d4f6e",
  bord: "rgba(255,255,255,0.06)",
};

export default function PhotoCropModal({ image, onSave, onCancel }) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      drawCanvas();
    };
    img.src = image;
  }, [image]);

  useEffect(() => {
    drawCanvas();
  }, [zoom, position]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    const size = 300;
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Create circular clipping path
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Fill background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, size, size);

    // Calculate image dimensions
    const scale = (size / Math.min(img.width, img.height)) * zoom;
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (size - w) / 2 + position.x;
    const y = (size - h) / 2 + position.y;

    // Draw image
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = 300 / rect.width;
    const scaleY = 300 / rect.height;
    setIsDragging(true);
    setDragStart({ 
      x: (e.clientX - rect.left) * scaleX - position.x, 
      y: (e.clientY - rect.top) * scaleY - position.y 
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = 300 / rect.width;
    const scaleY = 300 / rect.height;
    setPosition({
      x: (e.clientX - rect.left) * scaleX - dragStart.x,
      y: (e.clientY - rect.top) * scaleY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Create a new canvas for the final circular image
    const finalCanvas = document.createElement('canvas');
    const size = 300;
    finalCanvas.width = size;
    finalCanvas.height = size;
    const ctx = finalCanvas.getContext('2d');
    
    // Draw circular clipped image
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
    
    const croppedImage = finalCanvas.toDataURL('image/png', 1.0);
    onSave(croppedImage);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: T.card,
        borderRadius: 20,
        padding: 30,
        maxWidth: 420,
        width: '90%',
        border: `1px solid ${T.bord}`,
        animation: 'popIn 0.3s ease'
      }}>
        <div style={{
          fontSize: '1.3rem',
          fontWeight: 800,
          marginBottom: 8,
          fontFamily: 'Fraunces,serif'
        }}>
          📸 Adjust Photo
        </div>
        <div style={{
          fontSize: '.82rem',
          color: T.text2,
          marginBottom: 24
        }}>
          Drag to reposition, use slider to zoom
        </div>

        {/* Canvas */}
        <div style={{
          position: 'relative',
          width: 300,
          height: 300,
          margin: '0 auto 20px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: `3px solid ${T.gold}`,
          boxShadow: `0 0 30px ${T.gold}40`,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none'
        }}>
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ 
              display: 'block', 
              width: '100%', 
              height: '100%',
              touchAction: 'none'
            }}
          />
        </div>

        {/* Zoom Slider */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10
          }}>
            <span style={{ fontSize: '.75rem', color: T.text3, fontWeight: 700 }}>
              🔍 ZOOM
            </span>
            <span style={{ fontSize: '.8rem', color: T.gold, fontWeight: 700 }}>
              {Math.round(zoom * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            style={{
              width: '100%',
              accentColor: T.gold,
              cursor: 'pointer'
            }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 12,
              border: `1px solid ${T.bord}`,
              background: 'transparent',
              color: T.text2,
              fontSize: '.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all .2s',
              fontFamily: 'Satoshi,sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)';
              e.currentTarget.style.color = T.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.bord;
              e.currentTarget.style.color = T.text2;
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 12,
              border: 'none',
              background: `linear-gradient(135deg, ${T.gold}, #ff7a30)`,
              color: '#030810',
              fontSize: '.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all .2s',
              fontFamily: 'Satoshi,sans-serif',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 20px ${T.gold}50`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ✓ Save Photo
          </button>
        </div>
      </div>
    </div>
  );
}
