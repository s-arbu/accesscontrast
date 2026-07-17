import React, { useState, useRef, useEffect } from 'react';
import type { HistoryItem } from '../../hooks/useColorContrast';
import type { ColorRgb } from '../../utils/contrast';
import { rgbToHex, calculateContrast } from '../../utils/contrast';
import { lineWobble } from 'ldrs';

lineWobble.register();

interface InteractiveCanvasProps {
  uploadedImage: string | null;
  setUploadedImage: (img: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isHeatmapActive: boolean;
  setIsHeatmapActive: (active: boolean) => void;
  pickMode: 'foreground' | 'background' | null;
  setPickMode: (mode: 'foreground' | 'background' | null) => void;
  foreground: ColorRgb;
  background: ColorRgb;
  updateColor: (next: ColorRgb, target: 'foreground' | 'background') => void;
  addHistory: (nextItem: HistoryItem) => void;
  showToast: (msg: string, variant: 'success' | 'error') => void;
}

export function InteractiveCanvas({
  uploadedImage,
  setUploadedImage,
  isLoading,
  setIsLoading,
  isHeatmapActive,
  setIsHeatmapActive,
  pickMode,
  setPickMode,
  foreground,
  background,
  updateColor,
  addHistory,
  showToast
}: InteractiveCanvasProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [kbCoords, setKbCoords] = useState<{ x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const magnifierRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const maxFileSize = 5 * 1024 * 1024;

  // Draw the canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const offscreen = offscreenRef.current;
    const image = imageRef.current;
    if (!canvas || !offscreen || !image) return;

    const maxWidth = 900;
    let width = image.width;
    let height = image.height;
    if (width > maxWidth) {
      const ratio = maxWidth / width;
      width = maxWidth;
      height = Math.round(height * ratio);
    }

    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d')?.drawImage(image, 0, 0, width, height);

    offscreen.width = image.width;
    offscreen.height = image.height;
    offscreen.getContext('2d')?.drawImage(image, 0, 0);
  };

  // Contrast-edge heatmap
  const applyContrastHeatmap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawCanvas(); // Reset to the original image
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Scan pixels and compute contrast
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const lum = 0.2126 * data[idx] + 0.7152 * data[idx + 1] + 0.0722 * data[idx + 2];

        const rightIdx = (y * width + x + 1) * 4;
        const lum2 = 0.2126 * data[rightIdx] + 0.7152 * data[rightIdx + 1] + 0.0722 * data[rightIdx + 2];

        const delta = Math.abs(lum - lum2);

        if (delta > 15) { // Edge detected
          if (delta < 50) { 
            // Low contrast -> red
            data[idx] = 255; data[idx + 1] = 50; data[idx + 2] = 50; data[idx + 3] = 255;
          } else {
            // Enough contrast -> green
            data[idx] = 34; data[idx + 1] = 197; data[idx + 2] = 94; data[idx + 3] = 255;
          }
        } else {
          // No edge -> darker grayscale for edge emphasis
          const avg = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          data[idx] = avg * 0.25; 
          data[idx + 1] = avg * 0.25; 
          data[idx + 2] = avg * 0.25; 
          data[idx + 3] = 230; 
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const toggleHeatmap = () => {
    if (isHeatmapActive) {
      drawCanvas();
      setIsHeatmapActive(false);
    } else {
      applyContrastHeatmap();
      setIsHeatmapActive(true);
      showToast('Low contrast layout edges highlighted!', 'success');
    }
  };

  // Pick a color at client coordinates
  const pickAtClientCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const offscreen = offscreenRef.current;
    const img = imageRef.current;
    if (!canvas || !offscreen || !img) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = img.width / rect.width;
    const scaleY = img.height / rect.height;

    const px = Math.floor((clientX - rect.left) * scaleX);
    const py = Math.floor((clientY - rect.top) * scaleY);

    if (px < 0 || px >= img.width || py < 0 || py >= img.height) return;

    const data = offscreen.getContext('2d')?.getImageData(px, py, 1, 1).data;
    if (!data) return;

    const color = { r: data[0], g: data[1], b: data[2] };
    const targetMode = pickMode === 'foreground' ? 'foreground' : 'background';
    
    updateColor(color, targetMode);

    const nextItem: HistoryItem = {
      fg: rgbToHex(targetMode === 'foreground' ? color : foreground),
      bg: rgbToHex(targetMode === 'background' ? color : background),
      ratio: calculateContrast(
        targetMode === 'foreground' ? color : foreground,
        targetMode === 'background' ? color : background
      ).ratio,
    };
    addHistory(nextItem);

    // Auto-switch logic
    if (targetMode === 'foreground') {
      setPickMode('background');
    }
  };

  const pickFromCanvas = (e: React.MouseEvent<HTMLCanvasElement>) => {
    pickAtClientCoords(e.clientX, e.clientY);
  };

  // Magnifier rendering via native events
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const mag = magnifierRef.current;
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!mag || !canvas || !img) return;

    const ctx = mag.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = img.width / rect.width;
    const scaleY = img.height / rect.height;

    const px = Math.floor((e.clientX - rect.left) * scaleX);
    const py = Math.floor((e.clientY - rect.top) * scaleY);

    const sample = 21;
    const halfSample = Math.floor(sample / 2);

    ctx.clearRect(0, 0, mag.width, mag.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, px - halfSample, py - halfSample, sample, sample, 0, 0, mag.width, mag.height);

