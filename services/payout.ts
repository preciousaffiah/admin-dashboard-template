import { axiosWithToken } from "@/utils/axios";

class PayoutService {
  requestPayout(payload: { businessId: string; otp?: string }) {
    const filteredData = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== "" )
    );

    return axiosWithToken().post("/payout/request", {
      ...filteredData,
    });
  }

  getPayouts(
    businessId: string,
    page: number,
    filters: {
      dateFilter?: string;
    }
  ) {
    const filteredData = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => value !== "" && value !== "all"
      )
    );

    return axiosWithToken().get(`/payout/history/${businessId}`, {
      params: {
        page,
        ...filteredData,
      },
    });
  }
}

const PayoutsService = new PayoutService();
export default PayoutsService;
