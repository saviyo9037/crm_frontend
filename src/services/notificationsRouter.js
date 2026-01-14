import axios from "axios"
import { API_URL, getAuthorized } from "../utils/urls"

export const fetchnotifications = async () => {
    const { data } = await axios.get(`${API_URL}/notification/get-notifications`, getAuthorized())
    return data
}

export const fetchunreadcount = async () => {
    const { data } = await axios.get(`${API_URL}/notification/unread-notifications`, getAuthorized())
    return data.count
}

export const markallread = async () => {
    const { data } = await axios.put(`${API_URL}/notification/markallread`,{}, getAuthorized())
    return data
}

export const delete_all = async () => {
    const { data } = await axios.delete(`${API_URL}/notification/delete-all`, getAuthorized())
    return data
}

export const delete_notification = async (id) => {
    const { data } = await axios.delete(`${API_URL}/notification/delete/${id}`, getAuthorized())
    return data
}