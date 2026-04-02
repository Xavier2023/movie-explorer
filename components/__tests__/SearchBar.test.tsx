import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';
import * as navigation from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock debounce
jest.mock('use-debounce', () => ({
  useDebouncedCallback: (fn: (...args: any[]) => void) => fn,
}));

describe('SearchBar', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    (navigation.useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });

    (navigation.usePathname as jest.Mock).mockReturnValue('/');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with the initial query value', () => {
    render(<SearchBar initialQuery="avatar" />);
    const input = screen.getByPlaceholderText('Search movies...') as HTMLInputElement;

    expect(input.value).toBe('avatar');
  });

  it('updates URL when user types (debounced)', () => {
    render(<SearchBar initialQuery="" />);
    const input = screen.getByPlaceholderText('Search movies...');

    fireEvent.change(input, { target: { value: 'matrix' } });

    expect(mockReplace).toHaveBeenCalledWith('/?page=1&query=matrix');
  });
});