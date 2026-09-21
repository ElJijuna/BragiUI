import React from 'react';
import { render, screen } from '@testing-library/react';
import { CVESummary } from './CVESummary';
import { CVEData } from './domain/types';

const cveData: CVEData = {
  cveMetadata: {
    cveId: 'CVE-2025-36000',
    assignerOrgName: 'Test Organization',
    assignerShortName: 'TEST',
    dateReserved: '2025-01-01T00:00:00Z',
    datePublished: '2025-01-02T00:00:00Z',
    dateUpdated: '2025-01-03T00:00:00Z',
  },
  containers: {
    cna: {
      title: 'Test Vulnerability',
      descriptions: [{ value: 'This is a test CVE description' }],
      affected: [{ product: 'TestProduct', vendor: 'TestVendor', versions: [] }],
      references: [{ url: 'https://example.com', name: 'Example Reference' }],
    },
  },
};

describe('CVESummary', () => {
  it('renders an empty state without data', () => {
    render(<CVESummary />);

    expect(screen.getByTestId('cve-summary-empty')).toBeInTheDocument();
    expect(screen.getByText('No hay datos disponibles')).toBeInTheDocument();
  });

  it('renders the loading state', () => {
    render(<CVESummary loading />);

    expect(screen.getByTestId('cve-summary-skeleton')).toBeInTheDocument();
  });

  it('renders the error state', () => {
    render(<CVESummary error={new Error('Unable to load CVE')} />);

    expect(screen.getByTestId('cve-summary-error')).toBeInTheDocument();
    expect(screen.getByText('Unable to load CVE')).toBeInTheDocument();
  });

  it('renders data supplied by the consumer', () => {
    render(<CVESummary data={cveData} />);

    expect(screen.getByTestId('cve-summary-container')).toBeInTheDocument();
    expect(screen.getByText('CVE-2025-36000')).toBeInTheDocument();
    expect(screen.getByText('Test Vulnerability')).toBeInTheDocument();
    expect(screen.getByText('This is a test CVE description')).toBeInTheDocument();
  });
});