    const pixelSize = mag.width / sample;
    const center = (mag.width / 2) - (pixelSize / 2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.strokeRect(center - 1, center - 1, pixelSize + 2, pixelSize + 2);
    ctx.strokeStyle = pickMode === 'foreground' ? '#3b82f6' : '#ffffff';
    ctx.strokeRect(center, center, pixelSize, pixelSize);

    mag.style.transform = `translate3d(${e.clientX - mag.width / 2}px, ${e.clientY - mag.height - 20}px, 0)`;
  };

  // Keyboard support for the canvas
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    if (!kbCoords) {
      setKbCoords({ x: rect.width / 2, y: rect.height / 2 });
      return;
    }

    const step = e.shiftKey ? 15 : 3;
    let nextX = kbCoords.x;
    let nextY = kbCoords.y;

    if (e.key === 'ArrowUp') nextY = Math.max(0, kbCoords.y - step);
    else if (e.key === 'ArrowDown') nextY = Math.min(rect.height, kbCoords.y + step);
    else if (e.key === 'ArrowLeft') nextX = Math.max(0, kbCoords.x - step);
    else if (e.key === 'ArrowRight') nextX = Math.min(rect.width, kbCoords.x + step);
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      pickAtClientCoords(rect.left + kbCoords.x, rect.top + kbCoords.y);
      showToast(`Selected color via Keyboard!`, 'success');
      return;
    } else return;

    e.preventDefault();
    setKbCoords({ x: nextX, y: nextY });
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file only.', 'error');
      return;
    }
    if (file.size > maxFileSize) {
      showToast('Image too large. Max 5MB allowed.', 'error');
      return;
    }

    setIsLoading(true); 
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setTimeout(() => { // Delay for the loader
          imageRef.current = img;
          setUploadedImage(reader.result as string);
          setIsHeatmapActive(false);
          setIsLoading(false);
          showToast('Image loaded successfully.', 'success');
        }, 600);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (uploadedImage) {
      // The ref is empty after route changes.
      // Recreate the image object.
      if (!imageRef.current) {
        const img = new Image();
        img.onload = () => {
          imageRef.current = img;
          drawCanvas();
          // Reapply the heatmap if it was active before the tab switch
          if (isHeatmapActive) applyContrastHeatmap();
        };
        img.src = uploadedImage;
      } else {
        // Normal draw after a fresh upload
        drawCanvas();
        if (isHeatmapActive) applyContrastHeatmap();
      }
    }
  }, [uploadedImage, isHeatmapActive]);

  const resetImage = () => {
    setUploadedImage(null);
    imageRef.current = null;
    setIsHeatmapActive(false);
    setKbCoords(null);
  };

  return (
    <div className="w-full">
      <div style={{ display: 'none' }}><canvas ref={offscreenRef} /></div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-6 animate-in fade-in duration-200">
          <l-line-wobble size="80" stroke="5" speed="1.75" color="#3b82f6"></l-line-wobble>
          <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">Processing image data...</p>
        </div>
      ) : !uploadedImage ? (
        <div className="relative group w-full h-[400px] overflow-hidden rounded-[32px] p-[2px] shadow-sm">
          {/* The rotating edge stays active in the background */}
          <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_70%,#3b82f6_100%)] animate-[spin_8s_linear_infinite]" />
          
          <label
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
            /* All hover and dark-mode transitions were removed here */
            className={`relative flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-[30px] z-10 ${
              isDragging ? 'bg-blue-50/90 dark:bg-blue-950/40' : 'bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 hover:bg-slate-100'
            }`}
          >
            <input type="file" ref={fileInputRef} className="sr-only" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            
            <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-slate-200/40 text-blue-600 dark:bg-slate-800/60 dark:text-blue-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
            </div>
            
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              Drop your screenshot here
            </p>
            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              or click to browse local files <span className="opacity-60">(Max 5MB)</span>
            </p>
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Pick mode switcher */}
            <div className="flex items-center gap-1.5 rounded-[20px] bg-slate-200/60 p-1.5 dark:bg-slate-800/60">
              <button
                onClick={() => setPickMode('foreground')}
                className={`rounded-2xl px-5 py-2.5 text-sm font-bold transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  pickMode === 'foreground' 
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white' 
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                Text Color
              </button>
              <button
                onClick={() => setPickMode('background')}
                className={`rounded-2xl px-5 py-2.5 text-sm font-bold transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  pickMode === 'background' 
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white' 
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                Bg Color
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleHeatmap}
                className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isHeatmapActive 
                    ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400' 
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700/50 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                Heatmap
              </button>
              <button
                onClick={resetImage}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700/50 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                Reset Image
              </button>
            </div>
          </div>

          <div 
            ref={containerRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            aria-label="Interactive Canvas Workbench. Use arrow keys to navigate the crosshair, press space or enter to select color."
            className="relative max-h-[60vh] w-full overflow-auto rounded-xl bg-slate-100 dark:bg-slate-900/50"
          >
            <canvas
              ref={canvasRef}
              className="mx-auto block cursor-crosshair max-w-full"
              onMouseEnter={() => setShowMagnifier(true)}
              onMouseLeave={() => setShowMagnifier(false)}
              onMouseMove={handleMouseMove}
              onClick={pickFromCanvas}
            />

            {/* Visible keyboard crosshair */}
            {kbCoords && (
              <div 
                className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2"
                style={{ left: kbCoords.x, top: kbCoords.y }}
              >
                <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-ping opacity-70" />
                <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-blue-500" />
                <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-blue-500" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Magnifier is mounted outside to keep DOM transforms smooth */}
      <canvas
        ref={magnifierRef}
        width={126}
        height={126}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-50 rounded-full border-4 border-slate-900/90 shadow-xl transition-opacity duration-150 dark:border-slate-100/90 ${
          showMagnifier && !kbCoords ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}