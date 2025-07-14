import axios from "axios";

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
