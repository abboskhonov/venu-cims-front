import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSalesDashboard, getLatestCustomers, createCustomer, updateCustomer, deleteCustomer, getCrmStats } from "@/lib/api/sales";

interface UpdateCustomerPayload {
  id: number;
  data: FormData;
}

export const useSales = (search: string = "", status: string = "") => {
  const queryClient = useQueryClient();
  const queryStatus = status === "all" ? "" : status;
  const shouldUseDashboard = search !== "" || queryStatus !== "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["sales", search, queryStatus],
    queryFn: async () => {
      if (shouldUseDashboard) {
        const dashboardData = await getSalesDashboard(search, queryStatus);
        return {
          customers: dashboardData?.customers || [],
          status_choices: dashboardData?.status_choices || [],  
          period_stats: dashboardData?.period_stats,
        };
      } else {
        const customersData = await getLatestCustomers();
        return {
          customers: Array.isArray(customersData) ? customersData : customersData?.customers || [],
          status_choices: [],
          period_stats: {},
        };
      }
    },
    enabled: true,
  });

  // Fetch CRM stats
  const { data: crmStats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["crm-stats"],
    queryFn: getCrmStats,
  });

  const { mutate: createCustomerMutation, isPending: isCreating } = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["crm-stats"] });
    },
  });

  const { mutate: updateCustomerMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: UpdateCustomerPayload) => updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["crm-stats"] });
    },
  });

  const { mutate: deleteCustomerMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["crm-stats"] });
    },
  });

  return {
    data: data || { customers: [], status_choices: [] },
    isLoading,
    isError,
    crmStats,
    isStatsLoading,
    createCustomer: createCustomerMutation,
    isCreating,
    updateCustomer: updateCustomerMutation,
    isUpdating,
    deleteCustomer: deleteCustomerMutation,
    isDeleting,
  };
};