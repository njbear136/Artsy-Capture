import React, { useState } from "react";
import CanvasEditor from "./CanvasEditor.jsx";

export default function App() {
  const [mainPhoto, setMainPhoto] = useState(null);
  const [assetFiles, setAssetFiles] = useState([]);

  return (
    <div className="app-root">
      <div className="left-panel">
        <header className="app-header">
          <h1>Artsy Capture</h1>
          <p className="tag">
            Upload or snap a photo — add frames, doodles & stickers
          </p>
        </header>

        <div className="controls-block">
          <div>
            <h3>📷 Get a photo</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files.length) {
                  setMainPhoto(e.target.files[0]);
                }
              }}
            />
            <small className="hint">
              Or use your camera on mobile (use the file picker)
            </small>
          </div>

          <hr />

          <div>
            <h3>🎨 Add your art</h3>
            <p className="hint">
              Add frames/doodles/stickers from files below or use presets
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files.length) {
                  setAssetFiles(Array.from(e.target.files));
                }
              }}
            />
            <small className="hint">
              Upload PNG/SVG with transparent background to use as sticker/frame
            </small>
          </div>

          <hr />

          <div>
            <p style={{ fontWeight: 600, marginBottom: 8, fontSize: 15 }}>
              💡 Quick tips
            </p>
            <ul className="tip-list">
              <li>Drag, resize, and rotate stickers on the canvas</li>
              <li>Use the Save button to download a merged PNG</li>
              <li>Click a sticker and press Delete to remove it</li>
              <li>Add multiple stickers and layer them creatively</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="right-panel">
        <CanvasEditor
          mainPhoto={mainPhoto}
          assetFiles={assetFiles}
          setMainPhoto={setMainPhoto}
          setAssetFiles={setAssetFiles}
        />
      </div>
    </div>
  );
}