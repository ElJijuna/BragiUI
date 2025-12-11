import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CVESummary } from './CVESummary';
import * as cveProxy from './proxy/cveProxy';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithQueryClient = (component: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('CVESummary', () => {
  it('renders empty state when no CVE is provided', () => {
    renderWithQueryClient(<CVESummary cve="" />);
    expect(screen.getByTestId('cve-summary-empty')).toBeInTheDocument();
    expect(screen.getByText('Please provide a CVE ID')).toBeInTheDocument();
  });

  it('renders skeleton state initially', () => {
    renderWithQueryClient(<CVESummary cve="CVE-2025-36000" />);
    expect(screen.getByTestId('cve-summary-skeleton')).toBeInTheDocument();
  });

  it('renders error state when invalid CVE format is provided', async () => {
    jest.spyOn(cveProxy, 'parseCVEId').mockImplementationOnce(() => {
      throw new Error('Invalid CVE format. Use CVE-YYYY-XXXXX');
    });

    renderWithQueryClient(<CVESummary cve="INVALID-CVE" />);

    await waitFor(() => {
      expect(screen.getByTestId('cve-summary-error')).toBeInTheDocument();
    });

    expect(screen.getByText(/Error:/i)).toBeInTheDocument();
  });

  it('renders CVE data when fetch is successful', async () => {
    const mockCVEData = {
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
          description: 'This is a test CVE description',
          affected: [
            {
              product: 'TestProduct',
              vendor: 'TestVendor',
              versions: [],
            },
          ],
          references: [
            {
              url: 'https://example.com',
              name: 'Example Reference',
            },
          ],
        },
      },
    };

    jest.spyOn(cveProxy, 'fetchCVEData').mockResolvedValueOnce(mockCVEData as any);

    renderWithQueryClient(<CVESummary cve="CVE-2025-36000" />);

    await waitFor(() => {
      expect(screen.getByTestId('cve-summary-container')).toBeInTheDocument();
    });

    expect(screen.getByText('CVE-2025-36000')).toBeInTheDocument();
    expect(screen.getByText('Test Vulnerability')).toBeInTheDocument();
    expect(screen.getByText(/This is a test CVE description/)).toBeInTheDocument();
  });
});
