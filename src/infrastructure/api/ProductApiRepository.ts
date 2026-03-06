import type { ProductRepository, GetProductsParams } from '@/domain/repositories/ProductRepository';
import type { ProductSummary, ProductDetail } from '@/domain/models/Product';
import { httpClient } from './httpClient';

/**
 * Concrete implementation of ProductRepository using the REST API.
 * Liskov Substitution: can be swapped with any other ProductRepository.
 */
export class ProductApiRepository implements ProductRepository {
  async getProducts(params?: GetProductsParams): Promise<ProductSummary[]> {
    return httpClient<ProductSummary[]>('/products', {
      params: {
        search: params?.search,
        limit: params?.limit,
        offset: params?.offset,
      },
      next: { revalidate: 60 },
    });
  }

  async getProductById(id: string): Promise<ProductDetail> {
    return httpClient<ProductDetail>(`/products/${id}`, {
      next: { revalidate: 60 },
    });
  }
}
