import { useQuery } from '@tanstack/react-query';
import { CVEData } from '../domain/types';
import { fetchCVEData } from '../proxy/cveProxy';

/**
 * Hook para obtener datos de CVE
 * @param cveId - CVE ID string (format: CVE-YYYY-XXXXX)
 * @returns Query state with data, isPending, error, and other React Query utilities
 */
export const useCVEData = (cveId: string) => {
  return useQuery<CVEData, Error>({
    queryKey: ['cve', cveId],
    queryFn: ({ signal }) => fetchCVEData(cveId, signal),
    enabled: Boolean(cveId),
    staleTime: 1000 * 60 * 60, // 1 hora
    gcTime: 1000 * 60 * 60 * 24, // 24 horas
  });
};
