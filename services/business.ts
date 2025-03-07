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

  createTables(payload: { businessId: string; tableQuantity: number }) {
    return axiosWithToken().post("/business/tables/create", {
      ...payload,
    });
  }

  addTables(payload: { businessId: string; tableQuantity: number }) {
    return axiosWithToken().post("/business/tables/add", {
      ...payload,
    });
  }

  getTable(businessId: string, tableNumber: number) {
    return axiosWithToken().get(
      `/business/tables/${businessId}/${tableNumber}`
    );
  }
}

const BusService = new BusinessService();
export default BusService;
