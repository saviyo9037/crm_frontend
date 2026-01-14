import { createSlice } from '@reduxjs/toolkit';

const staffDetailModalSlice = createSlice({
  name: 'staffDetailModal',
  initialState: {
    isOpen: false,
    selectedStaffId: null,
  },
  reducers: {
    openStaffDetailModal: (state, action) => {
      state.isOpen = true;
      state.selectedStaffId = action.payload;
    },
    closeStaffDetailModal: (state) => {
      state.isOpen = false;
      state.selectedStaffId = null;
    },
  },
});

export const { openStaffDetailModal, closeStaffDetailModal } = staffDetailModalSlice.actions;
export default staffDetailModalSlice.reducer;
