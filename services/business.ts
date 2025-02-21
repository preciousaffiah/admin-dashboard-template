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
}

const BusService = new BusinessService();
export default BusService;
