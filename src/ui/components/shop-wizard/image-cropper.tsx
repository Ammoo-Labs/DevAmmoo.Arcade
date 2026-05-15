"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { X, ZoomIn, ZoomOut, Check, Move } from "lucide-react";

interface ImageCropperProps {
  imageUrl: string;
  aspectRatio: number;      // width / height  (1 = square, 3 = banner)
  shape?: "circle" | "rect";
  viewportWidth?: number;   // pixel width of the crop preview window
  onCrop: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

export default function ImageCropper({
  imageUrl,
  aspectRatio,
  shape = "rect",
  viewportWidth = 300,
  onCrop,
  onCancel,
}: ImageCropperProps) {
  const vpW = viewportWidth;
  const vpH = useMemo(() => Math.round(vpW / aspectRatio), [vpW, aspectRatio]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // naturalWidth / naturalHeight of the source image
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  // Base displayed size (covers the viewport at zoom = 1)
  const [imgBase, setImgBase] = useState({ w: vpW, h: vpH });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const clampOffset = useCallback(
    (x: number, y: number, z: number, base: { w: number; h: number }) => {
      const scaledW = base.w * z;
      const scaledH = base.h * z;
      const maxX = Math.max(0, (scaledW - vpW) / 2);
      const maxY = Math.max(0, (scaledH - vpH) / 2);
      return {
        x: Math.max(-maxX, Math.min(maxX, x)),
        y: Math.max(-maxY, Math.min(maxY, y)),
      };
    },
    [vpW, vpH]
  );

  // Load image metadata, draw initial frame
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      // "cover" scale: image fills the viewport at zoom = 1
      const fitScale = Math.max(vpW / nw, vpH / nh);
      const base = { w: nw * fitScale, h: nh * fitScale };
      setNaturalSize({ w: nw, h: nh });
      setImgBase(base);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    };
    img.src = imageUrl;
  }, [imageUrl, vpW, vpH]);

  // Re-draw the canvas preview whenever zoom, offset or base changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || naturalSize.w === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaledW = imgBase.w * zoom;
    const scaledH = imgBase.h * zoom;

    // Top-left corner of the image relative to the viewport top-left
    const imgLeft = (vpW - scaledW) / 2 + offset.x;
    const imgTop = (vpH - scaledH) / 2 + offset.y;

    // Source rectangle in natural-image coordinates
    const scaleToNat = naturalSize.w / scaledW; // same ratio as naturalH / scaledH
    const srcX = Math.max(0, -imgLeft * scaleToNat);
    const srcY = Math.max(0, -imgTop * scaleToNat);
    const srcW = Math.min(naturalSize.w - srcX, vpW * scaleToNat);
    const srcH = Math.min(naturalSize.h - srcY, vpH * scaleToNat);

    canvas.width = vpW;
    canvas.height = vpH;
    ctx.clearRect(0, 0, vpW, vpH);
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, vpW, vpH);

    // Clip circle if needed
    if (shape === "circle") {
      ctx.save();
      ctx.beginPath();
      ctx.arc(vpW / 2, vpH / 2, Math.min(vpW, vpH) / 2, 0, Math.PI * 2);
      ctx.clip();
    }

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, vpW, vpH);
      if (shape === "circle") ctx.restore();

      // Draw grid overlay
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo((vpW / 3) * i, 0);
        ctx.lineTo((vpW / 3) * i, vpH);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, (vpH / 3) * i);
        ctx.lineTo(vpW, (vpH / 3) * i);
        ctx.stroke();
      }
    };
    img.src = imageUrl;
  }, [zoom, offset, imgBase, naturalSize, vpW, vpH, shape, imageUrl]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({ x: e.touches[0].clientX - offset.x, y: e.touches[0].clientY - offset.y });
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setOffset(clampOffset(e.clientX - dragStart.x, e.clientY - dragStart.y, zoom, imgBase));
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      e.preventDefault();
      setOffset(
        clampOffset(e.touches[0].clientX - dragStart.x, e.touches[0].clientY - dragStart.y, zoom, imgBase)
      );
    };
    const stopDrag = () => setIsDragging(false);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", stopDrag);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", stopDrag);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", stopDrag);
    };
  }, [isDragging, dragStart, zoom, imgBase, clampOffset]);

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
    setOffset((prev) => clampOffset(prev.x, prev.y, newZoom, imgBase));
  };

  // Produce the final high-res crop using the same math as the preview canvas
  const applyCrop = () => {
    if (naturalSize.w === 0) return;

    const scaledW = imgBase.w * zoom;
    const imgLeft = (vpW - scaledW) / 2 + offset.x;
    const imgTop = (vpH - imgBase.h * zoom) / 2 + offset.y;

    // How many natural pixels per displayed pixel
    const scaleToNat = naturalSize.w / scaledW;

    const srcX = Math.max(0, -imgLeft * scaleToNat);
    const srcY = Math.max(0, -imgTop * scaleToNat);
    const srcW = Math.min(naturalSize.w - srcX, vpW * scaleToNat);
    const srcH = Math.min(naturalSize.h - srcY, vpH * scaleToNat);

    // Output resolution: preserve aspect ratio at 800px wide
    const outW = shape === "circle" ? 800 : Math.round(800 * aspectRatio);
    const outH = 800;

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (shape === "circle") {
      ctx.beginPath();
      ctx.arc(outW / 2, outH / 2, outW / 2, 0, Math.PI * 2);
      ctx.clip();
    }

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, outW, outH);
      onCrop(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.src = imageUrl;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">
            {shape === "circle" ? "Crop Profile Picture" : "Crop Cover Image"}
          </h3>
          <button
            onClick={onCancel}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas-based crop preview */}
        <div className="flex justify-center mb-3">
          <canvas
            ref={canvasRef}
            width={vpW}
            height={vpH}
            className={`select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"} ${
              shape === "circle" ? "rounded-full ring-2 ring-black ring-offset-2" : "rounded-xl"
            }`}
            style={{ width: vpW, height: vpH, display: "block" }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          />
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-gray-400 mb-3 flex items-center justify-center gap-1">
          <Move className="w-3 h-3" />
          Drag to reposition · use slider to zoom
        </p>

        {/* Zoom Slider */}
        <div className="flex items-center gap-3 mb-5 px-1">
          <button onClick={() => handleZoomChange(Math.max(1, zoom - 0.1))} className="text-gray-400 hover:text-gray-700">
            <ZoomOut className="w-4 h-4" />
          </button>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
            className="flex-1 accent-black"
          />
          <button onClick={() => handleZoomChange(Math.min(3, zoom + 0.1))} className="text-gray-400 hover:text-gray-700">
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-400 w-10 text-right">{Math.round(zoom * 100)}%</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={applyCrop}
            className="flex-1 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}
