import { cartStorage } from './cartStorage';
import type { CartItem } from '@/domain/models/CartItem';

const mockItem: CartItem = {
  productId: 'TEST-001',
  name: 'Test Phone',
  brand: 'TestBrand',
  imageUrl: 'http://example.com/phone.webp',
  selectedColor: 'Black',
  selectedStorage: '128 GB',
  price: 499,
  quantity: 1,
};

describe('cartStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getItems', () => {
    it('returns empty array when localStorage is empty', () => {
      expect(cartStorage.getItems()).toEqual([]);
    });

    it('returns parsed items from localStorage', () => {
      localStorage.setItem('mbst-cart', JSON.stringify([mockItem]));
      expect(cartStorage.getItems()).toEqual([mockItem]);
    });

    it('returns empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem('mbst-cart', 'not-json');
      expect(cartStorage.getItems()).toEqual([]);
    });
  });

  describe('saveItems', () => {
    it('saves items to localStorage', () => {
      cartStorage.saveItems([mockItem]);
      const stored = JSON.parse(localStorage.getItem('mbst-cart')!);
      expect(stored).toEqual([mockItem]);
    });

    it('overwrites existing items', () => {
      cartStorage.saveItems([mockItem]);
      const updated = { ...mockItem, quantity: 3 };
      cartStorage.saveItems([updated]);
      const stored = JSON.parse(localStorage.getItem('mbst-cart')!);
      expect(stored).toEqual([updated]);
    });
  });

  describe('clearItems', () => {
    it('removes cart key from localStorage', () => {
      localStorage.setItem('mbst-cart', JSON.stringify([mockItem]));
      cartStorage.clearItems();
      expect(localStorage.getItem('mbst-cart')).toBeNull();
    });
  });
});
