import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { apiService } from '../utils/api';
import { Product, BestSellingProduct } from '../types';

gsap.registerPlugin(ScrollTrigger);

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const bestSellingRef = useRef<HTMLDivElement[]>([]);

  // Best Selling Products with proper image paths
  const bestSellingProducts: BestSellingProduct[] = [
    {
      id: 'neural-interface',
      name: 'Neural Interface X1',
      price: 299999,
      image: '/neural-interface.png',
      category: 'Neural Tech',
      description: 'Advanced neural interface for direct brain-computer interaction with quantum processing capabilities.'
    },
    {
      id: 'quantum-processor',
      name: 'Quantum Core Pro',
      price: 149999,
      image: '/quantum-processor.png',
      category: 'Quantum Computing',
      description: 'Revolutionary quantum processor with crystalline architecture for unprecedented computational power.'
    },
    {
      id: 'holographic-display',
      name: 'HoloDisplay Elite',
      price: 89999,
      image: '/holographic-display.png',
      category: 'Display Tech',
      description: 'Transparent holographic display with touch-sensitive interface and real-time data visualization.'
    },
    {
      id: 'ai-core',
      name: 'AI Core Matrix',
      price: 199999,
      image: '/ai-core.png',
      category: 'AI Systems',
      description: 'Advanced AI core module with geometric pattern recognition and autonomous decision-making.'
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      // GSAP animation for regular product cards
      gsap.fromTo(cardsRef.current, 
        { 
          opacity: 0, 
          y: 100,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // GSAP animation for best selling product cards
    gsap.fromTo(bestSellingRef.current, 
      { 
        opacity: 0, 
        x: -50,
        scale: 0.9
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".best-selling-section",
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, [products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProducts = await apiService.getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop';
  };

  if (loading) {
    return (
      <section className="py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-jarvis-blue mx-auto mb-4"></div>
          <p className="text-jarvis-cyan">Loading quantum technologies...</p>
        </div>
      </section>
    );
  }

  // Removed early return for error to allow Best Selling Products to show

  return (
    <section id="products" ref={sectionRef} className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Best Selling Products Section */}
        <div className="best-selling-section mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-jarvis-green to-jarvis-cyan neon-text">
              Best Selling Products
            </h2>
            <p className="text-lg text-jarvis-green font-audiowide">
              Most popular advanced technology solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellingProducts.map((product, index) => (
              <div
                key={product.id}
                ref={(el) => {
                  if (el) bestSellingRef.current[index] = el;
                }}
                className="product-card group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-jarvis-dark/80 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-jarvis-green/20 text-jarvis-green px-2 py-1 rounded-full text-xs border border-jarvis-green/50 font-semibold">
                      BESTSELLER
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-jarvis-blue/20 text-jarvis-blue px-3 py-1 rounded-full text-sm border border-jarvis-blue/50">
                      {product.category}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold mb-2 text-jarvis-cyan group-hover:text-jarvis-green transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-gray-300 mb-4 text-sm line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-jarvis-green">
                    ${product.price.toLocaleString()}
                  </span>
                  <button className="glow-button text-xs px-3 py-2 hover:bg-jarvis-green/10 hover:border-jarvis-green hover:text-jarvis-green transition-all duration-300">
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Original Products Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-jarvis-blue to-jarvis-cyan neon-text">
            Advanced Technology
          </h2>
          <p className="text-xl text-jarvis-cyan font-audiowide">
            Cutting-edge solutions for tomorrow's challenges
          </p>
        </div>

        {/* Show error message if API failed, otherwise show products */}
        {error ? (
          <div className="text-center glass-panel p-8 rounded-lg border border-red-500/30 max-w-md mx-auto mb-16">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-red-400 mb-2">System Error</h3>
            <p className="text-gray-300 mb-4">{error}</p>
            <button 
              onClick={fetchProducts}
              className="glow-button px-4 py-2"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <div
                  key={product._id}
                  ref={(el) => {
                    if (el) cardsRef.current[index] = el;
                  }}
                  className="product-card"
                >
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-jarvis-dark/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-jarvis-blue/20 text-jarvis-blue px-3 py-1 rounded-full text-sm border border-jarvis-blue/50">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 text-jarvis-cyan">{product.name}</h3>
                  <p className="text-gray-300 mb-4 text-sm">{product.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-jarvis-green font-semibold mb-2">Features:</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-1 h-1 bg-jarvis-green rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-jarvis-blue">${product.price.toLocaleString()}</span>
                    <button className="glow-button text-sm px-4 py-2">
                      Access Protocol
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Slider */}
            {products.length > 0 && (
              <div className="md:hidden">
                <div className="relative overflow-hidden rounded-lg">
                  <div 
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {products.map((product) => (
                      <div key={product._id} className="w-full flex-shrink-0 px-4">
                        <div className="product-card">
                          <div className="relative overflow-hidden rounded-lg mb-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-48 object-cover"
                              onError={handleImageError}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-jarvis-dark/80 to-transparent"></div>
                            <div className="absolute bottom-4 left-4">
                              <span className="bg-jarvis-blue/20 text-jarvis-blue px-3 py-1 rounded-full text-sm border border-jarvis-blue/50">
                                {product.category}
                              </span>
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-bold mb-2 text-jarvis-cyan">{product.name}</h3>
                          <p className="text-gray-300 mb-4 text-sm">{product.description}</p>
                          
                          <div className="mb-4">
                            <h4 className="text-jarvis-green font-semibold mb-2">Features:</h4>
                            <ul className="text-sm text-gray-400 space-y-1">
                              {product.features.slice(0, 3).map((feature, idx) => (
                                <li key={idx} className="flex items-center">
                                  <span className="w-1 h-1 bg-jarvis-green rounded-full mr-2"></span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-jarvis-blue">${product.price.toLocaleString()}</span>
                            <button className="glow-button text-sm px-4 py-2">
                              Access Protocol
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slider Controls */}
                <div className="flex justify-center items-center mt-6 space-x-4">
                  <button
                    onClick={prevSlide}
                    className="w-10 h-10 rounded-full border border-jarvis-blue/50 text-jarvis-blue hover:bg-jarvis-blue/10 transition-all duration-300"
                  >
                    ←
                  </button>
                  
                  <div className="flex space-x-2">
                    {products.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? 'bg-jarvis-blue shadow-lg shadow-jarvis-blue/50' 
                            : 'bg-jarvis-blue/30'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={nextSlide}
                    className="w-10 h-10 rounded-full border border-jarvis-blue/50 text-jarvis-blue hover:bg-jarvis-blue/10 transition-all duration-300"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Products;

