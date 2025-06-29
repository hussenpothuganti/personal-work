// API Response Types
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
  details?: string[];
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  features: string[];
}

// FAQ Types
export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface FAQFormData {
  question: string;
  answer: string;
  category?: string;
}

// Contact Types
export interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: 'pending' | 'read' | 'responded';
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Best Selling Product Types
export interface BestSellingProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

// Component Props Types
export interface LoadingScreenProps {
  onComplete: () => void;
}

export interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

// API Error Types
export interface ApiError {
  message: string;
  status?: number;
  details?: string[];
}

// Form State Types
export type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export interface FormState<T> {
  data: T;
  status: FormStatus;
  error?: string;
}

// Health Check Types
export interface HealthCheck {
  status: string;
  timestamp: string;
  uptime: number;
  mongodb: string;
}

