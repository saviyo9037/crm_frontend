import axios from "axios"
import { API_URL, getAuthorized } from "../../utils/urls"

export const getPermissionSettings=async()=>{
    const {data} = await axios.get(`${API_URL}/permission/read`,getAuthorized());
    return data;
}


export const updatePermissionSettings = async({permissionId,active})=>{
    const {data} = await axios.put(`${API_URL}/permission/update/${permissionId}`,{active},getAuthorized());
    return data;
}

