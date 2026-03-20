import { useQuery } from '@tanstack/react-query';
import { screenshotApi } from '../api/endpoints';

export function useScreenshots(hostname, limit = 20) {
  return useQuery({
    queryKey: ['screenshots', hostname],
    queryFn: () => screenshotApi.getByHostname(hostname, limit),
    enabled: !!hostname,
    refetchInterval: 60000,
    retry: 1,
    staleTime: 30000,
    select: (data) => {
      if (Array.isArray(data)) return { screenshots: data, total: data.length };
      return data;
    },
  });
}
