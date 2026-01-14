import { createSlice } from "@reduxjs/toolkit";


export const createadminmodalslice = createSlice({
    name: 'createadminmodal',
    initialState: {
        registeradminModal: false
    },
    reducers: {
        toggleregisteradminModal: (state) => {
            state.registeradminModal = !state.registeradminModal
        }
    }
})

export const { toggleregisteradminModal } = createadminmodalslice.actions
export default createadminmodalslice.reducer