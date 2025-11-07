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

// NEW: Get customers filtered by status
export const getCustomersByStatus = async (status: string) => {
  const response = await api.get("/crm/customers/filter/status", {
    params: {
      status,
    },
  });
  return response.data;
};

// NEW: Get customers filtered by platform
export const getCustomersByPlatform = async (platform: string) => {
  const response = await api.get("/crm/customers/filter/platform", {
    params: {
      platform,
    },
  });
  return response.data;
};

// NEW: Get customers filtered by date
export const getCustomersByDate = async (date: string) => {
  const response = await api.get("/crm/customers/filter/date", {
    params: {
      date,
    },
  });
  return response.data;
};

// NEW: Get customers with multiple filters
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

export const getCustomerById = async (id: number) => {
  const response = await api.get(`/crm/customers/${id}`);
  return response.data;
};

export const bulkDeleteCustomers = async (ids: number[]) => {
  const response = await api.post("/crm/customers/bulk-delete", {
    ids,
  });
  return response.data;
};

export const updateCustomerStatus = async (id: number, status: string) => {
  const response = await api.patch(`/crm/customers/${id}/status`, {
    status,
  });
  return response.data;
};

export const getCrmStats = async () => {
  const response = await api.get("/crm/stats");
  return response.data;
};

export const getCustomerStatistics = async () => {
  const response = await api.get("/crm/customers/statistics");
  return response.data;
};

export const exportCustomers = async (format: "csv" | "xlsx" = "csv", filters?: { search?: string; status?: string }) => {
  const response = await api.get("/crm/customers/export", {
    params: {
      format,
      ...filters,
    },
    responseType: "blob",
  });
  return response.data;
};

export const importCustomers = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/crm/customers/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const searchCustomers = async (query: string, limit: number = 10) => {
  const response = await api.get("/crm/customers/search", {
    params: {
      query,
      limit,
    },
  });
  return response.data;
};

export const getCustomerActivities = async (id: number) => {
  const response = await api.get(`/crm/customers/${id}/activities`);
  return response.data;
};

export const addCustomerNote = async (id: number, note: string) => {
  const response = await api.post(`/crm/customers/${id}/notes`, {
    note,
  });
  return response.data;
};

export const updateCustomerNote = async (customerId: number, noteId: string, note: string) => {
  const response = await api.patch(`/crm/customers/${customerId}/notes/${noteId}`, {
    note,
  });
  return response.data;
};

export const deleteCustomerNote = async (customerId: number, noteId: string) => {
  const response = await api.delete(`/crm/customers/${customerId}/notes/${noteId}`);
  return response.data;
};