import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedText from './AnimatedText';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const firstParagraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Luxury page load reveal animation
    const tl = gsap.timeline({ delay: 0.3 });

    // Initial state - everything hidden with luxury reveal setup
    gsap.set([titleRef.current, subtitleRef.current, buttonsRef.current, firstParagraphRef.current], {
      opacity: 0,
      y: 100,
      scale: 0.8,
      rotationX: 45
    });

    // Luxury reveal animation sequence
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: 1.8,
      ease: "power4.out",
      onComplete: () => {
        // Continuous glow effect after reveal
        gsap.to(titleRef.current, {
          textShadow: "0 0 30px #00d4ff, 0 0 60px #00d4ff, 0 0 90px #00d4ff",
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut"
        });
      }
    })
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: 1.4,
      ease: "power4.out"
    }, "-=1.2")
    .to(firstParagraphRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: 1.2,
      ease: "power4.out"
    }, "-=0.8")
    .to(buttonsRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: 1,
      ease: "power4.out"
    }, "-=0.6");

    // Word-by-word darkening scroll effect on first paragraph
    const paragraph = firstParagraphRef.current;
    if (paragraph) {
      const text = paragraph.textContent || '';
      const words = text.split(' ');
      paragraph.innerHTML = words.map(word => `<span class="word-span">${word}</span>`).join(' ');
      
      const wordSpans = paragraph.querySelectorAll('.word-span');
      
      // Initially set all words to light color
      gsap.set(wordSpans, { color: '#64748b', opacity: 0.6 });
      
      // Create scroll trigger for word-by-word darkening
      ScrollTrigger.create({
        trigger: paragraph,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const wordsToReveal = Math.floor(progress * wordSpans.length);
          
          wordSpans.forEach((span, index) => {
            if (index <= wordsToReveal) {
              gsap.to(span, {
                color: '#00d4ff',
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
              });
            }
          });
        }
      });
    }

    // Enhanced floating particles animation
    const particles = particlesRef.current?.children;
    if (particles) {
      Array.from(particles).forEach((particle, index) => {
        gsap.to(particle, {
          y: "random(-30, 30)",
          x: "random(-30, 30)",
          rotation: "random(-180, 180)",
          duration: "random(3, 6)",
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: index * 0.3
        });
      });
    }

    // Enhanced button hover animations for mobile/tablet responsiveness
    const buttons = buttonsRef.current?.querySelectorAll('button');
    if (buttons) {
      buttons.forEach((button) => {
        // Mouse/touch events
        const handleInteractionStart = () => {
          gsap.to(button, {
            scale: 1.08,
            boxShadow: "0 0 40px rgba(0, 212, 255, 0.8)",
            duration: 0.4,
            ease: "power3.out"
          });
        };

        const handleInteractionEnd = () => {
          gsap.to(button, {
            scale: 1,
            boxShadow: "0 0 20px rgba(0, 212, 255, 0.4)",
            duration: 0.4,
            ease: "power3.out"
          });
        };

        // Desktop events
        button.addEventListener('mouseenter', handleInteractionStart);
        button.addEventListener('mouseleave', handleInteractionEnd);
        
        // Mobile/tablet events
        button.addEventListener('touchstart', handleInteractionStart);
        button.addEventListener('touchend', handleInteractionEnd);
        button.addEventListener('touchcancel', handleInteractionEnd);
      });
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };

  }, []);

  return (
    <section id="home" ref={heroRef} className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="hero-gradient absolute inset-0"></div>
      <div className="circuit-bg absolute inset-0 opacity-20"></div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 
          ref={titleRef}
          className="text-6xl md:text-8xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-jarvis-blue via-jarvis-cyan to-jarvis-green font-orbitron"
        >
          J.A.R.V.I.S
        </h1>
        
        <div ref={subtitleRef} className="mb-8">
          <AnimatedText
            text="Advanced AI Technology for the Future"
            className="text-xl md:text-2xl text-jarvis-cyan font-audiowide"
            delay={2}
            speed={0.08}
          />
        </div>

        {/* First paragraph with word-by-word darkening effect */}
        <p 
          ref={firstParagraphRef}
          className="text-lg md:text-xl mb-8 max-w-4xl mx-auto leading-relaxed font-light"
        >
          Experience the next generation of artificial intelligence with our quantum-powered neural networks, 
          designed to revolutionize how humans interact with technology in the digital age.
        </p>
        
        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="glow-button text-lg px-8 py-4 group relative overflow-hidden touch-manipulation">
            <span className="relative z-10">Activate Protocol</span>
            <div className="absolute inset-0 bg-gradient-to-r from-jarvis-blue/20 to-jarvis-cyan/20 transform scale-x-0 group-hover:scale-x-100 group-active:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
          <button className="border border-jarvis-green/50 text-jarvis-green px-8 py-4 rounded-lg hover:bg-jarvis-green/10 active:bg-jarvis-green/20 transition-all duration-300 relative group touch-manipulation">
            <span className="relative z-10">System Diagnostics</span>
            <div className="absolute inset-0 bg-jarvis-green/5 transform scale-0 group-hover:scale-100 group-active:scale-100 transition-transform duration-300 rounded-lg"></div>
          </button>
        </div>

        {/* Enhanced floating particles */}
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-3 h-3 bg-jarvis-blue rounded-full opacity-70 blur-sm"></div>
          <div className="absolute top-40 right-20 w-4 h-4 bg-jarvis-cyan rounded-full opacity-60 blur-sm"></div>
          <div className="absolute bottom-20 left-20 w-3 h-3 bg-jarvis-green rounded-full opacity-80 blur-sm"></div>
          <div className="absolute bottom-40 right-10 w-4 h-4 bg-jarvis-blue rounded-full opacity-50 blur-sm"></div>
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-jarvis-cyan rounded-full opacity-90 blur-sm"></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-jarvis-green rounded-full opacity-70 blur-sm"></div>
          <div className="absolute top-60 left-1/3 w-2 h-2 bg-jarvis-blue rounded-full opacity-60 blur-sm"></div>
          <div className="absolute bottom-60 right-1/4 w-3 h-3 bg-jarvis-cyan rounded-full opacity-80 blur-sm"></div>
        </div>
      </div>

      {/* Enhanced scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-jarvis-cyan rounded-full flex justify-center">
          <div className="w-1 h-3 bg-jarvis-cyan rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Enhanced side decorative elements */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 space-y-4">
        <div className="w-1 h-16 bg-gradient-to-b from-jarvis-blue to-transparent opacity-80"></div>
        <div className="w-1 h-8 bg-gradient-to-b from-jarvis-cyan to-transparent opacity-60"></div>
        <div className="w-1 h-12 bg-gradient-to-b from-jarvis-green to-transparent opacity-70"></div>
      </div>
      
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 space-y-4">
        <div className="w-1 h-12 bg-gradient-to-b from-jarvis-green to-transparent opacity-70"></div>
        <div className="w-1 h-8 bg-gradient-to-b from-jarvis-cyan to-transparent opacity-60"></div>
        <div className="w-1 h-16 bg-gradient-to-b from-jarvis-blue to-transparent opacity-80"></div>
      </div>
    </section>
  );
};

export default Hero;

