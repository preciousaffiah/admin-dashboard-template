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

  getStaff(businessId: string, email?: string, id?: string) {
    return axiosWithToken().get(`/staff/${businessId}`, {
      params: {
        businessId,
        email,
        _id:id,
      },
    });
  }

  getAllStaff(businessId: string, department?: string, isActive?: string, fullname?: string) {
    return axiosWithToken().get(`/staff/all-staff/${businessId}`, {
      params: {
        businessId,
        department,
        isActive,
        fullname
      },
    });
  }
}

const StaffService = new StaffsService();
export default StaffService;
