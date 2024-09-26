import '@testing-library/jest-dom';
import { ProductCard } from '../src/components/ProductCard';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

describe('ProductCard Component', () => {
  const product = {
    id: '1',
    name: 'Test Product',
    priceInCents: 1234,
    description: 'This is a test product description.',
    imagePath: '/path/to/image.jpg',
  };

  test('renders product details correctly', () => {
    render(
      <Router>
        <ProductCard {...product} />
      </Router>
    );

    expect(screen.getByAltText(product.name)).toBeInTheDocument();
    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText('$12.34')).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /purchase/i })).toHaveAttribute('href', `/products/${product.id}/purchase`);
  });
});