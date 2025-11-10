// Tipos baseados nos DTOs da API Java

// Auth Types
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface TokenResponse {
  token: string;
  user: SellerResponse;
}

// Seller Types
export interface SellerRequest {
  nome: string;
  cnpj: string;
  email: string;
  celular: string;
  senha: string;
}

export interface SellerResponse {
  id: number;
  nome: string;
  email: string;
  status: boolean;
}

export interface SellerActivateRequest {
  celular: string;
  codigoAtivacao: string;
}

// Product Types
export interface ProductRequest {
  nome: string;
  preco: number;
  quantidade: number;
  imagem?: string;
}

export interface ProductResponse {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  status: boolean;
  imagem?: string;
  sellerId: number;
}

// Sale Types
export interface SaleRequest {
  productId: number;
  quantidade: number;
}

export interface SaleResponse {
  id: number;
  produtoId: number;
  produtoNome: string;
  quantidadeVendida: number;
  precoNoMomentoDaVenda: number;
  dataDaVenda: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Error types
export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
}