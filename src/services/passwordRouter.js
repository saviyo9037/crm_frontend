import axios from "axios"
import { API_URL } from "../utils/urls"


export const forgotpassword = async ({email}) => {
    const { data } = await axios.post(`${API_URL}/password/forgot-password`, {email})
    return data
}

export const resetpassword = async ({ email, pin, newpassword }) => {
    const { data } = await axios.post(`${API_URL}/password/reset-password`, { email, pin, newpassword })
    return data
}