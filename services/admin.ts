import { axiosWithToken, axiosWithoutToken } from "@/utils/axios";

class AdminsService {
  login(payload: { email: string; password: string }) {
    return axiosWithoutToken.post("/admin/auth/login", {
      ...payload,
    });
  }

  getDashboardStats(dateFilter?: string) {
    return axiosWithToken().get(`/admin/general-stats`, {
      params: {
        dateFilter,
      },
    });
  }

  getTotalStats() {
    return axiosWithToken().get(`/admin/stats-count`, {});
  }

  getAllBusinesses(page: number) {
    return axiosWithToken().get(`/admin/businesses`, {
      params: {
        page,
      },
    });
  }

  getBusinessRequests(page: number, dateFilter?: string) {
    return axiosWithToken().get(`/admin/requests/business`, {
      params: {
        page,
        dateFilter,
      },
    });
  }

  getAllUsers(page: number) {
    return axiosWithToken().get(`/admin/users`, {
      params: {
        page,
      },
    });
  }

  getPayoutRequets(page: number, dateFilter?: string) {
    return axiosWithToken().get(`/admin/requests/payout`, {
      params: {
        page,
        dateFilter,
      },
    });
  }

  updateBusinessStatus(businessId: string, status: string) {
    return axiosWithToken().put(`/admin/business/${businessId}`, {
      status,
    });
  }

  updatePayoutStatus(payoutId: string, status: string) {
    return axiosWithToken().put(`/admin/payout/${payoutId}`, {
      status,
    });
  }
}

const AdminService = new AdminsService();
export default AdminService;
