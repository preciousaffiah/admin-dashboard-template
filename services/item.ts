import { axiosWithToken, axiosWithoutToken } from "@/utils/axios";

class ItemsService {
  addItem(payload: {
    name: string;
    category: string;
    price: string;
    department: string;
    image: string;
    businessId?: string;
    description: string;
  }) {
    return axiosWithToken().post("/item", {
      ...payload,
    });
  }

  updateItem(
    itemId: string,
    payload: {
      category?: string;
      businessId?: string;
      price?: string;
      discount?: string;
      department?: string;
      description?: string;
      image?: string;
    }
  ) {
    const filteredData = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined)
    );

    return axiosWithToken().put(`/item/update-item/${itemId}`, {
      ...filteredData,
    });
  }

  deleteItem(itemId: string, businessId: string) {
    console.log(itemId, businessId);
    
    return axiosWithToken().delete(`/item/delete-item/${itemId}/${businessId}`);
  }

  // getItem(businessId: string, filters: { name?: string, _id?: string }) {
  //   return axiosWithoutToken.get(`/item/${businessId}`, {
  //     params: {
  //       businessId,
  //      ...filters
  //     },
  //   });
  // }

  getItems(
    businessId: string,
    page: number,
    filters?: {
      name?: string;
      _id?: string;
      category?: string;
      department?: string;
    }
  ) {
    return axiosWithoutToken.get(`/item/all-items/${businessId}`, {
      params: {
        page,
        ...filters,
      },
    });
  }
}

const ItemService = new ItemsService();
export default ItemService;
