import React from 'react';

export default function Toolbar({
  onAddPhoto,
  onAddPreset,
  onAddBorder,
  onAddAsset,
  onSave,
  onReset,
}) {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <label className="btn btn-secondary file-btn" title="Upload or Change Background Photo">
          <span className="btn-icon">🖼️</span>
          Add Photo
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onAddPhoto(f);
              e.target.value = null;
            }}
            style={{ display: "none" }}
          />
        </label>
        
        <label className="btn btn-secondary file-btn" title="Upload Sticker/Asset">
          <span className="btn-icon">✨</span>
          Add Sticker
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

        <button className="btn btn-secondary" onClick={onAddPreset} title="Add Polaroid Style Frame">
          <span className="btn-icon">📸</span>
          Polaroid
        </button>
        <button className="btn btn-secondary" onClick={onAddBorder} title="Add Pink Border Frame">
          <span className="btn-icon">🎨</span>
          Pink Border
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
    </div>
  );
}