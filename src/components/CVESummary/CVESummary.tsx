import React from 'react';
import type { CVESummaryProps } from './domain/types';
import { CVESummarySkeleton } from './components/Skeleton';

const sectionStyle: React.CSSProperties = {
  marginTop: '24px',
  paddingTop: '16px',
  borderTop: '1px solid var(--bragi-border, #e5e7eb)',
};

const panelStyle: React.CSSProperties = {
  padding: '16px',
  background: 'var(--bragi-surface, #f9fafb)',
  border: '1px solid var(--bragi-border, #e5e7eb)',
  borderRadius: '6px',
};

const getSeverityColor = (severity?: string): string => {
  switch (severity) {
    case 'CRITICAL':
      return 'var(--bragi-critical, #dc2626)';
    case 'HIGH':
      return 'var(--bragi-high, #ea580c)';
    case 'MEDIUM':
      return 'var(--bragi-medium, #ca8a04)';
    case 'LOW':
      return 'var(--bragi-low, #16a34a)';
    case 'INFO':
    case 'NONE':
      return 'var(--bragi-info, #2563eb)';
    default:
      return 'var(--bragi-muted, #6b7280)';
  }
};

export const CVESummary: React.FC<CVESummaryProps> = ({ data, loading = false, error, className, style }) => {
  if (error) {
    return (
      <div role="alert" data-testid="cve-summary-error" style={{ padding: '16px', color: 'var(--bragi-error-foreground, #991b1b)', background: 'var(--bragi-error-background, #fef2f2)', border: '1px solid var(--bragi-error-border, #fecaca)', borderRadius: '6px' }}>
        <strong>Error al cargar el CVE</strong>
        <p>{error.message}</p>
      </div>
    );
  }

  if (loading) {
    return <CVESummarySkeleton />;
  }

  if (!data || !data.cveMetadata) {
    return (
      <div data-testid="cve-summary-empty" style={{ padding: '40px 0', textAlign: 'center', color: 'var(--bragi-muted, #6b7280)' }}>
        No hay datos disponibles
      </div>
    );
  }

  const { cveMetadata, containers } = data;
  const cnaContainer = containers.cna;
  const adpContainer = containers.adp?.[0];
  const description = cnaContainer?.descriptions?.[0]?.value;
  const cnaMetric = cnaContainer?.metrics?.[0]?.cvssV3_1;
  const adpMetric = adpContainer?.metrics?.[0]?.cvssV3_1;
  const cvssMetric = cnaMetric || adpMetric;
  const cvssScore = cvssMetric?.baseScore;
  const cvssSeverity = cvssMetric?.baseSeverity;
  const severityColor = getSeverityColor(cvssSeverity);

  return (
    <article data-testid="cve-summary-container" className={["cve-summary-card", className].filter(Boolean).join(" ")} style={{ width: '100%', padding: '24px', border: '1px solid var(--bragi-border, #e5e7eb)', borderRadius: '8px', boxSizing: 'border-box', ...style }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>{cveMetadata.cveId}</h2>
        {cvssSeverity && <span style={{ color: severityColor, fontWeight: 700 }}>{cvssSeverity}</span>}
      </header>

      {cnaContainer?.title && <h3 style={{ ...sectionStyle, color: 'var(--bragi-info, #2563eb)' }}>{cnaContainer.title}</h3>}

      {description && (
        <section style={sectionStyle}>
          <h4>Descripción</h4>
          <p>{description}</p>
        </section>
      )}

      {cvssScore !== undefined && (
        <section style={{ ...sectionStyle, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div style={panelStyle}>
            <h4>Puntuación CVSS v3.1</h4>
            <strong style={{ fontSize: '32px', color: severityColor }}>{cvssScore}</strong>
            {cvssSeverity && <span style={{ marginLeft: '12px', color: severityColor }}>{cvssSeverity}</span>}
          </div>
          <div style={panelStyle}>
            <h4>Fechas</h4>
            <p><strong>Publicado:</strong> {new Date(cveMetadata.datePublished).toLocaleDateString()}</p>
            {cveMetadata.dateUpdated && <p><strong>Actualizado:</strong> {new Date(cveMetadata.dateUpdated).toLocaleDateString()}</p>}
          </div>
        </section>
      )}

      {cvssMetric && (
        <section style={sectionStyle}>
          <h4>Detalles de la Métrica CVSS</h4>
          {cvssMetric.vectorString && <p><strong>Vector:</strong> <code style={{ wordBreak: 'break-all' }}>{cvssMetric.vectorString}</code></p>}
          <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
            {[
              ['Ataque', cvssMetric.attackVector],
              ['Complejidad', cvssMetric.attackComplexity],
              ['Privilegios', cvssMetric.privilegesRequired],
              ['Interacción', cvssMetric.userInteraction],
              ['Scope', cvssMetric.scope],
            ].map(([label, value]) => value && <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
        </section>
      )}

      {cnaContainer?.affected?.length ? (
        <section style={sectionStyle}>
          <h4>Productos Afectados</h4>
          <div style={{ display: 'grid', gap: '8px' }}>
            {cnaContainer.affected.map((product, index) => (
              <div key={index} style={{ ...panelStyle, background: 'var(--bragi-info-background, #eff6ff)' }}>
                {product.vendor && <strong>{product.vendor}</strong>}
                <div>{product.product}</div>
                {product.versions?.length ? <small>Versiones: {product.versions.map((version) => version.version).join(', ')}</small> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {cnaContainer?.references?.length ? (
        <section style={sectionStyle}>
          <h4>Referencias</h4>
          <ul>
            {cnaContainer.references.map((reference, index) => (
              <li key={index}><a href={reference.url} target="_blank" rel="noopener noreferrer">{reference.name || reference.url}</a></li>
            ))}
          </ul>
        </section>
      ) : null}

      {cnaContainer?.problemTypes?.length ? (
        <section style={sectionStyle}>
          <h4>Tipos de Problema</h4>
          {cnaContainer.problemTypes.map((problem, index) => problem.descriptions?.map((description, descriptionIndex) => (
            <p key={`${index}-${descriptionIndex}`} style={panelStyle}>{description.cweId && <strong>{description.cweId}: </strong>}{description.value}</p>
          )))}
        </section>
      ) : null}

      {cnaContainer?.solutions?.length ? (
        <section style={sectionStyle}>
          <h4>Parches y Soluciones</h4>
          {cnaContainer.solutions.map((solution, index) => <p key={index} style={{ ...panelStyle, background: 'var(--bragi-success-background, #f0fdf4)' }}>{solution.lang && <strong>{solution.lang}: </strong>}{solution.value}</p>)}
        </section>
      ) : null}

      {cveMetadata.assignerOrgName && (
        <footer style={sectionStyle}>
          <small><strong>Asignador:</strong> {cveMetadata.assignerOrgName}{cveMetadata.assignerShortName && ` (${cveMetadata.assignerShortName})`}</small>
        </footer>
      )}
    </article>
  );
};
