// if we want the key then we use UserRoleEnum
export const UserRoleEnum = {
  ADMIN: "admin",
  USER: "user",
};
// if we want the whole array then we can use AvailableUserRoles
// so we have to export both values
export const AvailableUserRoles = Object.values(UserRoleEnum);

// constants.js

// Order Status Constants
export const ORDER_STATUS = {
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

// Payment Methods
export const PAYMENT_METHODS = {
  UPI: "UPI",
  CARD: "CARD",
  COD: "CASH_ON_DELIVERY",
  NET_BANKING: "NET_BANKING",
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
};

// Refund Status
export const REFUND_STATUS = {
  NOT_REQUESTED: "not_requested",
  REQUESTED: "requested",
  COMPLETED: " completed",
};
