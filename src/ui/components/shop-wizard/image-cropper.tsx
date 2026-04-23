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

  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgBase, setImgBase] = useState({ w: vpW, h: vpH });

  const handleImageLoad = () => {
    const img = imageRef.current;
    if (!img) return;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    // "cover" scale: image fills the viewport at zoom=1
    const fitScale = Math.max(vpW / nw, vpH / nh);
    setImgBase({ w: nw * fitScale, h: nh * fitScale });
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const clampOffset = useCallback(
    (x: number, y: number, z: number) => {
      const scaledW = imgBase.w * z;
      const scaledH = imgBase.h * z;
      const maxX = Math.max(0, (scaledW - vpW) / 2);
      const maxY = Math.max(0, (scaledH - vpH) / 2);
      return {
        x: Math.max(-maxX, Math.min(maxX, x)),
        y: Math.max(-maxY, Math.min(maxY, y)),
      };
    },
    [imgBase, vpW, vpH]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - offset.x,
      y: e.touches[0].clientY - offset.y,
    });
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setOffset(clampOffset(e.clientX - dragStart.x, e.clientY - dragStart.y, zoom));
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      e.preventDefault();
      setOffset(
        clampOffset(
          e.touches[0].clientX - dragStart.x,
          e.touches[0].clientY - dragStart.y,
          zoom
        )
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
  }, [isDragging, dragStart, zoom, clampOffset]);

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
    setOffset((prev) => clampOffset(prev.x, prev.y, newZoom));
  };

  const applyCrop = () => {
    const vp = viewportRef.current;
    const img = imageRef.current;
    if (!vp || !img) return;

    // getBoundingClientRect gives actual rendered positions accounting for CSS transforms
    const vpRect = vp.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    // Crop region in rendered image coordinates
    const srcX_px = vpRect.left - imgRect.left;
    const srcY_px = vpRect.top - imgRect.top;

    // Scale from rendered size to natural size
    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;

    const srcX = Math.max(0, srcX_px * scaleX);
    const srcY = Math.max(0, srcY_px * scaleY);
    const srcW = Math.min(img.naturalWidth - srcX, vpRect.width * scaleX);
    const srcH = Math.min(img.naturalHeight - srcY, vpRect.height * scaleY);

    // Output canvas dimensions
    const outW = shape === "circle" ? 400 : Math.round(400 * aspectRatio);
    const outH = 400;

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

    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, outW, outH);
    onCrop(canvas.toDataURL("image/jpeg", 0.92));
  };

  const scaledW = imgBase.w * zoom;
  const scaledH = imgBase.h * zoom;

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

        {/* Crop Viewport */}
        <div className="flex justify-center mb-3">
          <div
            ref={viewportRef}
            className={`relative bg-gray-900 select-none overflow-hidden ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            } ${shape === "circle" ? "rounded-full ring-2 ring-black ring-offset-2" : "rounded-xl"}`}
            style={{ width: vpW, height: vpH }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {/* Rule-of-thirds grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                backgroundImage: [
                  `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)`,
                  `linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
                ].join(", "),
                backgroundSize: `${vpW / 3}px ${vpH / 3}px`,
              }}
            />
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Crop preview"
              onLoad={handleImageLoad}
              draggable={false}
              style={{
                position: "absolute",
                width: scaledW,
                height: scaledH,
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
                userSelect: "none",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-gray-400 mb-3 flex items-center justify-center gap-1">
          <Move className="w-3 h-3" />
          Drag to reposition · pinch or use slider to zoom
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
          <span className="text-xs text-gray-400 w-10 text-right">
            {Math.round(zoom * 100)}%
          </span>
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
