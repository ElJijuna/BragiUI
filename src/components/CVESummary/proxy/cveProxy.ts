import { CVEData, ParsedCVEId } from '../domain/types';

/**
 * Parse CVE ID string and extract year and number
 * @param cveId - CVE ID string (format: CVE-YYYY-XXXXX)
 * @returns Parsed CVE ID with year, number, and prefix
 * @throws Error if format is invalid
 */
export const parseCVEId = (cveId: string): ParsedCVEId => {
  const match = cveId.match(/CVE-(\d{4})-(\d+)/);
  if (!match) {
    throw new Error('Invalid CVE format. Use CVE-YYYY-XXXXX');
  }

  const year = match[1];
  const number = match[2];
  const numberPrefix = number.substring(0, 2) + 'xxx';

  return { year, number, prefix: numberPrefix };
};

/**
 * Construct GitHub URL for CVE data
 * @param cveId - CVE ID string (format: CVE-YYYY-XXXXX)
 * @returns URL to fetch CVE data from GitHub
 */
export const constructCVEUrl = (cveId: string): string => {
  const { year, prefix } = parseCVEId(cveId);
  return `https://raw.githubusercontent.com/CVEProject/cvelistV5/refs/heads/main/cves/${year}/${prefix}/${cveId}.json`;
};

/**
 * Fetch CVE data from GitHub
 * @param cveId - CVE ID string (format: CVE-YYYY-XXXXX)
 * @param signal - AbortSignal for request cancellation
 * @returns Promise with CVE data
 * @throws Error if fetch fails or response is invalid
 */
export const fetchCVEData = async (cveId: string, signal?: AbortSignal): Promise<CVEData> => {
  const url = constructCVEUrl(cveId);

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch CVE data: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Debug: Log la estructura del JSON en consola
  console.log(`📊 CVE Data for ${cveId}:`, {
    containers: data.containers ? Object.keys(data.containers) : 'NO containers',
    cnaKeys: data.containers?.cna ? Object.keys(data.containers.cna) : 'NO cna',
    adpKeys: data.containers?.adp ? Object.keys(data.containers.adp?.[0] || {}) : 'NO adp',
    fullData: data,
  });
  
  return data as CVEData;
};
