export type TAppUser = {
  id: string; 
};

export type TAppUserState = {
  token: string;
  user: TAppUser;
};

interface MenuItem {
  mealImage: string;
  name: string;
  quantity: number;
  price: number;
}

export type Invoice = {
  OrderID: number;
  Customer: string;
  TableNo: string;
  MenuItems: MenuItem[];
  Price: number;
  Discount: number,
  amountPaid: number,
  TimeofOrder: string;
  Status: string;
}
