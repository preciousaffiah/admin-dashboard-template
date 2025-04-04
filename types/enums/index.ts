export enum RoleEnum {
  OWNER = "owner",
  MANAGER = "manager",
  STAFF = "staff",
}

export enum DeptEnum {
  ADMIN = "admin",
  WAITER = "waiter",
  BAR = "bar",
}

export enum StaffStatusEnum {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum PaymentStatusEnum {
  PENDING = "pending",
  PAID = "paid",
}

export enum PaymentMetaDataTypeEnum {
  ORDER = "order",
  SUBSCRIPTION = "subscription",
}

export enum OrderStatusEnum {
  PENDING = "pending",
  SERVED = "served",
  CANCELLED = "cancelled",
}

export enum TransactionStatusEnum {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}

export enum OrderDateFilterEnum {
  TODAY = "today",
  YESTERDAY = "yesterday",
  THISWEEK = "thisWeek",
  THISMONTH = "thisMonth",
  THISYEAR = "thisYear",
}

export enum PayoutRequestStatusEnum {
  UNDERREVIEW = "under_review",
  OTPSENT = "otp_sent",
  REQUESTED = "requested",
}

export enum PayoutTypeEnum {
  TRANSACTION = "transaction",
  REQUEST = "request",
}

export enum PayoutStatusEnum {
  PENDING = "pending",
  PROCESSED = "processed",
  DECLINED = "declined",
}

export enum BusinessStatusEnum {
  APPROVED = "approved",
  DECLINED = "declined",
  PENDING = "pending"
}