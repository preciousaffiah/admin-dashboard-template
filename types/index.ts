export type TAppUser = {
  id: string;
  fullname: string;
  email: string;
  subscriptionPlan: string;
  businessId: string | null;
  role: string | null;
  department: string | null;
};

export type TAppUserState = {
  token: string;
  userData: TAppUser;
};

export type BDetails = {
  name?: string;
  id?: string;
  email?: string;
};

interface MenuItem {
  itemImage: string;
  name: string;
  quantity: number;
  price: number;
}

interface AssignedTo {
  staffImage: string;
  name: string;
}

export type Invoice = {
  OrderID: number;
  Customer: string;
  TableNo: string;
  MenuItems: MenuItem[];
  AssignedTo?: AssignedTo[];
  Price: number;
  Discount: number;
  amountPaid: number;
  TimeofOrder: string;
  Status: string;
};

export type Menus = {
  // value?: string;
  _id: number;
  price: number;
  category: string;
  description: string;
  image: string;
  name: string;
  discount: string;
  department: string;
};

export type User = {
  UserId: number;
  Name: string;
  Email: string;
  userImage: string;
  Phone: string;
  Department: string;
  Date: string;
  Status: string;
  Requests: number;
  Completed: number;
  Sales: number;
};

export type AdminTable = {
  children?: any;
  view?: any;
  grid?: any;
  invoiceData?: any;
  isLoading?: boolean;
  handleRowClick: any;
  tabKey: any;
  setIsOpen?: any;
  setSelectedInvoice?: any;
  selectedInvoice?: any;
  tabHeaders?: {};
  tableHeaders?: any;
  currentPage: number;
  setCurrentPage?: any;
  getPageNumbers?: any;
  handlePageChange?: any;
  className?: any;
};

export type OrderMenuItem = {
  MenuId: string;
  Name: string;
  quantity: number;
  Price: number;
};

export type OrderItems = {
  fname: string;
  lname: string;
  phone: string;
  orderType: string;
  location?: string;
  orderTime?: string;
  tableNumber?: string;
  handlingDepartment: string[];
  orderItems: OrderMenuItem[];
};

export type createMenu = {
  price: number;
  category: string | null;
  description: string;
  image: string;
  name: string;
  department: string | null;
  businessId: string | null;
};