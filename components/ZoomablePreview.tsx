import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';

interface ZoomablePreviewProps {
  children: React.ReactNode;
}

export const ZoomablePreview: React.FC<ZoomablePreviewProps> = ({ children }) => {
  const [scale, setScale] = useState(0.5);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const MIN_SCALE = 0.2;
  const MAX_SCALE = 2;
  const SCALE_STEP = 0.1;

  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + SCALE_STEP, MAX_SCALE));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - SCALE_STEP, MIN_SCALE));
  }, []);

  const handleReset = useCallback(() => {
    setScale(0.5);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP;
      setScale(prev => Math.min(Math.max(prev + delta, MIN_SCALE), MAX_SCALE));
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left click
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleZoomIn, handleZoomOut, handleReset]);

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Control Bar */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white rounded-lg shadow-lg p-2">
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        
        <span className="px-2 min-w-[60px] text-center text-sm font-medium">
          {Math.round(scale * 100)}%
        </span>
        
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <button
          onClick={handleReset}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Reset View (0)"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Hint */}
      <div className="absolute bottom-4 left-4 z-10 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
        <Move className="w-3 h-3 inline mr-1" />
        拖拽移动 | Ctrl+滚轮缩放 | +/- 缩放
      </div>

      {/* Zoomable Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
