import { axiosWithToken } from "@/utils/axios";

class OrderTransactionsService {
  getOrderTransactions(
    businessId: string,
    page: number,
    filters: {
      dateFilter?: string;
      status?: string;
    }
  ) {
    const filteredData = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => value !== "" && value !== "all"
      )
    );

    return axiosWithToken().get(`/order-transaction/business/${businessId}`, {
      params: {
        page,
        ...filteredData,
      },
    });
  }
}

const OrderTransService = new OrderTransactionsService();
export default OrderTransService;
