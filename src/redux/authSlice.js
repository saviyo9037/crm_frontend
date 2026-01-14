import { createSlice } from "@reduxjs/toolkit"
import { jwtDecode } from "jwt-decode"

const token = sessionStorage.getItem('token')
const userdata = token ? jwtDecode(token) : null
const metadataUser = sessionStorage.getItem('metadataUser')
const parsedmetadataUser = metadataUser ? JSON.parse(metadataUser) : null

export const authslice = createSlice({
    name: "auth",
    initialState: {
        user: userdata,
        role: userdata?.role || null,
        metadataUser: parsedmetadataUser || null
    },

    reducers: {
        loginaction: (state, action) => {
            let data = jwtDecode(action.payload.token)
            state.user = data
            state.role = data.role
            sessionStorage.setItem('token', action.payload.token)
        },
        logoutaction: (state) => {
            state.user = null
            state.role = null
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('metadataUser')
        },
        setMetadataUser: (state, action) => {
            state.metadataUser = action.payload
            sessionStorage.setItem('metadataUser', JSON.stringify(action.payload))
        },
        clearMetadataUser: (state) => {
            state.metadataUser = null
            sessionStorage.removeItem('metadataUser')
        },
        setImage: (state, action) => {
            state.user.image = action.payload
        }
    }
})


export const { loginaction, logoutaction, setMetadataUser, clearMetadataUser, setImage } = authslice.actions
export default authslice.reducer