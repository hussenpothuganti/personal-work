import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  onComplete?: () => void;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  text, 
  className = '', 
  delay = 0, 
  speed = 0.05,
  onComplete 
}) => {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const chars = text.split('');
    element.innerHTML = '';

    // Create spans for each character
    chars.forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.opacity = '0';
      element.appendChild(span);
    });

    // Animate each character
    const spans = element.querySelectorAll('span');
    gsap.fromTo(spans, 
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.05,
        stagger: speed,
        delay: delay,
        ease: "none",
        onComplete: onComplete
      }
    );

  }, [text, delay, speed, onComplete]);

  return <span ref={textRef} className={className}></span>;
};

export default AnimatedText;

