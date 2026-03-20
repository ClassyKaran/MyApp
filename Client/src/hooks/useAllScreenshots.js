import { useQuery } from '@tanstack/react-query';
import { screenshotApi } from '../api/endpoints';

export function useAllScreenshots(limit = 100) {
  return useQuery({
    queryKey: ['screenshots', 'all', limit],
    queryFn: () => screenshotApi.getAll(limit),
    refetchInterval: 60000,
    retry: 1,
    staleTime: 30000,
  });
}