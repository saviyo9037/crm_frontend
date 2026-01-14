import axios from "axios"
import { API_URL, getAuthorized } from "../../utils/urls"


export const addsettingsdocument = async (settingsdocumentdata) => {
    const { data } = await axios.post(`${API_URL}/document-settings/add`, settingsdocumentdata, getAuthorized())
    return data
}

export const listsettingsdocument = async () => {
    const { data } = await axios.get(`${API_URL}/document-settings/list`, getAuthorized())
    return data
}

export const editsettingsdocument = async ({ settingsdocumentId, title }) => {
    const { data } = await axios.put(`${API_URL}/document-settings/edit/${settingsdocumentId}`, title , getAuthorized())
    return data
}

export const deletesettingsdocument = async ({ settingsdocumentId }) => {
    const { data } = await axios.delete(`${API_URL}/document-settings/delete/${settingsdocumentId}`, getAuthorized())
    return data
}

export const updateactivedocuments = async ({ settingsdocumentId, active }) => {
    const { data } = await axios.put(`${API_URL}/document-settings/update-status/${settingsdocumentId}`, { active }, getAuthorized())
    return data
}