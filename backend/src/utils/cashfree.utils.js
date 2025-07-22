import axios from "axios";
import { CASHFREE_BASE_URL } from "./constants.js";

const baseURL = process.env.CASHFREE_BASE_URL;

// 🔐 Get Access Token
export const getCashfreeToken = async () => {
  const response = await axios.post(`${baseURL}/oauth/token`, {
    client_id: process.env.CASHFREE_CLIENT_ID,
    client_secret: process.env.CASHFREE_CLIENT_SECRET,
    grant_type: "client_credentials",
  });
  return response.data.access_token;
};

// 🧾 Create Order
export const createCashfreeOrder = async ({
  orderId,
  orderAmount,
  customerDetails,
}) => {
  const token = await getCashfreeToken();

  const orderPayload = {
    order_id: orderId,
    order_amount: orderAmount,
    order_currency: "INR",
    customer_details: customerDetails,
    order_meta: {
      return_url: `${process.env.CASHFREE_RETURN_URL}?order_id={order_id}`,
    },
  };

  const res = await axios.post(`${baseURL}/orders`, orderPayload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return res.data;
};

const getBaseUrl = () => {
  process.env.CASHFREE_BASE_URL === "production"
    ? CASHFREE_BASE_URL.production
    : CASHFREE_BASE_URL.sandbox;
};

export const createCashfreePaymentLink = async ({
  orderId,
  amount,
  customerName,
  customerEmail,
  customerPhone,
}) => {
  const url = `${getBaseUrl()}/pg/links`;

  const headers = {
    "x-client-id": process.env.CASHFREE_APP_ID,
    "x-client-secret": process.env.CASHFREE_SECRET_KEY,
    "Content-Type": "application/json",
  };

  const data = {
    customer_details: {
      customer_id: orderId,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      customer_name: customerName,
    },
    link_notify: {
      send_sms: true,
      send_email: true,
    },
    link_meta: {
      return_url: `https://yourdomain.com/payment/success?order_id=${orderId}`,
      notify_url: `https://7d875ccf9482.ngrok-free.app/api/v1/payments/webhook`,
    },
    link_id: orderId,
    link_amount: amount,
    link_currency: "INR",
    link_purpose: "Book Purchase",
  };

  const response = await axios.post(url, data, { headers });
  return response.data;
};
