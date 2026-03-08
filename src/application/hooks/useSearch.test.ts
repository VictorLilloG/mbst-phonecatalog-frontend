import { renderHook, act } from '@testing-library/react';
import { useSearch } from './useSearch';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useSearch', () => {
  it('returns empty query and debouncedQuery initially', () => {
    const { result } = renderHook(() => useSearch());

    expect(result.current.query).toBe('');
    expect(result.current.debouncedQuery).toBe('');
  });

  it('updates query immediately on setQuery', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery('Samsung');
    });

    expect(result.current.query).toBe('Samsung');
    expect(result.current.debouncedQuery).toBe('');
  });

  it('updates debouncedQuery after debounce delay', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery('iPhone');
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.debouncedQuery).toBe('iPhone');
  });

  it('does not update debouncedQuery before debounce delay', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery('Pixel');
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current.debouncedQuery).toBe('');
  });

  it('resets debounce timer on rapid input changes', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery('S');
    });

    act(() => {
      jest.advanceTimersByTime(800);
    });

    act(() => {
      result.current.setQuery('Sa');
    });

    act(() => {
      jest.advanceTimersByTime(800);
    });

    // Not yet — only 800ms since last change
    expect(result.current.debouncedQuery).toBe('');

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current.debouncedQuery).toBe('Sa');
  });

  it('debounces clearing the query', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery('test');
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.debouncedQuery).toBe('test');

    act(() => {
      result.current.setQuery('');
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.debouncedQuery).toBe('');
  });
});
