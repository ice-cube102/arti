import React, { useEffect, useRef } from 'react';

// Declaration for window.katex
declare global {
  interface Window {
    katex: any;
  }
}

interface MathTextProps {
  text: string;
}

export const MathText: React.FC<MathTextProps> = React.memo(({ text }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current && window.katex) {
      const parts = text.split('$');
      containerRef.current.innerHTML = '';
      
      parts.forEach((part, index) => {
        if (index % 2 === 1) {
          // Math part
          const span = document.createElement('span');
          try {
            window.katex.render(part, span, {
              throwOnError: false,
              displayMode: false
            });
          } catch (e) {
            span.innerText = part;
          }
          containerRef.current?.appendChild(span);
        } else {
          // Text part
          const span = document.createElement('span');
          span.innerText = part;
          containerRef.current?.appendChild(span);
        }
      });
    } else if (containerRef.current) {
        // Fallback if katex not loaded yet
        containerRef.current.innerText = text;
    }
  }, [text]);

  return <span ref={containerRef} className="math-text-container leading-relaxed inline-block" />;
});