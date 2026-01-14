import { createSlice } from "@reduxjs/toolkit";

const leadSlice = createSlice({
  name: "lead",
  initialState: {
    selectedLead: null,
  },
  reducers: {
    setSelectedLead: (state, action) => {
      state.selectedLead = action.payload;
    },
    clearSelectedLead: (state) => {
      state.selectedLead = null;
    },
  },
});

export const { setSelectedLead, clearSelectedLead } = leadSlice.actions;
export default leadSlice.reducer;
