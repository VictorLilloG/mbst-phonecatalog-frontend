import type { ProductSummary, ProductDetail } from '../models/Product';

export interface GetProductsParams {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ProductRepository {
  getProducts(params?: GetProductsParams): Promise<ProductSummary[]>;
  getProductById(id: string): Promise<ProductDetail>;
}
