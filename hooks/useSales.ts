import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getLatestCustomers, 
  getCustomersWithFilters,
  createCustomer, 
  updateCustomer, 
  deleteCustomer, 
  getCrmStats 
} from "@/lib/api/sales";

interface UpdateCustomerPayload {
  id: number;
  data: FormData;
}

export const useSales = (
  search: string = "", 
  status: string = "all", 
  platform: string = "all",
  date: string = ""
) => {
  const queryClient = useQueryClient();
  
  // Determine if we should use filters
  const hasFilters = search !== "" || (status !== "all" && status !== "") || (platform !== "all" && platform !== "") || date !== "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["sales", search, status, platform, date],
    queryFn: async () => {
      if (hasFilters) {
        const filters: Record<string, string> = {};
        
        if (search) filters.search = search;
        if (status !== "all" && status !== "") filters.status = status;
        if (platform !== "all" && platform !== "") filters.platform = platform;
        if (date) filters.date = date;
        
        const customersData = await getCustomersWithFilters(filters);
        return {
          customers: Array.isArray(customersData) ? customersData : customersData?.customers || [],
          status_choices: customersData?.status_choices || [],
        };
      } else {
        const customersData = await getLatestCustomers();
        return {
          customers: Array.isArray(customersData) ? customersData : customersData?.customers || [],
          status_choices: [],
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