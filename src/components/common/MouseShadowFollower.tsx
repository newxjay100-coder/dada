import React, { useEffect, useRef, useState } from 'react';

/**
 * MouseShadowFollower
 * 마우스 커서 끝을 부드럽게(Lerp 애니메이션) 따라다니는 자연스러운 입체 그림자 & 오라 효과
 */
export const MouseShadowFollower: React.FC = () => {
  const shadowRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);

  // Position coordinates with Lerp interpolation
  const mousePos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Check if device has mouse pointer
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check if hovering clickable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const clickable = target.closest('a, button, input, select, textarea, [role="button"], label');
        setIsHoveringClickable(Boolean(clickable));
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth Lerp render loop
    const lerpFactor = 0.15; // 자연스럽고 유연한 지연 추종 계수
    const render = () => {
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * lerpFactor;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * lerpFactor;

      if (shadowRef.current) {
        const x = currentPos.current.x;
        const y = currentPos.current.y;
        shadowRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isVisible]);

  return (
    <div
      ref={shadowRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-300 will-change-transform ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
      }}
      aria-hidden="true"
    >
      {/* 마우스 끝을 자연스럽게 감싸는 순수 입체 그림자 (Pure Soft Depth Shadow) */}
      <div
        className={`relative -top-4 -left-4 rounded-full transition-all duration-300 ${
          isHoveringClickable ? 'scale-125' : 'scale-100'
        }`}
      >
        {/* 1. 중심부 부드러운 입체 자연 음영 */}
        <div
          className="w-12 h-12 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(17,17,17,0.25) 0%, rgba(114,27,41,0.14) 40%, rgba(0,0,0,0.05) 70%, transparent 100%)',
            filter: 'blur(8px)',
            transform: 'translate(4px, 4px)',
          }}
        />

        {/* 2. 바깥쪽으로 은은하게 퍼지는 부드러운 앰비언트 섀도우 */}
        <div
          className="absolute inset-0 w-20 h-20 -top-4 -left-4 rounded-full"
          style={{
            background: isHoveringClickable
              ? 'radial-gradient(circle, rgba(114,27,41,0.22) 0%, rgba(17,17,17,0.10) 50%, transparent 75%)'
              : 'radial-gradient(circle, rgba(17,17,17,0.14) 0%, rgba(114,27,41,0.06) 50%, transparent 75%)',
            filter: 'blur(18px)',
          }}
        />
      </div>
    </div>
  );
};
