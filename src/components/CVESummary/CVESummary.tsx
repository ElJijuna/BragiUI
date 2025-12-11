import React from 'react';
import { Empty, Alert, Card, Tag, Divider, Space, Row, Col, Typography, Button } from 'antd';
import { FiExternalLink } from 'react-icons/fi';
import { CVESummaryProps } from './domain/types';
import { useCVEData } from './hooks/useCVEData';
import { CVESummarySkeleton } from './components/Skeleton';

const { Title, Text, Paragraph } = Typography;

/**
 * Obtiene el color del tag de severidad CVSS
 */
const getSeverityColor = (severity?: string): string => {
  switch (severity) {
    case 'CRITICAL':
      return 'red';
    case 'HIGH':
      return 'orange';
    case 'MEDIUM':
      return 'gold';
    case 'LOW':
      return 'green';
    case 'INFO':
    case 'NONE':
      return 'blue';
    default:
      return 'default';
  }
};

/**
 * CVESummary Component
 *
 * Componente para mostrar información detallada de vulnerabilidades CVE.
 * Utiliza Ant Design 6.1.0 para una interfaz moderna y responsive.
 *
 * @param cve - CVE ID (ej: CVE-2025-36000)
 * @returns React component
 */
export const CVESummary: React.FC<CVESummaryProps> = ({ cve }) => {
  const { data, isPending, error } = useCVEData(cve);

  // Empty state
  if (!cve) {
    return (
      <Empty
        description="Por favor proporciona un CVE ID"
        style={{ padding: '40px 0' }}
        data-testid="cve-summary-empty"
      />
    );
  }

  // Loading state
  if (isPending) {
    return <CVESummarySkeleton />;
  }

  // Error state
  if (error) {
    return (
      <Alert
        message="Error al cargar el CVE"
        description={error instanceof Error ? error.message : 'Error desconocido'}
        type="error"
        showIcon
        closable
        data-testid="cve-summary-error"
      />
    );
  }

  // No data state
  if (!data || !data.cveMetadata) {
    return (
      <Empty
        description="No hay datos disponibles"
        style={{ padding: '40px 0' }}
        data-testid="cve-summary-no-data"
      />
    );
  }

  const cveMetadata = data.cveMetadata;
  const cnaContainer = data.containers.cna;
  const adpContainer = Array.isArray(data.containers.adp) ? data.containers.adp[0] : data.containers.adp;

  // Get description (usa descriptions array)
  const description = cnaContainer?.descriptions?.[0]?.value || cnaContainer?.description;

  // Get CVSS score - puede estar en cna.metrics o adp.metrics
  const cnaMetric = cnaContainer?.metrics?.[0]?.cvssV3_1;
  const adpMetric = adpContainer?.metrics?.[0]?.cvssV3_1;
  
  const cvssScore = cnaMetric?.baseScore || adpMetric?.baseScore;
  const cvssSeverity = cnaMetric?.baseSeverity || adpMetric?.baseSeverity;
  const cvssMetric = cnaMetric || adpMetric;

  return (
    <Card
      data-testid="cve-summary-container"
      style={{ width: '100%' }}
      className="cve-summary-card"
    >
      {/* CVE ID Header */}
      <Row gutter={[16, 16]} align="middle">
        <Col flex="auto">
          <Title level={2} style={{ margin: 0 }}>
            {cveMetadata.cveId}
          </Title>
        </Col>
        {cvssSeverity && (
          <Col>
            <Tag color={getSeverityColor(cvssSeverity)} style={{ fontSize: '12px', padding: '4px 8px' }}>
              {cvssSeverity}
            </Tag>
          </Col>
        )}
      </Row>

      <Divider style={{ margin: '16px 0' }} />

      {/* Title */}
      {cnaContainer?.title && (
        <>
          <Title level={4} style={{ color: '#1890ff' }}>
            {cnaContainer.title}
          </Title>
          <Divider style={{ margin: '12px 0' }} />
        </>
      )}

      {/* Description */}
      {description && (
        <>
          <Title level={5}>Descripción</Title>
          <Paragraph>{description}</Paragraph>
          <Divider />
        </>
      )}

      {/* CVSS Score Card */}
      {cvssScore && (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
            <Col xs={24} sm={12}>
              <Card
                type="inner"
                title="Puntuación CVSS v3.1"
                style={{ background: '#fafafa' }}
              >
                <Row align="middle" gutter={[16, 0]}>
                  <Col>
                    <Text style={{ fontSize: '32px', fontWeight: 'bold', color: getSeverityColor(cvssSeverity) }}>
                      {cvssScore}
                    </Text>
                  </Col>
                  <Col>
                    <Tag color={getSeverityColor(cvssSeverity)} style={{ fontSize: '14px', padding: '6px 12px' }}>
                      {cvssSeverity}
                    </Tag>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Publication Dates */}
            <Col xs={24} sm={12}>
              <Card type="inner" title="Fechas" style={{ background: '#fafafa' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Publicado:</Text>
                    <br />
                    <Text>{new Date(cveMetadata.datePublished).toLocaleDateString()}</Text>
                  </div>
                  {cveMetadata.dateUpdated && (
                    <div>
                      <Text strong>Actualizado:</Text>
                      <br />
                      <Text>{new Date(cveMetadata.dateUpdated).toLocaleDateString()}</Text>
                    </div>
                  )}
                </Space>
              </Card>
            </Col>
          </Row>

          {/* CVSS Vector and Details */}
          {cvssMetric && (
            <>
              <Card type="inner" title="Detalles de la Métrica CVSS" style={{ background: '#fafafa', marginBottom: '16px' }}>
                {cvssMetric.vectorString && (
                  <div style={{ marginBottom: '12px' }}>
                    <Text strong>Vector:</Text>
                    <br />
                    <Text code style={{ fontSize: '11px', wordBreak: 'break-all', display: 'block', marginTop: '4px' }}>
                      {cvssMetric.vectorString}
                    </Text>
                  </div>
                )}
                {cvssMetric.attackVector && (
                  <Row gutter={[16, 8]}>
                    <Col xs={24} sm={12}>
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          <strong>Ataque:</strong> {cvssMetric.attackVector}
                        </Text>
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          <strong>Complejidad:</strong> {cvssMetric.attackComplexity}
                        </Text>
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          <strong>Privilegios:</strong> {cvssMetric.privilegesRequired}
                        </Text>
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          <strong>Interacción:</strong> {cvssMetric.userInteraction}
                        </Text>
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          <strong>Scope:</strong> {cvssMetric.scope}
                        </Text>
                      </div>
                    </Col>
                  </Row>
                )}
              </Card>
              <Divider />
            </>
          )}
        </>
      )}

      {/* Affected Products */}
      {cnaContainer?.affected && cnaContainer.affected.length > 0 && (
        <>
          <Title level={5}>Productos Afectados</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            {cnaContainer.affected.map((product, idx) => (
              <Card key={idx} size="small" style={{ background: '#f0f5ff' }}>
                <Row gutter={[16, 8]} align="top">
                  <Col xs={24} sm={12} md={20}>
                    {product.vendor && (
                      <div style={{ marginBottom: '8px' }}>
                        <Text strong>{product.vendor}</Text>
                      </div>
                    )}
                    <Tag color="blue">{product.product}</Tag>
                  </Col>
                  <Col xs={24} sm={12} md={4}>
                    {product.versions && product.versions.length > 0 && (
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          <strong>Versiones:</strong>
                        </Text>
                        <div style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {product.versions.map((v, vidx) => (
                            <Tag key={vidx} style={{ fontSize: '11px' }}>
                              {v.version || 'N/A'}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>
              </Card>
            ))}
          </Space>
          <Divider />
        </>
      )}

      {/* References */}
      {cnaContainer?.references && cnaContainer.references.length > 0 && (
        <>
          <Title level={5}>Referencias</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            {cnaContainer.references.map((ref, idx) => (
              <Button
                key={idx}
                type="text"
                icon={<FiExternalLink />}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                block
                style={{ textAlign: 'left', height: 'auto', padding: '8px 0' }}
              >
                <Text ellipsis>{ref.name || ref.url}</Text>
              </Button>
            ))}
          </Space>
          <Divider />
        </>
      )}

      {/* Problem Types */}
      {cnaContainer?.problemTypes && cnaContainer.problemTypes.length > 0 && (
        <>
          <Title level={5}>Tipos de Problema</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            {cnaContainer.problemTypes.map((problem, idx) => (
              <div key={idx}>
                {problem.descriptions && problem.descriptions.length > 0 && (
                  <Card type="inner" size="small" style={{ background: '#fff7e6' }}>
                    {problem.descriptions.map((desc, didx) => (
                      <div key={didx} style={{ marginBottom: didx === problem.descriptions!.length - 1 ? 0 : '8px' }}>
                        {desc.cweId && (
                          <Tag color="orange" style={{ marginRight: '8px' }}>
                            {desc.cweId}
                          </Tag>
                        )}
                        <Text>{desc.value}</Text>
                      </div>
                    ))}
                  </Card>
                )}
              </div>
            ))}
          </Space>
          <Divider />
        </>
      )}

      {/* Solutions/Fixes */}
      {cnaContainer?.solutions && cnaContainer.solutions.length > 0 && (
        <>
          <Title level={5}>Parches y Soluciones</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            {cnaContainer.solutions.map((solution, idx) => (
              <Card key={idx} type="inner" size="small" style={{ background: '#f6ffed' }}>
                {solution.lang && (
                  <div style={{ marginBottom: '8px' }}>
                    <Tag>{solution.lang}</Tag>
                  </div>
                )}
                <Paragraph>{solution.value}</Paragraph>
              </Card>
            ))}
          </Space>
          <Divider />
        </>
      )}

      {/* Additional Info */}
      {cveMetadata.assignerOrgName && (
        <>
          <Divider />
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Text type="secondary">
                <strong>Asignador:</strong> {cveMetadata.assignerOrgName}
              </Text>
            </Col>
            {cveMetadata.assignerShortName && (
              <Col xs={24} sm={12}>
                <Text type="secondary">
                  <strong>Código:</strong> {cveMetadata.assignerShortName}
                </Text>
              </Col>
            )}
          </Row>
        </>
      )}
    </Card>
  );
};
