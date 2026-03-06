import { API_BASE_URL, API_KEY } from '@/lib/constants';

interface RequestOptions {
  params?: Record<string, string | number | undefined>;
  next?: NextFetchRequestConfig;
}

/**
 * HTTP client with automatic x-api-key header injection.
 * Single Responsibility: authenticated HTTP requests to the API.
 */
export async function httpClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, next: nextOptions } = options;

  const url = new URL(`${API_BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      accept: 'application/json',
      'x-api-key': API_KEY,
    },
    next: nextOptions,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
