import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CVESummary } from '../CVESummary/CVESummary';

const queryClient = new QueryClient();

export const CVESummaryExample: React.FC = () => {
  const [cveId, setCveId] = useState<string>('CVE-2025-36000');

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>CVE Lookup Tool</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="cve-input" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Enter CVE ID:
          </label>
          <input
            id="cve-input"
            type="text"
            value={cveId}
            onChange={(e) => setCveId(e.target.value)}
            placeholder="e.g., CVE-2025-36000"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <CVESummary cve={cveId} />
      </div>
    </QueryClientProvider>
  );
};

export default CVESummaryExample;
