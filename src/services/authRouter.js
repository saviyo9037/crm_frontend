import axios from "axios"
import { API_URL } from "../utils/urls"

export const logindata = async(loginusers)=>{
    const { data } = await axios.post(`${API_URL}/auth/login`,loginusers)
    return data
}