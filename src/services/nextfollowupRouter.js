import axios from "axios"
import { API_URL, getAuthorized } from "../utils/urls"


export const activatenextfollowup = async () => {
    const { data } = await axios.put(`${API_URL}/nextfollowup/activate`, null, getAuthorized())
    return data
}

export const inactivatenextfollowup = async () => {
    const { data } = await axios.put(`${API_URL}/nextfollowup/inactive`, null, getAuthorized())
    return data
}

export const getnextfollowup = async () => {
    const { data } = await axios.get(`${API_URL}/nextfollowup/get-nextfollowup`, getAuthorized()) 
    return data
}
