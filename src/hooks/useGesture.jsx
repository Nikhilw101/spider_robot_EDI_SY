import { useRef, useEffect } from 'react';

export const useGesture = (handlers) => {
  const ref = useRef(null);
  const touchStartRef = useRef(null);
  const longPressTimerRef = useRef(null);
  
  const SWIPE_THRESHOLD = 50;
  const LONG_PRESS_DURATION = 500;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
      
      if (handlers.onLongPress) {
        longPressTimerRef.current = setTimeout(() => {
          handlers.onLongPress();
          touchStartRef.current = null;
        }, LONG_PRESS_DURATION);
      }
    };

    const handleTouchMove = (e) => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    };

    const handleTouchEnd = (e) => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
      
      if (!touchStartRef.current) return;
      const touchEnd = e.changedTouches[0];
      const deltaX = touchEnd.clientX - touchStartRef.current.x;
      const deltaY = touchEnd.clientY - touchStartRef.current.y;
      
      const timeDiff = Date.now() - touchStartRef.current.time;
      if (timeDiff < 300) {
        if (Math.abs(deltaX) > SWIPE_THRESHOLD || Math.abs(deltaY) > SWIPE_THRESHOLD) {
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            deltaX > 0 ? handlers.onSwipeRight?.() : handlers.onSwipeLeft?.();
          } else {
            deltaY > 0 ? handlers.onSwipeDown?.() : handlers.onSwipeUp?.();
          }
        }
      }
      touchStartRef.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    };
  }, [handlers]);

  return { ref };
};