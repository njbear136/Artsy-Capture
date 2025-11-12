import React, { useState } from 'react';

export default function Toolbar({
  onAddPhoto,
  onAddAsset,
  uploadedFiles,
  onSelectUploadedFile,
  onEnableDrawing,
  onDisableDrawing,
  onChangeBrushColor,
  onChangeBrushWidth,
  isDrawingMode,
  onSave,
  onReset,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [brushColor, setBrushColor] = useState('#ff6b9d');
  const [brushWidth, setBrushWidth] = useState(5);

  const handleColorChange = (e) => {
    const color = e.target.value;
    setBrushColor(color);
    onChangeBrushColor(color);
  };

  const handleBrushWidthChange = (e) => {
    const width = parseInt(e.target.value);
    setBrushWidth(width);
    onChangeBrushWidth(width);
  };

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        {/* Add Photo Button */}
        <label className="btn btn-secondary file-btn" title="Upload Photo to Canvas">
          <span className="btn-icon">📷</span>
          Add Photo
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onAddAsset(f);
              e.target.value = null;
            }}
            style={{ display: "none" }}
          />
        </label>

        {/* Uploaded Files Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowDropdown(!showDropdown)}
            title="Select from uploaded files"
          >
            <span className="btn-icon">📁</span>
            Uploaded Files
            <span style={{ marginLeft: 4 }}>▼</span>
          </button>
          
          {showDropdown && (
            <div className="dropdown-menu">
              {uploadedFiles && uploadedFiles.length > 0 ? (
                uploadedFiles.map((file, index) => (
                  <button
                    key={index}
                    className="dropdown-item"
                    onClick={() => {
                      onSelectUploadedFile(file);
                      setShowDropdown(false);
                    }}
                  >
                    <span className="btn-icon">🖼️</span>
                    {file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}
                  </button>
                ))
              ) : (
                <div className="dropdown-item" style={{ color: '#999', cursor: 'default' }}>
                  No files uploaded yet
                </div>
              )}
            </div>
          )}
        </div>

        {/* Draw Tool */}
        <button 
          className={`btn ${isDrawingMode ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => {
            if (isDrawingMode) {
              onDisableDrawing();
            } else {
              onEnableDrawing();
            }
          }}
          title={isDrawingMode ? "Disable Drawing Mode" : "Enable Drawing Mode"}
        >
          <span className="btn-icon">✏️</span>
          {isDrawingMode ? 'Stop Drawing' : 'Draw'}
        </button>
      </div>

      <div className="toolbar-right">
        <button className="btn btn-primary" onClick={onSave} title="Save Merged Image (PNG)">
          <span className="btn-icon">💾</span>
          Save
        </button>
        <button className="btn btn-outline" onClick={onReset} title="Clear Canvas">
          <span className="btn-icon">🗑️</span>
          Clear
        </button>
      </div>

      {/* COLOR WHEEL PICKER */}
      {isDrawingMode && (
        <div className="pen-controls-bottom">
          <div className="color-picker-section">
            <div className="color-display">
              <div 
                className="current-color-circle" 
                style={{ backgroundColor: brushColor }}
                title="Current Color"
              />
              <span className="color-hex">{brushColor}</span>
            </div>
            
            <div className="color-wheel-container">
              <label className="color-wheel-label">
                🎨 Pick Any Color:
                <input
                  type="color"
                  value={brushColor}
                  onChange={handleColorChange}
                  className="color-wheel-input"
                />
              </label>
            </div>
          </div>

          <div className="brush-section">
            <span className="section-label">Brush Size: {brushWidth}px</span>
            <input
              type="range"
              min="1"
              max="50"
              value={brushWidth}
              onChange={handleBrushWidthChange}
              className="brush-slider-large"
            />
          </div>
        </div>
      )}
    </div>
  );
}