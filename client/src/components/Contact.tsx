import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { apiService } from '../utils/api';
import { ContactFormData, FormStatus } from '../types';

gsap.registerPlugin(ScrollTrigger);

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    gsap.fromTo(formRef.current, 
      { 
        opacity: 0, 
        y: 50,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setErrorMessage('Identity verification required');
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Communication channel required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Invalid communication channel format');
      return false;
    }
    if (!formData.message.trim()) {
      setErrorMessage('Message protocol cannot be empty');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus('error');
      return;
    }

    setSubmitStatus('loading');
    setErrorMessage('');

    try {
      await apiService.submitContact(formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Success animation
      gsap.to(formRef.current, {
        scale: 1.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
      
      // Auto-reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Transmission failed. Please retry.');
      
      // Error animation
      gsap.to(formRef.current, {
        x: -10,
        duration: 0.1,
        yoyo: true,
        repeat: 5,
        ease: "power2.inOut"
      });
    }
  };

  const getSubmitButtonText = () => {
    switch (submitStatus) {
      case 'loading':
        return (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-jarvis-blue mr-2"></div>
            Transmitting...
          </span>
        );
      case 'success':
        return '✓ Message Transmitted';
      case 'error':
        return '⚠️ Retry Transmission';
      default:
        return 'Transmit Message';
    }
  };

  const getSubmitButtonClass = () => {
    const baseClass = "w-full py-4 text-lg font-semibold transition-all duration-300";
    switch (submitStatus) {
      case 'loading':
        return `${baseClass} glow-button opacity-50 cursor-not-allowed`;
      case 'success':
        return `${baseClass} bg-jarvis-green/20 border border-jarvis-green text-jarvis-green`;
      case 'error':
        return `${baseClass} bg-red-500/20 border border-red-500 text-red-400 hover:bg-red-500/30`;
      default:
        return `${baseClass} glow-button`;
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-jarvis-blue to-jarvis-cyan neon-text">
            Initialize Contact
          </h2>
          <p className="text-xl text-jarvis-cyan font-audiowide">
            Establish communication protocol
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <form ref={formRef} onSubmit={handleSubmit} className="glass-panel p-8 rounded-lg border border-jarvis-blue/30">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-jarvis-cyan mb-2">
                    Identity Verification
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-jarvis-blue/30 rounded-lg text-white placeholder-gray-400 focus:border-jarvis-blue focus:outline-none focus:ring-2 focus:ring-jarvis-blue/20 transition-all duration-300"
                    placeholder="Enter your designation..."
                    disabled={submitStatus === 'loading'}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-jarvis-cyan mb-2">
                    Communication Channel
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-jarvis-blue/30 rounded-lg text-white placeholder-gray-400 focus:border-jarvis-blue focus:outline-none focus:ring-2 focus:ring-jarvis-blue/20 transition-all duration-300"
                    placeholder="Enter secure channel..."
                    disabled={submitStatus === 'loading'}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-jarvis-cyan mb-2">
                    Message Protocol
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border border-jarvis-blue/30 rounded-lg text-white placeholder-gray-400 focus:border-jarvis-blue focus:outline-none focus:ring-2 focus:ring-jarvis-blue/20 transition-all duration-300 resize-none"
                    placeholder="Transmit your message..."
                    disabled={submitStatus === 'loading'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitStatus === 'loading'}
                  className={getSubmitButtonClass()}
                >
                  {getSubmitButtonText()}
                </button>

                {submitStatus === 'success' && (
                  <div className="text-center text-jarvis-green font-semibold animate-pulse">
                    ✓ Message transmitted successfully. Awaiting response...
                  </div>
                )}

                {submitStatus === 'error' && errorMessage && (
                  <div className="text-center text-red-400 font-semibold">
                    ✗ {errorMessage}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="glass-panel p-6 rounded-lg border border-jarvis-green/30">
              <h3 className="text-xl font-bold text-jarvis-green mb-4 flex items-center">
                <span className="w-2 h-2 bg-jarvis-green rounded-full mr-3 animate-pulse"></span>
                System Status
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex justify-between">
                  <span>Network Status:</span>
                  <span className="text-jarvis-green">ONLINE</span>
                </div>
                <div className="flex justify-between">
                  <span>Response Time:</span>
                  <span className="text-jarvis-cyan">&lt; 24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Security Level:</span>
                  <span className="text-jarvis-blue">MAXIMUM</span>
                </div>
                <div className="flex justify-between">
                  <span>Encryption:</span>
                  <span className="text-jarvis-green">AES-256</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-lg border border-jarvis-cyan/30">
              <h3 className="text-xl font-bold text-jarvis-cyan mb-4 flex items-center">
                <span className="w-2 h-2 bg-jarvis-cyan rounded-full mr-3 animate-pulse"></span>
                Direct Channels
              </h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-jarvis-blue/20 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-jarvis-blue text-sm">📧</span>
                  </div>
                  <span>support@quantumpulse.ai</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-jarvis-green/20 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-jarvis-green text-sm">📞</span>
                  </div>
                  <span>+1 (555) QUANTUM-1</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-jarvis-cyan/20 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-jarvis-cyan text-sm">🌐</span>
                  </div>
                  <span>Global Network Access</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-lg border border-jarvis-blue/30">
              <h3 className="text-xl font-bold text-jarvis-blue mb-4 flex items-center">
                <span className="w-2 h-2 bg-jarvis-blue rounded-full mr-3 animate-pulse"></span>
                Emergency Protocols
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                For critical system failures or security breaches, activate emergency protocol QUANTUM-7. 
                Direct neural link available for authorized personnel only. All communications are monitored 
                and encrypted using quantum-resistant algorithms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

