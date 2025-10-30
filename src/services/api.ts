import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  LoginRequest,
  TokenResponse,
  SellerRequest,
  SellerResponse,
  SellerActivateRequest,
  ProductRequest,
  ProductResponse,
  SaleRequest,
  SaleResponse,
} from '@/types/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token de autenticação
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para tratar respostas
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<TokenResponse> {
    const response: AxiosResponse<TokenResponse> = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  // Seller endpoints
  async createSeller(seller: SellerRequest): Promise<SellerResponse> {
    const response: AxiosResponse<SellerResponse> = await this.api.post('/sellers', seller);
    return response.data;
  }

  async activateSeller(activation: SellerActivateRequest): Promise<SellerResponse> {
    const response: AxiosResponse<SellerResponse> = await this.api.post('/sellers/activate', activation);
    return response.data;
  }

  // Product endpoints
  async createProduct(product: ProductRequest): Promise<ProductResponse> {
    const response: AxiosResponse<ProductResponse> = await this.api.post('/products', product);
    return response.data;
  }

  async getAllProducts(): Promise<ProductResponse[]> {
    const response: AxiosResponse<ProductResponse[]> = await this.api.get('/products');
    return response.data;
  }

  async getProductById(id: number): Promise<ProductResponse> {
    const response: AxiosResponse<ProductResponse> = await this.api.get(`/products/${id}`);
    return response.data;
  }

  async updateProduct(id: number, product: ProductRequest): Promise<ProductResponse> {
    const response: AxiosResponse<ProductResponse> = await this.api.put(`/products/${id}`, product);
    return response.data;
  }

  async inactivateProduct(id: number): Promise<void> {
    await this.api.patch(`/products/${id}/inactivate`);
  }

  // Sale endpoints
  async createSale(sale: SaleRequest): Promise<SaleResponse> {
    const response: AxiosResponse<SaleResponse> = await this.api.post('/sales', null, {
      params: sale
    });
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;