import type { FC } from 'react';

const skeletonRows = Array.from({ length: 3 });

export const CVESummarySkeleton: FC = () => {
  return (
    <div
      role="status"
      data-testid="cve-summary-skeleton"
      aria-busy="true"
      aria-label="Cargando CVE"
      style={{
        width: '100%',
        padding: '24px',
        border: '1px solid var(--bragi-border, #e5e7eb)',
        borderRadius: '8px',
      }}
    >
      <div
        style={{
          height: '28px',
          width: '35%',
          background: 'var(--bragi-border, #e5e7eb)',
          borderRadius: '4px',
        }}
      />
      <div
        style={{
          height: '20px',
          width: '60%',
          marginTop: '20px',
          background: 'var(--bragi-border, #e5e7eb)',
          borderRadius: '4px',
        }}
      />
      {skeletonRows.map((_, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length placeholder rows with no identity, never reordered
          key={index}
          style={{
            height: '14px',
            width: `${90 - index * 15}%`,
            marginTop: '12px',
            background: 'var(--bragi-skeleton, #f3f4f6)',
            borderRadius: '4px',
          }}
        />
      ))}
    </div>
  );
};
