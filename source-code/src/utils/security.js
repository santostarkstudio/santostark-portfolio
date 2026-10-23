/**
 * Global Anti-Scraping Security Utility
 * Disables contextmenu (right-click) and dragstart (image dragging) across the app.
 */
export const initSecurityListeners = () => {
  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  const handleDragStart = (e) => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'SVG' || e.target.tagName === 'CANVAS') {
      e.preventDefault();
      return false;
    }
  };

  window.addEventListener('contextmenu', handleContextMenu);
  window.addEventListener('dragstart', handleDragStart);

  // Return cleanup function
  return () => {
    window.removeEventListener('contextmenu', handleContextMenu);
    window.removeEventListener('dragstart', handleDragStart);
  };
};
