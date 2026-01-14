import axios from "axios"
import { API_URL, getAuthorized } from "../utils/urls"


export const deletecustomer = async (customerId) => {
    const { data } = await axios.delete(`${API_URL}/customers/delete/${customerId}`, getAuthorized())
    return data
}

export const deletemultiplecustomer = async ({ customerIds }) => {
    const { data } = await axios.delete(`${API_URL}/customers/delete-multiplecustomers`, {
        ...getAuthorized(),
        data: { customerIds }, // Send leadIds in the request body
    });
    return data;
};

export const addcustomer = async (customerData) => {
    const { data } = await axios.post(`${API_URL}/customers/add`, customerData, getAuthorized())
    return data
}

export const listconvertedcustomers = async ({
    page = 1,
    limit = 10,
    paymentStatus,
    activestatus,
    searchText,
    date,
    startDate,
    endDate,
    assignedTo,
}) => {
    const params = new URLSearchParams({ page, limit });
    if (paymentStatus && paymentStatus !== 'Payment Status') params.append('paymentStatus', paymentStatus);
    if (activestatus && activestatus !== 'All') params.append('activestatus', activestatus);
    if (searchText) params.append('searchText', searchText);
    if (date && date !== 'Date') params.append('date', date);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (assignedTo) params.append('assignedTo', assignedTo);
    const { data } = await axios.get(`${API_URL}/customers/list?${params.toString()}`, getAuthorized());
    return data;
};

export const editcustomerdetails = async ({ customerId, customerData }) => {
    const { data } = await axios.put(`${API_URL}/customers/edit/${customerId}`, customerData, getAuthorized())
    return data
}


export const updatepaymentstatus = async ({ customerId, payment }) => {
    const { data } = await axios.put(`${API_URL}/customers/update-paymentstatus/${customerId}`, { payment }, getAuthorized())
    return data
}

export const updatecustomerstatus = async ({ customerId, status }) => {
    const { data } = await axios.put(`${API_URL}/customers/update-status/${customerId}`, { status }, getAuthorized())   
    return data
}

export const updateactivecustomers = async ({ customerId, isActive }) => {
    const { data } = await axios.put(`${API_URL}/customers/update-active/${customerId}`, { isActive }, getAuthorized())
    return data
}

