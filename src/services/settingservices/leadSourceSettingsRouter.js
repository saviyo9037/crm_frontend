import axios from "axios"
import { API_URL, getAuthorized } from "../../utils/urls"


export const addleadsourcesettings = async (settingleadsourcedata) => {
    const { data } = await axios.post(`${API_URL}/lead-sourcesettings/add`, settingleadsourcedata, getAuthorized())
    return data
}

export const listleadsourcesettings = async () => {
    const { data } = await axios.get(`${API_URL}/lead-sourcesettings/list`, getAuthorized())
    return data
}

export const editleadsourcesettings = async ({ settingsleadsourceId, settingsleadsourcedata }) => {
    const { data } = await axios.put(`${API_URL}/lead-sourcesettings/edit/${settingsleadsourceId}`, settingsleadsourcedata, getAuthorized())
    return data
}

export const deleteleadsourcesettings = async ({ settingsleadsourceId }) => {
    const { data } = await axios.delete(`${API_URL}/lead-sourcesettings/delete/${settingsleadsourceId}`, getAuthorized())
    return data
}

export const updateactivesources = async ({ settingsleadsourceId, active }) => {
    const { data } = await axios.put(`${API_URL}/lead-sourcesettings/update-status/${settingsleadsourceId}`, { active }, getAuthorized())
    return data
}