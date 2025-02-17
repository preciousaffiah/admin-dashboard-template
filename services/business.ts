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

  login(payload: { email: string; password: string; restaurantId?: string }) {
    return axiosWithoutToken.post("/auth/login", {
      ...payload,
    });
  }
}

const BusService = new BusinessService();
export default BusService;
