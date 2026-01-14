import axios from "axios"
import { API_URL, getAuthorized } from "../../utils/urls"


export const addleadsettingsformfields = async (settingleadformdata) => {
    const { data } = await axios.post(`${API_URL}/lead-formfieldssettings/add`, settingleadformdata, getAuthorized())
    return data
}
// fbbkdfb kjdfvb kfjrevkbdfbjg
export const listleadsettingsformfields = async () => {
    const { data } = await axios.get(`${API_URL}/lead-formfieldssettings/list`, getAuthorized()) 
    return data
    
}

export const editleadsettingsformfields = async ({ settingsleadformId, settingsleadformdata}) => {
    const { data } = await axios.put(`${API_URL}/lead-formfieldssettings/edit/${settingsleadformId}`, settingsleadformdata , getAuthorized())
    return data
}

export const deleteleadsettingsformfields = async ({ settingsleadformId }) => {
    const { data } = await axios.delete(`${API_URL}/lead-formfieldssettings/delete/${settingsleadformId}`, getAuthorized())
    return data
}

export const updateactiveformfields = async ({ settingsleadformId, active }) => {
    const { data } = await axios.put(`${API_URL}/lead-formfieldssettings/update-active/${settingsleadformId}`, { active }, getAuthorized())
   
    return data
}


export const getproducts= async () => {
    const {data}= await axios.get(`${API_URL}/lead-formfieldssettings/get/products`,getAuthorized());
   
    return data
}