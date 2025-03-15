export enum RoleEnum {
  OWNER = "owner",
  MANAGER = "manager",
  STAFF = "staff",
}

export enum DeptEnum {
  ADMIN = "admin",
  WAITER = "waiter", 
  BAR = "bar"
}

export enum StaffStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum PaymentStatusEnum {
  PENDING = "pending",
  PAID = "paid",
}

export enum OrderStatusEnum {
  PENDING = "pending",
  SERVED = "served",
  CANCELLED = "cancelled",
}


export enum OrderDateFilterEnum {
  TODAY = "today",
  YESTERDAY = "yesterday",
  THISWEEK = "thisWeek",
  THISMONTH = "thisMonth",
  THISYEAR = "thisYear",
}