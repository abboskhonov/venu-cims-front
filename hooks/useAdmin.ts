
'use client'
import { useQuery } from '@tanstack/react-query'
import { getAdminDashboardData, AdminDashboardData } from '@/lib/api/admin'

export function useAdmin() {
  const { data, isLoading, isError } = useQuery<AdminDashboardData>({
    queryKey: ['adminDashboard'],
    queryFn: getAdminDashboardData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  })

  return {
    users: data?.users,
    statistics: data?.statistics,
    isLoading,
    isError,
  }
}
