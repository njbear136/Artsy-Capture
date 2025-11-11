import React, { useEffect, useRef, useState } from "react";
import Toolbar from "./Toolbar.jsx";

export default function CanvasEditor({
  mainPhoto,
  assetFiles,
  setMainPhoto,
  setAssetFiles,
}) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  // ==================== CANVAS INITIALIZATION ====================
  useEffect(() => {
    if (typeof fabric === "undefined") {
      console.error("Fabric.js is not loaded. Check your script tag.");
      return;
    }

    const container = document.getElementById("canvas-wrap");
    if (!container || !canvasRef.current) return;

    // Initialize canvas after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      try {
        const containerRect = container.getBoundingClientRect();
        let initialWidth = containerRect.width - 80;
        let initialHeight = containerRect.height - 200;
        
        // Ensure minimum dimensions
        initialWidth = Math.max(Math.min(initialWidth, 800), 400);
        initialHeight = Math.max(Math.min(initialHeight, 600), 300);

        const canvas = new fabric.Canvas(canvasRef.current, {
          backgroundColor: "#fff",
          preserveObjectStacking: true,
          selection: true,
          allowTouchScrolling: true,
          width: initialWidth,
          height: initialHeight,
        });

        fabricRef.current = canvas;
        setCanvasReady(true);
        console.log("Canvas initialized successfully!");

        // Handle Delete/Backspace key
        const handleKeyPress = (e) => {
          if (!fabricRef.current) return;
          const activeObject = fabricRef.current.getActiveObject();
          if ((e.key === "Delete" || e.key === "Backspace") && activeObject) {
            fabricRef.current.remove(activeObject);
            fabricRef.current.renderAll();
          }
        };

        window.addEventListener("keydown", handleKeyPress);

        // Store cleanup function
        return () => {
          window.removeEventListener("keydown", handleKeyPress);
          if (fabricRef.current) {
            try {
              fabricRef.current.dispose();
            } catch (e) {
              console.error("Error disposing canvas:", e);
            }
            fabricRef.current = null;
          }
        };
      } catch (error) {
        console.error("Error initializing canvas:", error);
      }
    }, 150);

    // Cleanup timer on unmount
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // ==================== LOAD MAIN PHOTO ====================
  useEffect(() => {
    if (mainPhoto && canvasReady && fabricRef.current) {
      console.log("Loading main photo...");
      loadBackgroundImage(mainPhoto);
    }
  }, [mainPhoto, canvasReady]);

  // ==================== LOAD ASSET FILES ====================
  useEffect(() => {
    if (assetFiles && assetFiles.length > 0 && canvasReady && fabricRef.current) {
      console.log("Loading asset files...");
      assetFiles.forEach((file) => addStickerToCanvas(file));
      setAssetFiles([]);
    }
  }, [assetFiles, canvasReady, setAssetFiles]);

  // ==================== HELPER FUNCTIONS ====================

  function loadBackgroundImage(file) {
    const canvas = fabricRef.current;
    if (!canvas || !(file instanceof File)) {
      console.error("Canvas not ready or invalid file");
      return;
    }

    setIsLoading(true);

    const reader = new FileReader();
    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      setIsLoading(false);
    };
    
    reader.onload = function (event) {
      if (!event.target || !event.target.result) {
        console.error("Failed to read file");
        setIsLoading(false);
        return;
      }

      try {
        fabric.Image.fromURL(
          event.target.result,
          (img) => {
            if (!img || !fabricRef.current) {
              console.error("Failed to load image");
              setIsLoading(false);
              return;
            }

            const canvasW = fabricRef.current.getWidth();
            const canvasH = fabricRef.current.getHeight();
            const scaleFactor = Math.min(canvasW / img.width, canvasH / img.height) * 0.9;

            img.set({
              scaleX: scaleFactor,
              scaleY: scaleFactor,
              originX: "center",
              originY: "center",
              left: canvasW / 2,
              top: canvasH / 2,
              selectable: false,
              evented: false,
            });

            fabricRef.current.setBackgroundImage(img, () => {
              if (fabricRef.current) {
                fabricRef.current.renderAll();
                console.log("Background image loaded successfully!");
              }
              setIsLoading(false);
            });
          },
          { crossOrigin: "anonymous" }
        );
      } catch (error) {
        console.error("Error loading image:", error);
        setIsLoading(false);
      }
    };
    
    reader.readAsDataURL(file);
  }

  function addStickerToCanvas(file) {
    const canvas = fabricRef.current;
    if (!canvas || !(file instanceof File)) {
      console.error("Canvas not ready or invalid sticker file");
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      console.error("Error reading sticker file");
    };

    reader.onload = function (ev) {
      if (!ev.target || !ev.target.result || !fabricRef.current) return;

      try {
        fabric.Image.fromURL(
          ev.target.result,
          (img) => {
            if (!img || !fabricRef.current) return;

            const canvas = fabricRef.current;
            const scale = Math.min(canvas.getWidth() / img.width, canvas.getHeight() / img.height) * 0.4;

            // CRITICAL FIX: Set properties that allow interaction
            img.set({
              left: canvas.getWidth() / 2,
              top: canvas.getHeight() / 2,
              originX: "center",
              originY: "center",
              scaleX: scale,
              scaleY: scale,
              // Enable all interactions
              selectable: true,
              evented: true,
              hasControls: true,
              hasBorders: true,
              lockMovementX: false,
              lockMovementY: false,
              lockRotation: false,
              lockScalingX: false,
              lockScalingY: false,
              // Style the controls
              cornerStyle: "circle",
              cornerSize: 12,
              transparentCorners: false,
              borderColor: "#ff85a1",
              cornerColor: "#ff85a1",
              cornerStrokeColor: "#fff",
              borderScaleFactor: 2,
            });

            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
            console.log("Sticker added successfully!");
          },
          { crossOrigin: "anonymous" }
        );
      } catch (error) {
        console.error("Error adding sticker:", error);
      }
    };
    
    reader.readAsDataURL(file);
  }

  function addPresetFrame(frameType = "polaroid") {
    const canvas = fabricRef.current;
    if (!canvas) return;

    try {
      if (frameType === "polaroid") {
        const rect = new fabric.Rect({
          left: canvas.getWidth() / 2,
          top: canvas.getHeight() / 2,
          originX: "center",
          originY: "center",
          width: canvas.getWidth() * 0.9,
          height: canvas.getHeight() * 0.85,
          fill: "rgba(255,255,255,0.95)",
          stroke: "#fff",
          strokeWidth: 2,
          selectable: false,
          shadow: new fabric.Shadow({
            color: "rgba(0,0,0,0.15)",
            blur: 15,
            offsetX: 0,
            offsetY: 5,
          }),
        });

        const bottom = new fabric.Rect({
          left: rect.left,
          top: rect.top + rect.height / 2 - 40,
          originX: "center",
          originY: "center",
          width: rect.width * 0.92,
          height: 60,
          fill: "rgba(250,250,250,1)",
          selectable: false,
        });

        const group = new fabric.Group([rect, bottom], {
          left: canvas.getWidth() / 2,
          top: canvas.getHeight() / 2,
          originX: "center",
          originY: "center",
          selectable: false,
          evented: false,
        });

        canvas.add(group);
        canvas.sendToBack(group);
        canvas.renderAll();
      } else {
        const frame = new fabric.Rect({
          left: canvas.getWidth() / 2,
          top: canvas.getHeight() / 2,
          originX: "center",
          originY: "center",
          width: canvas.getWidth() * 0.95,
          height: canvas.getHeight() * 0.95,
          fill: "transparent",
          stroke: "#ffafc1",
          strokeWidth: 16,
          selectable: false,
          evented: false,
        });

        canvas.add(frame);
        canvas.sendToBack(frame);
        canvas.renderAll();
      }
    } catch (error) {
      console.error("Error adding frame:", error);
    }
  }

  function saveMergedImage() {
    const canvas = fabricRef.current;
    if (!canvas) return;

    try {
      canvas.discardActiveObject();
      canvas.renderAll();

      const dataUrl = canvas.toDataURL({ format: "png", quality: 1.0 });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `artsy_capture_${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error("Error saving image:", error);
      alert("Error saving image. Please try again.");
    }
  }

  function resetCanvas() {
    const canvas = fabricRef.current;
    if (!canvas) return;

    try {
      canvas.clear();
      canvas.setBackgroundColor("#ffffff", canvas.renderAll.bind(canvas));
      setMainPhoto(null);
      setAssetFiles([]);
    } catch (error) {
      console.error("Error resetting canvas:", error);
    }
  }

  // ==================== RENDER ====================
  return (
    <div id="canvas-wrap" className="canvas-area">
      <Toolbar
        onAddPhoto={(file) => {
          if (canvasReady) {
            setMainPhoto(file);
          }
        }}
        onAddPreset={() => addPresetFrame("polaroid")}
        onAddBorder={() => addPresetFrame("border")}
        onAddAsset={(file) => {
          if (canvasReady) {
            setAssetFiles((prev) => [...prev, file]);
          }
        }}
        onSave={saveMergedImage}
        onReset={resetCanvas}
      />

      <div className="canvas-holder">
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p style={{ marginTop: 20, color: "#666" }}>Loading image...</p>
          </div>
        )}
        {!canvasReady && (
          <div style={{ color: "#999", fontSize: 14 }}>Initializing canvas...</div>
        )}
        <canvas id="artsy-canvas" ref={canvasRef} />
      </div>
    </div>
  );
}