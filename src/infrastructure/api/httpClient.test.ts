import { httpClient } from './httpClient';

const API_BASE_URL = 'https://prueba-tecnica-api-tienda-moviles.onrender.com';

describe('httpClient', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('makes a GET request to the correct URL with x-api-key header', async () => {
    const mockData = { id: '1', name: 'Phone' };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await httpClient('/products');

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/products`,
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-api-key': expect.any(String),
        }),
      }),
    );
    expect(result).toEqual(mockData);
  });

  it('appends query params when provided', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await httpClient('/products', { params: { search: 'galaxy', limit: 20 } });

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(calledUrl).toContain('search=galaxy');
    expect(calledUrl).toContain('limit=20');
  });

  it('skips undefined and empty string params', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await httpClient('/products', { params: { search: undefined, limit: 20, offset: '' } });

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(calledUrl).not.toContain('search');
    expect(calledUrl).not.toContain('offset');
    expect(calledUrl).toContain('limit=20');
  });

  it('throws an error when response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await expect(httpClient('/products/invalid')).rejects.toThrow(
      'API request failed: 404 Not Found',
    );
  });

  it('passes next options to fetch', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await httpClient('/products', { next: { revalidate: 60 } });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        next: { revalidate: 60 },
      }),
    );
  });
});
