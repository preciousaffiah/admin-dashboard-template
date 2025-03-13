import { axiosWithToken, axiosWithoutToken } from "@/utils/axios";

interface OrderItem {
  itemId: string;
  quantity: number;
  price: number;
}

class OrdersService {
  createOrder(payload: {
    businessId: string;
    tableId: string;
    items: OrderItem[];
  }) {
    console.log("service", payload);

    return axiosWithToken().post("/order", {
      ...payload,
    });
  }

  getOrders(
    businessId: string,
    page: number,
    filters?: {
      status?: string;
      paymentStatus?: string;
    }
  ) {
    return axiosWithToken().get(`/order/all-orders/${businessId}`, {
      params: {
        page,
        ...filters,
      },
    });
  }

  getTableOrder(businessId: string, tableId: string) {
    return axiosWithoutToken.get(`/order/${businessId}/${tableId}`);
  }
}

const OrderService = new OrdersService();
export default OrderService;
