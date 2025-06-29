import axios, { AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, Product, FAQ, Contact, ContactFormData, HealthCheck } from '../types';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded. Please try again later.');
    } else if (error.response && error.response.status >= 500) {
      console.error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout. Please check your connection.');
    }
    return Promise.reject(error);
  }
);

// API Functions
export const apiService = {
  // Health check
  async healthCheck(): Promise<HealthCheck> {
    try {
      const response = await api.get<HealthCheck>('/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Products
  async getProducts(): Promise<Product[]> {
    try {
      const response = await api.get<Product[]>('/products');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async createProduct(productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const response = await api.post<Product>('/products', productData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // FAQs
  async getFAQs(): Promise<FAQ[]> {
    try {
      const response = await api.get<FAQ[]>('/faqs');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async createFAQ(faqData: Omit<FAQ, '_id' | 'createdAt' | 'updatedAt'>): Promise<FAQ> {
    try {
      const response = await api.post<FAQ>('/faqs', faqData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Contact
  async submitContact(contactData: ContactFormData): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/contact', contactData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async getContacts(): Promise<Contact[]> {
    try {
      const response = await api.get<Contact[]>('/contact');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Initialize data
  async initializeData(force: boolean = false): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/init-data', { force });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Error handler
  handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      const details = error.response?.data?.details;
      
      const errorObj = new Error(message) as any;
      errorObj.status = error.response?.status;
      errorObj.details = details;
      
      return errorObj;
    }
    
    return error instanceof Error ? error : new Error('Unknown error occurred');
  }
};

export default apiService;

