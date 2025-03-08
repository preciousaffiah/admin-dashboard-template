export type TAppUser = {
  user_id: string;
  fullname: string;
  email: string;
  subscriptionPlan: string;
  businessId: string | null;
  role: string | null;
  department: string | null;
  image: string | null;
};

export type TAppUserState = {
  token: string;
  userData: TAppUser;
};

export type SDetails = {
  staffId: string;
  // fullname?: string;
  // phone?: string;
  // image?: string;
  // department?: string;
  status?: string;
  businessId: string;
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
  _id: string;
  price: number;
  category: string;
  description: string;
  image: string;
  name: string;
  discount: number;
  department: string;
};

export type TablesType = {
  _id: string;
  tableNumber: string;
  status: string;
  image: string;
};

export type User = {
  _id: string;
  fullname: string;
  email: string;
  image: string;
  phone: string;
  department: string;
  Date: string;
  status: string;
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
  handleRowClick?: any;
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
  success?: boolean;
  setSuccess?: any;
  businessId?: string
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

export type settings = {
  tableQuantity: number;
  image: string;
  tableNumber: number;
  businessId: string;
};