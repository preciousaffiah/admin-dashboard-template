import { axiosWithToken } from "@/utils/axios";

class StaffsService {
  addStaff(payload: {
    email: string;
    fullname: string;
    password: string;
    image: string;
    department: string;
    businessId: string;
  }) {
    return axiosWithToken().post("/staff", {
      ...payload,
    });
  }

  getStaff(businessId: string, filters: {  email?: string, _id?: string}) {
    return axiosWithToken().get(`/staff/${businessId}`, {
      params: {
        businessId,
       ...filters
      },
    });
  }

  getAllStaff(businessId: string, filters: { department?: string, isActive?: string, fullname?: string}) {
    return axiosWithToken().get(`/staff/all-staff/${businessId}`, {
      params: {
        businessId,
       ...filters
      },
    });
  }
}

const StaffService = new StaffsService();
export default StaffService;
