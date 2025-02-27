import { axiosWithToken, axiosWithoutToken } from "@/utils/axios";

class ItemsService {
  addItem(payload: {
    name: string;
    category: string;
    price: string;
    department: string;
    image: string;
    businessId: string;
    description: string;
  }) {
    return axiosWithToken().post("/item", {
      ...payload,
    });
  }

  getItem(businessId: string, name?: string, id?: string) {
    return axiosWithoutToken.get(`/item/${businessId}`, {
      params: {
        businessId,
        name,
        _id:id,
      },
    });
  }


  getItems(businessId: string, name?: string, id?: string, category?: string, department?: string) {
    return axiosWithoutToken.get(`/item/all-items/${businessId}`, {
      params: {
        businessId,
        name,
        _id:id,
        category,
        department
      },
    });
  }
}

const ItemService = new ItemsService();
export default ItemService;
