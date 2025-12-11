import React from 'react';
import { Skeleton as AntSkeleton, Card, Row, Col } from 'antd';

/**
 * CVESummary Skeleton Loader
 *
 * Componente de carga que muestra un esqueleto mientras se carga
 * la información del CVE. Utiliza Ant Design Skeleton para una
 * animación fluida y nativa.
 */
export const CVESummarySkeleton: React.FC = () => {
  return (
    <Card data-testid="cve-summary-skeleton" style={{ width: '100%' }}>
      {/* CVE ID and severity tag */}
      <Row gutter={[16, 16]} align="middle">
        <Col flex="auto">
          <AntSkeleton active paragraph={{ rows: 1 }} />
        </Col>
        <Col>
          <AntSkeleton.Button active style={{ width: '80px', height: '24px' }} />
        </Col>
      </Row>

      {/* Title */}
      <AntSkeleton active paragraph={{ rows: 1 }} style={{ marginTop: '16px' }} />

      {/* Description */}
      <AntSkeleton active paragraph={{ rows: 3 }} style={{ marginTop: '16px' }} />

      {/* CVSS and Dates Row */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} sm={12}>
          <Card type="inner" style={{ background: '#fafafa' }}>
            <AntSkeleton active paragraph={{ rows: 2 }} />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card type="inner" style={{ background: '#fafafa' }}>
            <AntSkeleton active paragraph={{ rows: 2 }} />
          </Card>
        </Col>
      </Row>

      {/* Affected Products */}
      <AntSkeleton active paragraph={{ rows: 1 }} style={{ marginTop: '16px' }} />
      <Row gutter={[8, 8]} style={{ marginTop: '12px' }}>
        {[1, 2, 3].map((i) => (
          <Col key={i} xs={24} sm={12} md={8}>
            <Card type="inner" style={{ background: '#f0f5ff' }}>
              <AntSkeleton active paragraph={{ rows: 1 }} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* References */}
      <AntSkeleton active paragraph={{ rows: 3 }} style={{ marginTop: '16px' }} />
    </Card>
  );
};
