import { axiosWithToken } from "@/utils/axios";

class StaffsService {
  addStaff(payload: {
    email: string;
    fullname: string;
    phone: string;
    password: string;
    image: string;
    department: string;
    businessId: string;
  }) {
    return axiosWithToken().post("/staff", {
      ...payload,
    });
  }

  updateStaff(
    staffId: string,
    payload: {
      fullname?: string;
      phone?: string;
      image?: string;
      department?: string;
      status?: string;
      businessId: string;
    }
  ) {
    const filteredData = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined)
    );

    return axiosWithToken().put(`/staff/update-staff/${staffId}`, {
      filteredData,
    });
  }

  // getStaff(businessId: string, filters: { email?: string; _id?: string }) {
  //   return axiosWithToken().get(`/staff/${businessId}`, {
  //     params: {
  //       businessId,
  //       ...filters,
  //     },
  //   });
  // }

  getAllStaff(
    businessId: string,
    page: number,
    filters: { department?: string; status?: string; fullname?: string }
  ) {

    return axiosWithToken().get(`/staff/all-staffs/${businessId}`, {
      params: {
        page,
        ...filters,
      },
    });
  }
}

const StaffService = new StaffsService();
export default StaffService;
