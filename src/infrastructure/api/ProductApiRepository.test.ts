import { ProductApiRepository } from './ProductApiRepository';
import { httpClient } from './httpClient';
import type { ProductSummary, ProductDetail } from '@/domain/models/Product';

jest.mock('./httpClient');

const mockHttpClient = httpClient as jest.MockedFunction<typeof httpClient>;

const mockProducts: ProductSummary[] = [
  {
    id: '1',
    brand: 'Samsung',
    name: 'Galaxy S24',
    basePrice: 899,
    imageUrl: 'http://example.com/s24.webp',
  },
  {
    id: '2',
    brand: 'Apple',
    name: 'iPhone 15',
    basePrice: 999,
    imageUrl: 'http://example.com/i15.webp',
  },
];

const mockDetail: ProductDetail = {
  id: '1',
  brand: 'Samsung',
  name: 'Galaxy S24',
  basePrice: 899,
  description: 'A great phone',
  rating: 4.5,
  specs: {
    screen: '6.2"',
    resolution: 'FHD+',
    processor: 'Snapdragon 8 Gen 3',
    mainCamera: '50 MP',
    selfieCamera: '12 MP',
    battery: '4000 mAh',
    os: 'Android 14',
    screenRefreshRate: '120 Hz',
  },
  colorOptions: [{ name: 'Black', hexCode: '#000', imageUrl: 'http://example.com/black.webp' }],
  storageOptions: [{ capacity: '256 GB', price: 899 }],
  similarProducts: [],
};

describe('ProductApiRepository', () => {
  const repository = new ProductApiRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('calls httpClient with /products endpoint', async () => {
      mockHttpClient.mockResolvedValue(mockProducts);

      const result = await repository.getProducts();

      expect(mockHttpClient).toHaveBeenCalledWith('/products', {
        params: { search: undefined, limit: undefined, offset: undefined },
        next: { revalidate: 60 },
      });
      expect(result).toEqual(mockProducts);
    });

    it('passes search params to httpClient', async () => {
      mockHttpClient.mockResolvedValue(mockProducts);

      await repository.getProducts({ search: 'galaxy', limit: 10, offset: 0 });

      expect(mockHttpClient).toHaveBeenCalledWith('/products', {
        params: { search: 'galaxy', limit: 10, offset: 0 },
        next: { revalidate: 60 },
      });
    });

    it('propagates errors from httpClient', async () => {
      mockHttpClient.mockRejectedValue(new Error('API request failed: 500 Internal Server Error'));

      await expect(repository.getProducts()).rejects.toThrow('API request failed');
    });
  });

  describe('getProductById', () => {
    it('calls httpClient with /products/:id endpoint', async () => {
      mockHttpClient.mockResolvedValue(mockDetail);

      const result = await repository.getProductById('1');

      expect(mockHttpClient).toHaveBeenCalledWith('/products/1', {
        next: { revalidate: 60 },
      });
      expect(result).toEqual(mockDetail);
    });

    it('propagates errors from httpClient', async () => {
      mockHttpClient.mockRejectedValue(new Error('API request failed: 404 Not Found'));

      await expect(repository.getProductById('invalid')).rejects.toThrow('API request failed');
    });
  });
});
