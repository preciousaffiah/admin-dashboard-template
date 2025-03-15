import { OrderDateFilterEnum } from "@/types/enums";
import { axiosWithToken, axiosWithoutToken } from "@/utils/axios";

interface OrderItem {
  itemId: string;
  quantity: number;
  price: number;
}

interface OrderItemUpdate {
  itemId: string;
  quantity: number;
}

class OrdersService {
  createOrder(payload: {
    businessId: string;
    tableId: string;
    items: OrderItem[];
  }) {
    return axiosWithToken().post("/order", {
      ...payload,
    });
  }

  getOrders(
    businessId: string,
    page: number,
    filters: {
      status?: string;
      paymentStatus?: string;
      dateFilter?: string;
    }
  ) {

    const filteredData = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => (value !== "" && value !== "all"))
    );

    return axiosWithToken().get(`/order/all-orders/${businessId}`, {
      params: {
        page,
        ...filteredData,
      },
    });
  }

  getTableOrder(businessId: string, tableId: string) {
    return axiosWithoutToken.get(`/order/${businessId}/${tableId}`);
  }

  updateOrder(
    orderId: string,
    payload: {
      status?: string;
      itemData?: OrderItemUpdate[];
    }
  ) {
    const filteredData = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined)
    );

    return axiosWithToken().put(`/order/update/${orderId}`, {
      ...filteredData,
    });
  }

  updateOrderItems(
    orderId: string,
    payload: {
      itemData: OrderItem[];
    }
  ) {
    return axiosWithToken().put(`/order/update-item-order/${orderId}`, {
      ...payload,
    });
  }
}

const OrderService = new OrdersService();
export default OrderService;
