import axios from "axios";
import { API_URL } from "../utils/urls"

export const addRemainder = async(remainderdata)=>{
    const {data}= await axios.post(`${API_URL}/remainder/addRemainder`,remainderdata);
    return data;
}

export const showRemainder = async(remainderId)=>{
    const {data} = await axios.get(`${API_URL}/remainder/showRemainder/${remainderId}`);
    return data;
}

export const updateRemainder = async(remainderId,remainderdata)=>{
    const {data} = await axios.put(`${API_URL}/remainder/updateRemainder/${remainderId}`,remainderdata);
    return data;
}

export const deleteRemainder = async(remainderId)=>{
    const {data} = await axios.delete(`${API_URL}/remainder/deleteRemainder/${remainderId}`);
    return data;
}