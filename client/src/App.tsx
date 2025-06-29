import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import MatrixBackground from './components/MatrixBackground';
import Header from './components/Header';
import Hero from './components/Hero';
import Products from './components/Products';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { apiService } from './utils/api';

import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize application
    const initializeApp = async () => {
      try {
        // Check API health
        await apiService.healthCheck();
        console.log('✅ API health check passed');

        // Initialize sample data
        await apiService.initializeData();
        console.log('✅ Sample data initialized');

        setInitError(null);
      } catch (error) {
        console.error('❌ Error initializing app:', error);
        setInitError(error instanceof Error ? error.message : 'Failed to initialize application');
      }
    };

    initializeApp();

    // Smooth scrolling for anchor links
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.hash) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          gsap.to(window, {
            duration: 1,
            scrollTo: element,
            ease: "power2.inOut"
          });
        }
      }
    };

    // Add event listeners for smooth scrolling
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', handleSmoothScroll);
    });

    // Cleanup
    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <ErrorBoundary>
        <LoadingScreen onComplete={handleLoadingComplete} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="App">
        <MatrixBackground />
        {initError && (
          <div className="fixed top-4 right-4 z-50 bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-2 rounded-lg backdrop-blur-md">
            <div className="text-sm">⚠️ {initError}</div>
          </div>
        )}
        <Header />
        <main>
          <Hero />
          <Products />
          <FAQ />
          <Contact />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;

