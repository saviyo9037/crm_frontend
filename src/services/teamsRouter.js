import axios from "axios"
import { API_URL, getAuthorized } from "../utils/urls"


export const assignteams = async ({ subadminId, agentId }) => {
    const { data } = await axios.put(`${API_URL}/teams/assign-team/${subadminId}`, { agentId }, getAuthorized())
    return data
}

export const unassignteams = async ({ subadminId, agentId }) => {
    const { data } = await axios.put(`${API_URL}/teams/unassign-team/${subadminId}`, { agentId }, getAuthorized())
    return data
}