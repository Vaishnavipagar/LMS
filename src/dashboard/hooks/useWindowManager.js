import { useEffect, useRef, useState } from "react";
import { STORAGE_KEY, TOPBAR_HEIGHT, DOCK_HEIGHT, ALL_APPS } from "../constants";

export function useWindowManager() {
  const [windows, setWindows] = useState([]);
  const [loadingWindows, setLoadingWindows] = useState({});
  const zCounter = useRef(100);

  const visible = windows.filter((w) => !w.minimized);
  const minimized = windows.filter((w) => w.minimized);

  const activeWindow = visible.length > 0 
    ? [...visible].sort((a, b) => b.z - a.z)[0] 
    : null;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Load workspace
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWindows(parsed);
          const maxZ = parsed.reduce((m, w) => Math.max(m, w.z || 0), 0);
          zCounter.current = Math.max(100, maxZ + 1);
        }
      } catch (e) {
        console.error("Failed to load workspace:", e);
      }
    }
  }, []);

  // Save workspace
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(windows));
  }, [windows]);

  const clampToScreen = (rect) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight - TOPBAR_HEIGHT - DOCK_HEIGHT;

    const w = Math.max(300, Math.min(rect.w, vw));
    const h = Math.max(200, Math.min(rect.h, vh));

    const x = Math.max(0, Math.min(rect.x, vw - w));
    const y = Math.max(0, Math.min(rect.y, vh - h));

    return { x, y, w, h };
  };

  const openWindow = (type) => {
    const id = `${type}_${Date.now()}`;
    zCounter.current += 1;

    // Get title from ALL_APPS config
    const appConfig = ALL_APPS[type];
    const title = appConfig?.title || type;

    setLoadingWindows((p) => ({ ...p, [id]: true }));

    setWindows((prev) => {
      // Calculate position with offset for cascading effect
      const offset = (prev.length % 5) * 30;
      
      const baseRect = isMobile
        ? {
            x: 0,
            y: 0,
            w: window.innerWidth,
            h: window.innerHeight - TOPBAR_HEIGHT - DOCK_HEIGHT,
          }
        : {
            x: 100 + offset,
            y: 50 + offset,
            w: 600,
            h: 450,
          };

      return [
        ...prev,
        {
          id,
          type,
          title,
          rect: clampToScreen(baseRect),
          z: zCounter.current,
          minimized: false,
          fullscreen: isMobile,
        },
      ];
    });

    setTimeout(() => {
      setLoadingWindows((p) => ({ ...p, [id]: false }));
    }, 300);
  };

  const closeWindow = (id) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setLoadingWindows((p) => {
      const n = { ...p };
      delete n[id];
      return n;
    });
  };

  const focusWindow = (id) => {
    zCounter.current += 1;
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, z: zCounter.current } : w))
    );
  };

  const minimizeWindow = (id) =>
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w))
    );

  const restoreWindow = (id) => {
    zCounter.current += 1;
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: false, z: zCounter.current } : w))
    );
  };

  const toggleFullscreen = (id) =>
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, fullscreen: !w.fullscreen } : w
      )
    );

  // Drag handler
  const onDrag = (id, position) => {
    if (isMobile) return;

    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        const newRect = clampToScreen({ ...w.rect, x: position.x, y: position.y });
        return { ...w, rect: newRect };
      })
    );
  };

  const onDragEnd = (id, position) => {
    if (isMobile) return;

    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        const newRect = clampToScreen({ ...w.rect, x: position.x, y: position.y });
        return { ...w, rect: newRect };
      })
    );
  };

  // Resize handler - keeps position fixed, only changes size
  const onResize = (id, newSize) => {
    if (isMobile) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight - TOPBAR_HEIGHT - DOCK_HEIGHT;

    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        
        const newW = Math.max(300, Math.min(newSize.w, vw - w.rect.x));
        const newH = Math.max(200, Math.min(newSize.h, vh - w.rect.y));
        
        return { 
          ...w, 
          rect: { 
            ...w.rect, 
            w: newW, 
            h: newH 
          } 
        };
      })
    );
  };

  return {
    windows,
    visible,
    minimized,
    activeWindow,
    loadingWindows,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    restoreWindow,
    toggleFullscreen,
    onDrag,
    onDragEnd,
    onResize,
    setWindows,
  };
}