import { axiosWithToken, axiosWithoutToken } from "@/utils/axios";

class BusinessService {
  registerBusiness(payload: {
    name: string;
    address: string;
    phone: string;
    email: string;
    role: string;
    type: string;
    country: string;
    cac: string;
  }) {
    return axiosWithToken().post("/business/register", {
      ...payload,
    });
  }

  getBusinessStats(businessId: string, dateFilter?: string) {
    
    return axiosWithToken().get(`/business/statistics/${businessId}`, {
      params: {
        dateFilter,
      },
    });
  }

  getBusinessByNameOrIdOrEmailWithoutAuth(
    name?: string,
    email?: string,
    id?: string
  ) {
    return axiosWithoutToken.get("/business/general", {
      params: {
        name,
        email,
        _id: id,
      },
    });
  }

  getBusinessByNameOrIdOrEmail(name?: string, email?: string, id?: string) {
    return axiosWithToken().get("/business", {
      params: {
        name,
        email,
        _id: id,
      },
    });
  }

  updateBusiness(
    businessId: string,
    payload: {
      accountNumber?: string;
      accountName?: string;
      bankName?: string;
      menuCategories?: string[];
    }
  ) {
    const filteredData = Object.fromEntries(
      Object.entries(payload).filter(
        ([_, value]) => value !== "" && value !== undefined
      )
    );

    return axiosWithToken().put("/business/update", {
      businessId,
      ...filteredData,
    });
  }

  createTables(payload: { businessId: string; tableQuantity: string }) {
    return axiosWithToken().post("/business/tables/create", {
      ...payload,
    });
  }

  updateTable(payload: {
    tableId: string;
    businessId: string;
    tableNumber: string;
    status: string;
  }) {
    return axiosWithToken().put(`/business/table/update`, {
      ...payload,
    });
  }

  addTables(payload: { businessId: string; tableQuantity: number }) {
    return axiosWithToken().post("/business/tables/add", {
      ...payload,
    });
  }

  getTable(businessId: string, tableNumber: number) {
    return axiosWithToken().get(`/business/table/${businessId}/${tableNumber}`);
  }

  getAllTables(
    businessId: string,
    page: number,
    filters: {
      status?: string;
    }
  ) {
    const filteredData = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => value !== "" && value !== "all"
      )
    );

    return axiosWithToken().get(`/business/tables/${businessId}`, {
      params: {
        page,
        ...filteredData,
      },
    });
  }
}

const BusService = new BusinessService();
export default BusService;
