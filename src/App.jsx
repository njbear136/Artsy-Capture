import React from "react";
import CanvasEditor from "./src/CanvasEditor";

export default function App(){
  return(
    <div className= "app-root">
    <div className= "left-panel">
    <header className="app-header">
    <h1>Artsy Capture</h1>
    <p className= "tag">Upload or snap a photo -- add frames, doodles & stickers</p>
    </header>
    <div className= "controls-block">
    <h3> Get a photo</h3>
    <input
     id="upload-photo"
     type= "file"
     accept= "image/*"
     onChange={(e)=>{
      //delegated to CanvasEditor via custom event
      const evt= new CustomEvent("artsy-upload-photo",{detail: e.target.files});
      window.dispatchEvent(evt);
     }}
     />

     <small className= "hint">Or use your camera on mobile(use the file picker)</small>
     <hr/>
     <h3>Add your art</h3>
     <p className= "hint">Add frames/doodles/stickers from files below or use presets</p>

     {/* Frame/doddle upload for the toolbar(delegated to Toolbar)*/}
     <input
     id= "upload-art"
     type= "file"
     accept= "image/*"
     onChange={(e)=> {
      const evt= new CustomEvent("artsy-upload-asset",{detail: e.target.files});
      window.dispatchEvent(evt);
     }}
     />
     <small className= "hint"> Upload PNG/SVG with transparent background to use as sticker/frame</small>
     <hr/>

     <div style={{marginTop: 12}}>
     <p style={{margin: 0, fontWeight:600}}>Quick tips</p>
     <ul className= "tip-list">
     <li>Drag/resize/rotate stickers on the canvas</li>
     <li>Use the Save button to download a merged PNG</li>
     <li>Click a sticket and press Delete to remove it</li>
     </ul>

     </div>
     </div>
     </div>

     <div className= "right-panel">
     <CanvasEditor/>
     </div>
     </div>
    );
  }