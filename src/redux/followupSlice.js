import { createSlice } from "@reduxjs/toolkit";

export const followupSlice = createSlice({
    name:"followup",
    initialState:{
        followups:[]
    },
    reducers:{
        setFollowups:(state,action)=>{
            state.followups=action.payload
        }
    }
})


export const {setFollowups}=followupSlice.actions;

export default followupSlice.reducer;