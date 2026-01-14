import axios from "axios"
import { API_URL, getAuthorized } from "../../utils/urls"

export const addsettingsgst=async (gstData) => {
    const {data} = await axios.post(`${API_URL}/gst/create_gst`,gstData,getAuthorized());
    return data
}

export const getsettingsgst = async () => {
    const {data} = await axios.get(`${API_URL}/gst/read_gst`,getAuthorized());
    return data
}

export const updatesettingsgst = async ({gstDataId,gst_amount}) => {
    const{data} = await axios.put(`${API_URL}/gst/update_gst/${gstDataId}`,{gst_amount},getAuthorized());
    return data
}

export const activateGstSettings = async({gstDataId,active})=>{
    const {data} = await axios.put(`${API_URL}/gst/update-status/${gstDataId}`,{active},getAuthorized());
   
    return data;
}