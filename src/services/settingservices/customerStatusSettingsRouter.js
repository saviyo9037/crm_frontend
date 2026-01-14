import axios from "axios"
import { API_URL, getAuthorized } from "../../utils/urls"


export const addcustomersettingstatus = async (settingstatusdata) => {
    const { data } = await axios.post(`${API_URL}/customer-statussettings/add`, settingstatusdata, getAuthorized())
    return data
}

export const listcustomersettingstatus = async () => {
    const { data } = await axios.get(`${API_URL}/customer-statussettings/list`, getAuthorized())
    return data
}

export const editcustomersettingstatus = async ({ settingstatusId, title }) => {
    const { data } = await axios.put(`${API_URL}/customer-statussettings/edit/${settingstatusId}`, title , getAuthorized())
    return data
}

export const deletecustomersettingstatus = async ({ settingstatusId }) => {
    const { data } = await axios.delete(`${API_URL}/customer-statussettings/delete/${settingstatusId}`, getAuthorized())
    return data
}

export const updateactivecustomerstatus = async ({ settingstatusId, active }) => {
    const { data } = await axios.put(`${API_URL}/customer-statussettings/update-status/${settingstatusId}`, { active }, getAuthorized())
    return data
}