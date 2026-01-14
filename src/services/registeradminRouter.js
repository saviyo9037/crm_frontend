import axios from "axios"
import { API_URL } from "../utils/urls"


export const createadmin = async (admindata) => {
    const { data } = await axios.post(`${API_URL}/admin/register-admin`, admindata)
    return data
}

export const countadmin = async () => {
    const { data } = await axios.get(`${API_URL}/admin/get-count`)
    return data
}