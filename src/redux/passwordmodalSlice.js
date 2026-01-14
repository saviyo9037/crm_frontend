import { createSlice } from "@reduxjs/toolkit";


export const passwordmodalSlice = createSlice({
    name : 'passwordmodal',
    initialState:{
        passwordModal: false,
    },
    reducers:{
        togglepasswordModal: (state)=>{
            state.passwordModal = !state.passwordModal
        }
    }
})

export const {togglepasswordModal} = passwordmodalSlice.actions
export default passwordmodalSlice.reducer