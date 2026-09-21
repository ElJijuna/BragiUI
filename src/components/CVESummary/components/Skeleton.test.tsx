import { render, screen } from '@testing-library/react';
import { CVESummarySkeleton } from './Skeleton';

describe('CVESummarySkeleton', () => {
  it('renders an accessible loading placeholder', () => {
    render(<CVESummarySkeleton />);

    expect(screen.getByTestId('cve-summary-skeleton')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByLabelText('Cargando CVE')).toBeInTheDocument();
    expect(screen.getByTestId('cve-summary-skeleton').children).toHaveLength(5);
  });
});
