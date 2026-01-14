import axios from "axios"
import { API_URL, getAuthorized } from "../../utils/urls"

export const addProductSetting = async (productData) => {
    const { data } = await axios.post(`${API_URL}/product-setting/add`, productData,getAuthorized())
    return data;
}

export const getProductSetting = async () => {
    const { data } = await axios.get(`${API_URL}/product-setting/list`,getAuthorized());
    return data;
}

export const deleteProductSetting = async ({ settingsproductId }) => {
    const { data } = await axios.delete(`${API_URL}/product-setting/delete/${settingsproductId}`,getAuthorized());
    return data;
}

export const updateactiveProducts = async ({ settingsproductId, active }) => {
    const { data } = await axios.put(`${API_URL}/product-setting/update-active/${settingsproductId}`, { active }, getAuthorized())
    return data
}

export const editProductSetting = async ({ settingsproductId, title, duration, amount }) => {
    const { data } = await axios.put(`${API_URL}/product-setting/update-title/${settingsproductId}`, {title, duration, amount}, getAuthorized());
    return data;
}