const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const Joi = require('joi');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN === '*' ? true : process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client/build')));

// MongoDB Connection with retry logic
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('🔄 Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// MongoDB connection event handlers
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected successfully');
});

// Validation schemas
const productSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().min(1).max(500).required(),
  price: Joi.number().positive().required(),
  image: Joi.string().uri().required(),
  category: Joi.string().min(1).max(50).required(),
  features: Joi.array().items(Joi.string().max(100)).max(10).required()
});

const faqSchema = Joi.object({
  question: Joi.string().min(1).max(200).required(),
  answer: Joi.string().min(1).max(1000).required(),
  category: Joi.string().max(50).default('general')
});

const contactSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
  message: Joi.string().min(1).max(1000).required()
});

// Database Schemas
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  category: { type: String, required: true, trim: true },
  features: [{ type: String, trim: true }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const FAQSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
  category: { type: String, default: 'general', trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  message: { type: String, required: true, trim: true },
  status: { type: String, default: 'pending', enum: ['pending', 'read', 'responded'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamps on save
ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

FAQSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

ContactSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model('Product', ProductSchema);
const FAQ = mongoose.model('FAQ', FAQSchema);
const Contact = mongoose.model('Contact', ContactSchema);

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Products endpoints
app.get('/api/products', asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      message: 'Error fetching products', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
}));

app.post('/api/products', asyncHandler(async (req, res) => {
  try {
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.details.map(d => d.message) 
      });
    }

    const product = new Product(value);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ 
      message: 'Error creating product', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
}));

// FAQs endpoints
app.get('/api/faqs', asyncHandler(async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ 
      message: 'Error fetching FAQs', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
}));

app.post('/api/faqs', asyncHandler(async (req, res) => {
  try {
    const { error, value } = faqSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.details.map(d => d.message) 
      });
    }

    const faq = new FAQ(value);
    const savedFaq = await faq.save();
    res.status(201).json(savedFaq);
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ 
      message: 'Error creating FAQ', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
}));

// Contact endpoints
app.post('/api/contact', asyncHandler(async (req, res) => {
  try {
    const { error, value } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.details.map(d => d.message) 
      });
    }

    const contact = new Contact(value);
    const savedContact = await contact.save();
    res.status(201).json({ 
      message: 'Message sent successfully', 
      data: { 
        id: savedContact._id, 
        createdAt: savedContact.createdAt 
      } 
    });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ 
      message: 'Error sending message', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
}));

app.get('/api/contact', asyncHandler(async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ 
      message: 'Error fetching contacts', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
}));

// Initialize sample data endpoint
app.post('/api/init-data', asyncHandler(async (req, res) => {
  try {
    // Check if data already exists
    const existingProducts = await Product.countDocuments();
    const existingFAQs = await FAQ.countDocuments();

    if (existingProducts > 0 && existingFAQs > 0) {
      return res.json({ message: 'Sample data already exists' });
    }

    // Clear existing data only if explicitly requested
    if (req.body.force === true) {
      await Product.deleteMany({});
      await FAQ.deleteMany({});
    }

    // Sample products with proper image URLs
    const sampleProducts = [
      {
        name: "JARVIS AI Assistant",
        description: "Advanced AI assistant with voice recognition and natural language processing capabilities for seamless human-computer interaction.",
        price: 2999,
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
        category: "AI Technology",
        features: ["Voice Recognition", "Natural Language Processing", "Smart Home Integration", "Real-time Analytics", "Cloud Synchronization"]
      },
      {
        name: "Holographic Display Pro",
        description: "Next-generation holographic display technology for immersive 3D experiences and advanced data visualization.",
        price: 4999,
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
        category: "Display Technology",
        features: ["3D Holographic Projection", "Touch Interface", "Wireless Connectivity", "4K Resolution", "Multi-angle Viewing"]
      },
      {
        name: "Neural Interface X1",
        description: "Revolutionary brain-computer interface for direct neural control of devices with medical-grade safety standards.",
        price: 9999,
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
        category: "Neural Technology",
        features: ["Neural Signal Processing", "Wireless Data Transfer", "Real-time Feedback", "Medical Grade Safety", "Adaptive Learning"]
      },
      {
        name: "Quantum Processor Core",
        description: "Ultra-fast quantum processing unit with crystalline architecture for unprecedented computational performance.",
        price: 15999,
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
        category: "Quantum Computing",
        features: ["Quantum Entanglement", "Superposition Processing", "Error Correction", "Cryogenic Cooling", "Scalable Architecture"]
      }
    ];

    // Sample FAQs
    const sampleFAQs = [
      {
        question: "What is QuantumPulse technology?",
        answer: "QuantumPulse is an advanced AI system that combines quantum computing, machine learning, and neural interfaces to create seamless human-computer interaction experiences.",
        category: "technology"
      },
      {
        question: "How secure is the neural interface?",
        answer: "Our neural interfaces use military-grade encryption and are FDA approved. All data is processed locally with optional cloud backup using end-to-end encryption.",
        category: "security"
      },
      {
        question: "What's the warranty on holographic displays?",
        answer: "All holographic displays come with a 3-year warranty covering hardware defects and software updates. Extended warranty options are available for enterprise customers.",
        category: "warranty"
      },
      {
        question: "Can I integrate QuantumPulse with my smart home?",
        answer: "Yes, QuantumPulse is compatible with all major smart home platforms including Alexa, Google Home, Apple HomeKit, and custom IoT solutions.",
        category: "integration"
      },
      {
        question: "What are the system requirements?",
        answer: "Minimum requirements include 16GB RAM, dedicated GPU, and high-speed internet connection. Specific requirements vary by product configuration.",
        category: "technical"
      },
      {
        question: "Do you offer training and support?",
        answer: "Yes, we provide comprehensive training programs, 24/7 technical support, and dedicated account management for enterprise customers.",
        category: "support"
      }
    ];

    // Insert sample data
    const insertedProducts = await Product.insertMany(sampleProducts);
    const insertedFAQs = await FAQ.insertMany(sampleFAQs);

    res.json({ 
      message: 'Sample data initialized successfully',
      data: {
        products: insertedProducts.length,
        faqs: insertedFAQs.length
      }
    });
  } catch (error) {
    console.error('Error initializing data:', error);
    res.status(500).json({ 
      message: 'Error initializing sample data', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
}));

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN}`);
});

module.exports = app;

