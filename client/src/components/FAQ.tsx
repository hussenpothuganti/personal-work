import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from 'axios';

gsap.registerPlugin(ScrollTrigger);

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);

  // Additional FAQ items with dummy data
  const additionalFAQs = [
    {
      _id: 'faq-neural-interface',
      question: 'How does the Neural Interface X1 ensure data security?',
      answer: 'The Neural Interface X1 employs quantum encryption protocols with 2048-bit neural pathway encryption. All data transmissions are secured through bio-metric authentication and real-time threat detection algorithms. The system operates on a zero-trust architecture, ensuring complete privacy of neural data.',
      category: 'security'
    },
    {
      _id: 'faq-quantum-compatibility',
      question: 'Are quantum processors compatible with existing systems?',
      answer: 'Our Quantum Core Pro features adaptive compatibility layers that seamlessly integrate with legacy systems. The quantum-classical bridge technology allows for gradual migration while maintaining full operational capacity. Installation requires minimal downtime and includes comprehensive system optimization.',
      category: 'technology'
    },
    {
      _id: 'faq-holographic-power',
      question: 'What are the power requirements for holographic displays?',
      answer: 'HoloDisplay Elite operates on advanced photonic energy systems requiring only 45W of power consumption. The device includes an integrated quantum battery with 72-hour autonomous operation capability. Solar charging compatibility and wireless power transfer are standard features.',
      category: 'technology'
    },
    {
      _id: 'faq-ai-learning',
      question: 'How does the AI Core Matrix learn and adapt?',
      answer: 'The AI Core Matrix utilizes advanced machine learning algorithms with continuous neural network evolution. It processes data through quantum-enhanced pattern recognition and adapts to user preferences in real-time. The system includes ethical AI protocols and transparent decision-making processes.',
      category: 'general'
    }
  ];

  useEffect(() => {
    fetchFAQs();
  }, []);

  useEffect(() => {
    // Enhanced entrance animation for FAQ items
    if (sectionRef.current) {
      const faqItems = sectionRef.current.querySelectorAll('.faq-item');
      
      gsap.fromTo(faqItems, 
        { 
          opacity: 0, 
          x: -100,
          scale: 0.9,
          rotationY: -15
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom 25%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, [faqs, additionalFAQs]);

  const fetchFAQs = async () => {
    try {
      const response = await axios.get('/api/faqs');
      setFaqs(response.data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    const isOpening = !newOpenItems.has(id);
    
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);

    // Enhanced GSAP animation for expand/collapse with luxury feel
    const content = document.getElementById(`faq-content-${id}`);
    const icon = document.getElementById(`faq-icon-${id}`);
    const button = document.querySelector(`[data-faq-id="${id}"]`);
    const questionElement = button?.querySelector('.faq-question');
    
    if (content && icon) {
      if (isOpening) {
        // Luxury expanding animation
        gsap.set(content, { height: 'auto' });
        gsap.from(content, {
          height: 0,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out"
        });
        
        gsap.fromTo(content.querySelector('.faq-answer'), {
          y: -20,
          opacity: 0,
          scale: 0.95
        }, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay: 0.2,
          ease: "power3.out"
        });
        
        // Icon animation with luxury rotation
        gsap.to(icon, {
          rotation: 135,
          scale: 1.2,
          backgroundColor: 'rgba(0, 255, 136, 0.2)',
          borderColor: '#00ff88',
          duration: 0.5,
          ease: "back.out(1.7)"
        });
        
        // Button background animation
        if (button) {
          gsap.to(button, {
            backgroundColor: 'rgba(0, 255, 136, 0.08)',
            duration: 0.4,
            ease: "power2.out"
          });
        }
        
        // Question text color change
        if (questionElement) {
          gsap.to(questionElement, {
            color: '#00ff88',
            duration: 0.3,
            ease: "power2.out"
          });
        }
        
      } else {
        // Luxury collapsing animation
        gsap.to(content.querySelector('.faq-answer'), {
          y: -15,
          opacity: 0,
          scale: 0.95,
          duration: 0.3,
          ease: "power2.in"
        });
        
        gsap.to(content, {
          height: 0,
          opacity: 0,
          duration: 0.5,
          delay: 0.1,
          ease: "power2.in"
        });
        
        // Icon reverse animation
        gsap.to(icon, {
          rotation: 0,
          scale: 1,
          backgroundColor: 'transparent',
          borderColor: '#00d4ff',
          duration: 0.4,
          ease: "power2.out"
        });
        
        // Button background reset
        if (button) {
          gsap.to(button, {
            backgroundColor: 'transparent',
            duration: 0.3,
            ease: "power2.out"
          });
        }
        
        // Question text color reset
        if (questionElement) {
          gsap.to(questionElement, {
            color: '#00d4ff',
            duration: 0.3,
            ease: "power2.out"
          });
        }
      }
    }
  };

  if (loading) {
    return (
      <section className="py-20 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-jarvis-blue"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-32 w-32 border border-jarvis-cyan opacity-20"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="faq" ref={sectionRef} className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-jarvis-blue to-jarvis-cyan neon-text">
            System Protocols
          </h2>
          <p className="text-xl text-jarvis-cyan font-audiowide">
            Frequently accessed information modules
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {[...faqs, ...additionalFAQs].map((faq) => (
            <div
              key={faq._id}
              className="faq-item glass-panel border border-jarvis-blue/30 rounded-lg overflow-hidden hover:border-jarvis-cyan/50 transition-all duration-500 hover:shadow-lg hover:shadow-jarvis-blue/20"
            >
              <button
                data-faq-id={faq._id}
                onClick={() => toggleItem(faq._id)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-white/5 transition-all duration-300 group touch-manipulation"
              >
                <div className="flex-1">
                  <h3 className="faq-question text-lg font-semibold text-jarvis-cyan mb-2 group-hover:text-jarvis-green transition-colors duration-300">
                    {faq.question}
                  </h3>
                  <span className="text-sm text-jarvis-blue/70 capitalize px-3 py-1 bg-jarvis-blue/10 rounded-full border border-jarvis-blue/30 group-hover:border-jarvis-green/30 group-hover:bg-jarvis-green/10 transition-all duration-300">
                    {faq.category}
                  </span>
                </div>
                <div
                  id={`faq-icon-${faq._id}`}
                  className="w-10 h-10 border-2 border-jarvis-blue rounded-full flex items-center justify-center text-jarvis-blue transition-all duration-300 group-hover:border-jarvis-green group-hover:text-jarvis-green ml-4 flex-shrink-0"
                >
                  <span className="text-xl font-bold">+</span>
                </div>
              </button>
              
              <div
                id={`faq-content-${faq._id}`}
                className="px-6 overflow-hidden"
                style={{ 
                  height: openItems.has(faq._id) ? 'auto' : '0',
                  opacity: openItems.has(faq._id) ? '1' : '0'
                }}
              >
                <div className="faq-answer pb-6 border-t border-jarvis-blue/20 pt-4">
                  <p className="text-gray-300 leading-relaxed text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Add new FAQ form */}
        <div className="max-w-2xl mx-auto mt-16">
          <div className="glass-panel p-8 rounded-lg border border-jarvis-green/30 hover:border-jarvis-green/50 transition-all duration-300">
            <h3 className="text-2xl font-bold text-jarvis-green mb-6 flex items-center">
              <span className="w-3 h-3 bg-jarvis-green rounded-full mr-3 animate-pulse"></span>
              Submit New Query
            </h3>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-jarvis-cyan mb-2">
                  Question
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/5 border border-jarvis-blue/30 rounded-lg text-white placeholder-gray-400 focus:border-jarvis-blue focus:outline-none focus:ring-2 focus:ring-jarvis-blue/20 transition-all duration-300"
                  placeholder="Enter your question..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-jarvis-cyan mb-2">
                  Category
                </label>
                <select className="w-full px-4 py-3 bg-white/5 border border-jarvis-blue/30 rounded-lg text-white focus:border-jarvis-blue focus:outline-none focus:ring-2 focus:ring-jarvis-blue/20 transition-all duration-300">
                  <option value="technology">Technology</option>
                  <option value="security">Security</option>
                  <option value="warranty">Warranty</option>
                  <option value="integration">Integration</option>
                  <option value="general">General</option>
                </select>
              </div>
              <button
                type="submit"
                className="glow-button w-full py-4 text-lg font-semibold"
              >
                Submit Query
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

