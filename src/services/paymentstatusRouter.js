import axios from "axios";
import { API_URL, getAuthorized } from "../utils/urls";
import { data } from "react-router-dom";

export const addpaymentstatus = async (paymentstatusdata) => {
  const { data } = await axios.post(`${API_URL}/paymentstatus/add`, paymentstatusdata, getAuthorized());
  return data;
};

export const editpaymentstatus = async (id, paymentstatusdata) => {
  const { data } = await axios.put(`${API_URL}/paymentstatus/edit/${id}`, paymentstatusdata, getAuthorized());
  return data;
};

export const getpaymentstatus = async (customerId) => {
  const response = await axios.get(`${API_URL}/paymentstatus/${customerId}`, getAuthorized());
  console.log("response",response.data)
  return response.data;
  
};
export const getallpaymentstatus = async () => {
  const {data} = await axios.get(`${API_URL}/paymentstatus/get-all`, getAuthorized());
  return data;
};
export const getCustomerPayments = async ({customerId}) => {
  const { data } = await axios.get(`${API_URL}/payment/get-customerPayments/${customerId}`, getAuthorized());
  return data;
}

export const getpaymentDetails = async (productId) => {
  const query = productId ? `?productId=${productId}` : "";
  const { data } = await axios.get(
    `${API_URL}/payment/get-details${query}`,
    getAuthorized()
  );
  return data;
};
export const getpaymentDetailsed = async ({ startDate, endDate }) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const { data } = await axios.get(`${API_URL}/payment/get-detailsed?${params.toString()}`, getAuthorized());    
    return data;
};

export const makeAPayment = async () => {
  const { data } = await axios.post(`${API_URL}/payment/makeAPayment`, getAuthorized());
  return data;
}

export const deleteAPayment = async () => {
  const { data } = await axios.delete(`${API_URL}/payment/deleteAPayment`, getAuthorized());
  return data;
}

export const updateAPayment = async () => {
  const { data } = await axios.put(`${API_URL}/payment/updateAPayment`, getAuthorized());
  return data;
}

export const getProductPaymentDetails = async ({ startDate, endDate, agentId }) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (agentId) params.append("agentId", agentId);

    const { data } = await axios.get(`${API_URL}/payment/get-ProductDetails?${params.toString()}`, getAuthorized());
    return data;
};

export const getProducts = async () => {
  const { data } = await axios.get(`${API_URL}/payment/get-product`, getAuthorized());
  
  return data;
}; 

export const getCustomers = async ({productId}) => {
  const { data } = await axios.get(`${API_URL}/customers/get-customer/${productId}`, getAuthorized());
  return data;
};


export const getTransactions = async (customerId) => {
  const { data } = await axios.get(`${API_URL}/payment/get-transactions/${customerId}`, getAuthorized())
  return data
}

export const addPayment = async(payload) => {
  try{
      const {data} = await axios.post(`${API_URL}/payment/addPayment`, payload, getAuthorized());
      console.log("payments", data)
      return data
  } catch(error) {
    console.log(error);
    throw error;  
  };  
}

export const getGst = async () => {
  const data = await axios.get(`${API_URL}/payment/get-gst`,getAuthorized());
  return data;
}

export const deletePayment = async (transactId) => {
  const data = await axios.delete(`${API_URL}/payment/deletePayment/${transactId}`,getAuthorized());
  return data;
}

export const updatePayment = async ({ transactId, newData }) => {
  // console.log("Updating payment:", transactId, newData);
  const { data } = await axios.put(
    `${API_URL}/payment/update-transaction/${transactId}`,
    { newData },
    getAuthorized()
  );
  return data;
};

