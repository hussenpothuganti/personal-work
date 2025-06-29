import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('INITIALIZING JARVIS PROTOCOL...');
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  const loadingTexts = [
    'INITIALIZING JARVIS PROTOCOL...',
    'ESTABLISHING NEURAL NETWORKS...',
    'CALIBRATING QUANTUM PROCESSORS...',
    'SYNCHRONIZING HOLOGRAPHIC DISPLAYS...',
    'ACTIVATING SECURITY PROTOCOLS...',
    'SYSTEM READY FOR DEPLOYMENT'
  ];

  useEffect(() => {
    const tl = gsap.timeline();

    // Initial animations
    tl.from(containerRef.current, {
      opacity: 0,
      duration: 0.5
    })
    .from(circleRef.current, {
      scale: 0,
      rotation: -180,
      duration: 1,
      ease: "back.out(1.7)"
    }, "-=0.3");

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;
        const clampedProgress = Math.min(newProgress, 100);
        
        // Update text based on progress
        const textIndex = Math.floor((clampedProgress / 100) * (loadingTexts.length - 1));
        setCurrentText(loadingTexts[textIndex]);
        
        // Animate progress bar
        gsap.to(progressBarRef.current, {
          width: `${clampedProgress}%`,
          duration: 0.3,
          ease: "power2.out"
        });

        // Rotate circle
        gsap.to(circleRef.current, {
          rotation: `+=${Math.random() * 45 + 15}`,
          duration: 0.5,
          ease: "power2.out"
        });

        if (clampedProgress >= 100) {
          clearInterval(progressInterval);
          
          // Completion animation
          setTimeout(() => {
            gsap.to(containerRef.current, {
              opacity: 0,
              scale: 1.1,
              duration: 0.8,
              ease: "power2.inOut",
              onComplete: onComplete
            });
          }, 1000);
        }
        
        return clampedProgress;
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-jarvis-dark z-50 flex items-center justify-center"
    >
      <div className="text-center">
        {/* Main Circle */}
        <div className="relative mb-8">
          <div 
            ref={circleRef}
            className="w-32 h-32 mx-auto border-4 border-jarvis-blue rounded-full relative"
            style={{
              background: 'conic-gradient(from 0deg, #00d4ff, #00ffff, #00ff88, #00d4ff)',
              animation: 'spin 3s linear infinite'
            }}
          >
            <div className="absolute inset-2 bg-jarvis-dark rounded-full flex items-center justify-center">
              <div className="text-jarvis-blue text-2xl font-bold">J</div>
            </div>
          </div>
          
          {/* Orbiting elements */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-jarvis-cyan rounded-full transform -translate-x-1/2 -translate-y-1"></div>
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
            <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-jarvis-green rounded-full transform -translate-x-1/2 translate-y-1"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-jarvis-blue mb-2 font-orbitron">
            J.A.R.V.I.S
          </h2>
          <p className="text-jarvis-cyan font-audiowide text-sm tracking-wider">
            {currentText}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 mx-auto">
          <div className="flex justify-between text-xs text-jarvis-cyan mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-jarvis-gray rounded-full h-2 border border-jarvis-blue/30">
            <div 
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-jarvis-blue to-jarvis-cyan rounded-full transition-all duration-300"
              style={{ 
                boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
                width: '0%'
              }}
            />
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 text-xs text-gray-400 space-y-1">
          <div className="flex justify-center space-x-4">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-jarvis-green rounded-full mr-2 animate-pulse"></div>
              Neural Networks: ONLINE
            </span>
          </div>
          <div className="flex justify-center space-x-4">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-jarvis-blue rounded-full mr-2 animate-pulse"></div>
              Quantum Core: ACTIVE
            </span>
          </div>
          <div className="flex justify-center space-x-4">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-jarvis-cyan rounded-full mr-2 animate-pulse"></div>
              Security: MAXIMUM
            </span>
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-jarvis-blue rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-jarvis-cyan rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-jarvis-green rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

export default LoadingScreen;

