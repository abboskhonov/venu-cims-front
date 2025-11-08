import { api } from "../instance";

export const getSalesDashboard = async (search: string = "", status: string = "") => {
  const response = await api.get("/crm/dashboard", {
    params: {
      search,
      status_filter: status,
    },
  });
  return response.data;
};

export const getLatestCustomers = async (limit: number = 50) => {
  const response = await api.get("/crm/customers/latest", {
    params: {
      limit,
    },
  });
  return response.data;
};

// Get customers with multiple filters
export const getCustomersWithFilters = async (filters: {
  search?: string;
  status?: string;
  platform?: string;
  date?: string;
} = {}) => {
  const response = await api.get("/crm/customers", {
    params: filters,
  });
  return response.data;
};

export const createCustomer = async (customerData: FormData) => {
  const response = await api.post("/crm/customers", customerData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateCustomer = async (id: number, customerData: FormData) => {
  const response = await api.patch(`/crm/customers/${id}`, customerData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteCustomer = async (id: number) => {
  const response = await api.delete(`/crm/customers/${id}`);
  return response.data;
};

export const getCrmStats = async () => {
  const response = await api.get("/crm/stats");
  return response.data;
};