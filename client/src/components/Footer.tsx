import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-jarvis-dark/90 border-t border-jarvis-blue/30 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-jarvis-blue to-jarvis-cyan rounded-full animate-pulse-glow"></div>
              <span className="text-2xl font-bold text-jarvis-blue neon-text">J.A.R.V.I.S</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Advanced AI Technology Solutions for the Future. Pioneering the next generation of 
              intelligent systems and human-computer interaction.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-jarvis-blue/20 rounded-lg flex items-center justify-center border border-jarvis-blue/30 hover:bg-jarvis-blue/30 transition-all duration-300 cursor-pointer">
                <span className="text-jarvis-blue">🔗</span>
              </div>
              <div className="w-10 h-10 bg-jarvis-cyan/20 rounded-lg flex items-center justify-center border border-jarvis-cyan/30 hover:bg-jarvis-cyan/30 transition-all duration-300 cursor-pointer">
                <span className="text-jarvis-cyan">📱</span>
              </div>
              <div className="w-10 h-10 bg-jarvis-green/20 rounded-lg flex items-center justify-center border border-jarvis-green/30 hover:bg-jarvis-green/30 transition-all duration-300 cursor-pointer">
                <span className="text-jarvis-green">🌐</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-jarvis-cyan mb-4">Quick Access</h3>
            <ul className="space-y-2">
              {['Home', 'Products', 'About', 'FAQ', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-jarvis-blue transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-jarvis-blue rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* System Info */}
          <div>
            <h3 className="text-lg font-semibold text-jarvis-green mb-4">System Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Version:</span>
                <span className="text-jarvis-green">v2.4.7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Uptime:</span>
                <span className="text-jarvis-cyan">99.9%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-jarvis-blue">OPERATIONAL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Update:</span>
                <span className="text-gray-300">2024-12-28</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-jarvis-blue/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 J.A.R.V.I.S Technologies. All protocols reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-jarvis-blue transition-colors duration-300">
              Privacy Protocol
            </a>
            <a href="#" className="text-gray-400 hover:text-jarvis-cyan transition-colors duration-300">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-jarvis-green transition-colors duration-300">
              Security Policy
            </a>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute bottom-4 left-4 w-2 h-2 bg-jarvis-blue rounded-full animate-ping opacity-50"></div>
        <div className="absolute bottom-8 right-8 w-1 h-1 bg-jarvis-cyan rounded-full animate-pulse opacity-50"></div>
      </div>
    </footer>
  );
};

export default Footer;

