import type { FC } from 'react';
import { CVESummary } from '../CVESummary/CVESummary';
import type { CVEData } from './domain/types';

export const CVESummaryExample: FC = () => {
  const data: CVEData = {
    cveMetadata: {
      cveId: 'CVE-2025-36000',
      assignerOrgName: 'Example Organization',
      assignerShortName: 'EXAMPLE',
      dateReserved: '2025-01-01T00:00:00Z',
      datePublished: '2025-01-02T00:00:00Z',
      dateUpdated: '2025-01-03T00:00:00Z',
    },
    containers: {
      cna: {
        title: 'Example vulnerability',
        descriptions: [{ value: 'Data is supplied by the host application.' }],
      },
    },
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <CVESummary data={data} />
    </div>
  );
};

export default CVESummaryExample;
