// Domain interfaces and types for CVE data
export interface CVEAffected {
  product: string;
  vendor?: string;
  versions?: Array<{
    version: string;
    lessThan?: string;
    lessThanOrEqual?: string;
    status: string;
  }>;
  cpes?: string[];
  defaultStatus?: string;
}

export interface CVEReference {
  url: string;
  name?: string;
  tags?: string[];
}

export interface CVECredit {
  lang: string;
  value: string;
}

export interface CVEDescription {
  lang?: string;
  value: string;
  supportingMedia?: Array<{
    type: string;
    value: string;
    base64?: boolean;
  }>;
}

export interface CVSSv31Metric {
  baseScore: number;
  baseSeverity: string;
  vectorString?: string;
  attackVector?: string;
  attackComplexity?: string;
  privilegesRequired?: string;
  userInteraction?: string;
  scope?: string;
  confidentialityImpact?: string;
  integrityImpact?: string;
  availabilityImpact?: string;
  version?: string;
}

export interface CVEMetric {
  cvssV3_1?: CVSSv31Metric;
  format?: string;
  scenarios?: Array<{
    lang?: string;
    value?: string;
  }>;
}

export interface ProblemType {
  descriptions?: Array<{
    lang?: string;
    value?: string;
    cweId?: string;
    type?: string;
  }>;
}

export interface CVESolution {
  lang?: string;
  value: string;
  supportingMedia?: Array<{
    type: string;
    value: string;
    base64?: boolean;
  }>;
}

export interface CVEProviderMetadata {
  orgId: string;
  shortName: string;
  dateUpdated?: string;
}

export interface CVEADPContainer {
  providerMetadata?: CVEProviderMetadata;
  title?: string;
  metrics?: CVEMetric[];
}

export interface CVECNAContainer {
  title?: string;
  descriptions?: CVEDescription[];
  affected?: CVEAffected[];
  references?: CVEReference[];
  credits?: CVECredit[];
  problemTypes?: ProblemType[];
  solutions?: CVESolution[];
  metrics?: CVEMetric[];
  providerMetadata?: CVEProviderMetadata;
  source?: {
    discovery?: string;
  };
}

export interface CVEMetadata {
  cveId: string;
  assignerOrgName: string;
  assignerShortName: string;
  dateReserved: string;
  datePublished: string;
  dateUpdated: string;
}

export interface CVEContainers {
  cna?: CVECNAContainer;
  adp?: CVEADPContainer[];
}

export interface CVEData {
  cveMetadata: CVEMetadata;
  containers: CVEContainers;
}

export interface CVESummaryProps {
  cve: string;
}

export interface ParsedCVEId {
  year: string;
  number: string;
  prefix: string;
}
