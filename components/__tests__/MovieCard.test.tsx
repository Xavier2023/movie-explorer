import { render, screen } from '@testing-library/react';
import MovieCard from '../MovieCard';
import { Movie } from '@/types/movie';
import '@testing-library/jest-dom';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  ),
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const mockMovie: Movie = {
  id: 123,
  title: 'Inception',
  release_date: '2010-07-16',
  vote_average: 8.8,
  poster_path: '/poster.jpg',
  overview: 'A thief who steals corporate secrets...',
};

describe('MovieCard', () => {
  it('displays movie title, year, and rating', () => {
    render(<MovieCard movie={mockMovie} />);

    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('2010')).toBeInTheDocument();
    expect(screen.getByText('⭐ 8.8')).toBeInTheDocument();
  });

  it('links to the correct detail page', () => {
    render(<MovieCard movie={mockMovie} />);
    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('href', '/movie/123');
  });
});