import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { surface, TOPBAR_HEIGHT, TOPBAR_HEIGHT_MOBILE, DOCK_HEIGHT, DOCK_HEIGHT_MOBILE, ALL_APPS } from "../constants";

export default function Window({
  id,
  type,
  title,
  children,
  rect,
  z,
  isFullscreen,
  isMobile,
  onFocus,
  onClose,
  onMinimize,
  onToggleFullscreen,
  onDrag,
  onDragEnd,
  onResize,
  isLoading,
}) {
  const canResize = !isMobile && !isFullscreen;
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartSize = useRef({ w: 0, h: 0 });
  const resizeStartPos = useRef({ x: 0, y: 0 });
  const windowRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartMousePos = useRef({ x: 0, y: 0 });
  const dragStartWindowPos = useRef({ x: 0, y: 0 });

  // Get proper title from ALL_APPS
  const appConfig = ALL_APPS[type];
  const displayTitle = appConfig?.title || title || type;
  
  // Use mobile-specific constants
  const topbarHeight = isMobile ? TOPBAR_HEIGHT_MOBILE : TOPBAR_HEIGHT;
  const dockHeight = isMobile ? DOCK_HEIGHT_MOBILE : DOCK_HEIGHT;

  // Manual drag handling for better control
  const handleMouseDown = (e) => {
    if (isMobile || isFullscreen) return;
    if (e.target.closest('button')) return; // Don't drag when clicking buttons
    
    e.preventDefault();
    isDraggingRef.current = true;
    dragStartMousePos.current = { x: e.clientX, y: e.clientY };
    dragStartWindowPos.current = { x: rect.x, y: rect.y };
    onFocus(id);

    const handleMouseMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      
      const deltaX = moveEvent.clientX - dragStartMousePos.current.x;
      const deltaY = moveEvent.clientY - dragStartMousePos.current.y;
      
      const newX = dragStartWindowPos.current.x + deltaX;
      const newY = dragStartWindowPos.current.y + deltaY;
      
      onDrag(id, { x: newX, y: newY });
    };

    const handleMouseUp = (upEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      
      const deltaX = upEvent.clientX - dragStartMousePos.current.x;
      const deltaY = upEvent.clientY - dragStartMousePos.current.y;
      
      const newX = dragStartWindowPos.current.x + deltaX;
      const newY = dragStartWindowPos.current.y + deltaY;
      
      onDragEnd(id, { x: newX, y: newY });
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Resize handlers
  const handleResizeStart = useCallback((e, direction) => {
    if (!canResize) return;
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    resizeStartSize.current = { w: rect.w, h: rect.h };
    resizeStartPos.current = { x: e.clientX, y: e.clientY };
    onFocus(id);

    const handleResizeMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - resizeStartPos.current.x;
      const deltaY = moveEvent.clientY - resizeStartPos.current.y;

      let newW = resizeStartSize.current.w;
      let newH = resizeStartSize.current.h;

      if (direction.includes('e')) newW = resizeStartSize.current.w + deltaX;
      if (direction.includes('w')) newW = resizeStartSize.current.w - deltaX;
      if (direction.includes('s')) newH = resizeStartSize.current.h + deltaY;
      if (direction.includes('n')) newH = resizeStartSize.current.h - deltaY;

      onResize(id, { w: newW, h: newH });
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  }, [canResize, rect.w, rect.h, id, onFocus, onResize]);

  // Window header height
  const headerHeight = isMobile ? 48 : 44;

  return (
    <motion.div
      ref={windowRef}
      className={`absolute select-none overflow-hidden ${
        isMobile 
          ? "bg-white rounded-none border-0" 
          : surface
      }`}
      style={{
        top: isMobile ? topbarHeight : (isFullscreen ? TOPBAR_HEIGHT : rect.y + TOPBAR_HEIGHT),
        left: isMobile ? 0 : (isFullscreen ? 0 : rect.x),
        width: isMobile ? "100%" : (isFullscreen ? "100%" : rect.w),
        height: isMobile 
          ? `calc(100vh - ${topbarHeight}px - ${dockHeight}px)` 
          : (isFullscreen ? `calc(100vh - ${TOPBAR_HEIGHT}px - ${DOCK_HEIGHT}px)` : rect.h),
        zIndex: z,
      }}
      onMouseDown={() => onFocus(id)}
      onTouchStart={() => onFocus(id)}
      initial={{ scale: isMobile ? 1 : 0.9, opacity: 0, y: isMobile ? 20 : 0 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: isMobile ? 1 : 0.9, opacity: 0, y: isMobile ? 20 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* HEADER - Draggable area */}
      <div 
        className={`flex items-center gap-2 px-3 border-b border-slate-200/50 bg-slate-50/90 backdrop-blur-xl select-none ${
          isMobile ? "h-12 rounded-none" : "h-11 rounded-t-2xl"
        } ${!isMobile && !isFullscreen ? 'cursor-grab active:cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => onClose(id)} 
            className={`rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center ${
              isMobile ? "w-6 h-6" : "w-3 h-3 group"
            }`}
          >
            <span className={`text-white font-bold ${isMobile ? "text-sm" : "text-[8px] opacity-0 group-hover:opacity-100"}`}>×</span>
          </button>
        </div>
        <div className={`flex-1 text-center font-medium text-slate-700 truncate pointer-events-none ${
          isMobile ? "text-base" : "text-sm"
        }`}>
          {displayTitle}
        </div>
        <div className={isMobile ? "w-8" : "w-14"} /> {/* Spacer for balance */}
      </div>

      {/* CONTENT */}
      <div className="overflow-auto bg-white" style={{ height: `calc(100% - ${headerHeight}px)` }}>
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <motion.div
              className="w-10 h-10 rounded-full border-3 border-slate-200 border-t-blue-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : (
          <div className={`h-full ${isMobile ? "p-3" : "p-4"}`}>
            {children}
          </div>
        )}
      </div>

      {/* RESIZE HANDLES - Only show when not fullscreen and not mobile */}
      {canResize && (
        <>
          {/* Edge handles */}
          <div
            className="absolute top-0 left-3 right-3 h-1 cursor-n-resize"
            onMouseDown={(e) => handleResizeStart(e, 'n')}
          />
          <div
            className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize"
            onMouseDown={(e) => handleResizeStart(e, 's')}
          />
          <div
            className="absolute left-0 top-3 bottom-3 w-1 cursor-w-resize"
            onMouseDown={(e) => handleResizeStart(e, 'w')}
          />
          <div
            className="absolute right-0 top-3 bottom-3 w-1 cursor-e-resize"
            onMouseDown={(e) => handleResizeStart(e, 'e')}
          />

          {/* Corner handles - larger hit areas */}
          <div
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize"
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
          />
          <div
            className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize"
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
          />
          <div
            className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize"
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
          />
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={(e) => handleResizeStart(e, 'se')}
          />
        </>
      )}
    </motion.div>
  );
}