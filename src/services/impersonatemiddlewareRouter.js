import axios from "axios"
import { API_URL, getAuthorized } from "../utils/urls"


export const impersonateuser = async ({selectedId}) => {
    const { data } = await axios.post(`${API_URL}/impersonate/${selectedId}`,{}, getAuthorized())
    return data
}