import React from 'react';
import { render, screen } from '@testing-library/react';
import { Skeleton, CVESummarySkeleton } from './Skeleton';

describe('Skeleton Component', () => {
  it('renders a skeleton element with correct data-testid', () => {
    render(<Skeleton data-testid="skeleton-element" />);
    expect(screen.getByTestId('skeleton-element')).toBeInTheDocument();
  });

  it('applies correct styles to skeleton element', () => {
    const { container } = render(<Skeleton width="100px" height="20px" />);
    const skeletonDiv = container.querySelector('div');
    expect(skeletonDiv).toHaveStyle('width: 100px');
    expect(skeletonDiv).toHaveStyle('height: 20px');
  });

  it('applies borderRadius style', () => {
    const { container } = render(<Skeleton borderRadius="8px" />);
    const skeletonDiv = container.querySelector('div');
    expect(skeletonDiv).toHaveStyle('borderRadius: 8px');
  });
});

describe('CVESummarySkeleton Component', () => {
  it('renders skeleton layout for CVESummary', () => {
    render(<CVESummarySkeleton />);
    expect(screen.getByTestId('cve-summary-skeleton')).toBeInTheDocument();
  });

  it('renders multiple skeleton elements', () => {
    const { container } = render(<CVESummarySkeleton />);
    // CVESummarySkeleton should have multiple skeleton elements inside
    const skeletons = container.querySelectorAll('div[style*="animation"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
