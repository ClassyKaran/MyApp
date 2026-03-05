import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { employeeApi } from '../api/endpoints';

export const queryKeys = {
  employees: ['employees'],
  employeeSummary: (hostname) => ['summary', hostname],
};

export function useEmployees() {
  return useQuery({
    queryKey: queryKeys.employees,
    queryFn: employeeApi.getAll,
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to fetch employees');
    },
  });
}
