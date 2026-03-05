import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { employeeApi } from '../api/endpoints';
import { queryKeys } from './useEmployees';

export function useEmployeeSummary(hostname) {
  return useQuery({
    queryKey: queryKeys.employeeSummary(hostname),
    queryFn: () => employeeApi.getSummary(hostname),
    enabled: !!hostname,
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to fetch employee summary');
    },
  });
}
