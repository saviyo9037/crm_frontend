import { createSlice } from "@reduxjs/toolkit";

export const modalslice = createSlice({
  name: "modal",
  initialState: {
    staffmodal: false,
    staffeditmodal: false,
    staffdetailsModal: false,
    Staffdatamodal: false,

    selectedStaff: null,
    addcustomermodal: false,
    addtasksmodal: false,
    customerModal: false,
    customerdetailModal: false,
    convertedcustomerdetailModal: false,
    customereditModal: false,
    convertedleadeditModal: false,

    assignteamsModal: false,
    assignleadsModal: false,

    viewtasksModal: false,
    viewedittaskModal: false,
    edittaskmodal: false,

    selectedLead: null,
    selectedCustomer: null,
    selectedStaffId: null,
    selectedStaffsId: null,
    selectedSubadminId: null,
    selectedTask: null,

    notificationModal: false,
    isNotificationread: false,
    fullnotificationModal: false,
    uploadcsvModal: false,
    selectedCustomer: null,
  },

  reducers: {
    togglestaffmodal: (state) => {
      state.staffmodal = !state.staffmodal;
    },

    togglestaffeditmodal: (state, action) => {
      state.staffeditmodal = !state.staffeditmodal;
      state.selectedStaff = action.payload;
    },

    toggleaddcustomermodal: (state) => {
      state.addcustomermodal = !state.addcustomermodal;
    },

    toggleaddtasksmodal: (state) => {
      state.addtasksmodal = !state.addtasksmodal;
    },

    toggleCustomermodal: (state) => {
      state.customerModal = !state.customerModal;
    },

    toggleCustomerdetailmodal: (state, action) => {
      state.customerdetailModal = !state.customerdetailModal;
      state.selectedLead = action.payload || null;
    },

    toggleConvertedcustomerdetailmodal: (state, action) => {
      state.convertedcustomerdetailModal = !state.convertedcustomerdetailModal;
      if (action.payload) state.selectedCustomer = action.payload;
    },

    toggleCustomereditmodal: (state) => {
      state.customereditModal = !state.customereditModal;
    },

    toggleconvertedleadeditModal: (state, action) => {
      state.convertedleadeditModal = !state.convertedleadeditModal;
      if (action.payload) state.selectedLead = action.payload;
    },

    toggleAssignteamsmodal: (state, action) => {
      state.assignteamsModal = !state.assignteamsModal;
      if (action.payload) state.selectedSubadminId = action.payload;
    },

    toggleAssignleadsmodal: (state, action) => {
      state.assignleadsModal = !state.assignleadsModal;
      if (action.payload) state.selectedStaffId = action.payload;
    },

    // ✅ FIXED: no overwriting boolean with object
    toggleStaffdetailmodal: (state, action) => {
      state.staffdetailsModal = !state.staffdetailsModal;
      if (action.payload) state.selectedStaffId = action.payload;

      if (!state.staffdetailsModal) state.selectedStaffId = null;
    },

    toggleViewtasksmodal: (state, action) => {
      state.viewtasksModal = !state.viewtasksModal;
      if (action.payload) state.selectedStaffsId = action.payload;
    },

    toggleViewedittaskmodal: (state, action) => {
      state.viewedittaskModal = !state.viewedittaskModal;
      if (action.payload) state.selectedStaffsId = action.payload;
    },

    toggleedittaskmodal: (state, action) => {
      state.edittaskmodal = !state.edittaskmodal;
      state.selectedTask = action.payload;
    },

    updateSubadmin: (state, action) => {
      state.selectedSubadminId = action.payload;
    },

    toggleNotificationmodal: (state) => {
      state.notificationModal = !state.notificationModal;
      if (state.notificationModal) state.isNotificationread = true;
    },

    toggleFullnotificationmodal: (state) => {
      state.fullnotificationModal = !state.fullnotificationModal;
    },

    toggleUploadcsvmodal: (state) => {
      state.uploadcsvModal = !state.uploadcsvModal;
    },

    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },

    // ✅ Staff Data Modal (linked to your Staffdatamodal.jsx)
    toggleStaffdatamodal: (state, action) => {
      state.Staffdatamodal = !state.Staffdatamodal;

      if (action.payload) {
        state.selectedStaffId = action.payload;
      } else if (!state.Staffdatamodal) {
        state.selectedStaffId = null;
      }
    },
  },
});

export const {
  togglestaffmodal,
  togglestaffeditmodal,
  toggleStaffdatamodal,
  toggleStaffdetailmodal,
  toggleaddcustomermodal,
  toggleaddtasksmodal,
  toggleCustomermodal,
  toggleCustomerdetailmodal,
  toggleConvertedcustomerdetailmodal,
  toggleCustomereditmodal,
  toggleconvertedleadeditModal,
  toggleAssignteamsmodal,
  toggleAssignleadsmodal,
  toggleViewtasksmodal,
  toggleViewedittaskmodal,
  toggleedittaskmodal,
  updateSubadmin,
  toggleNotificationmodal,
  toggleFullnotificationmodal,
  toggleUploadcsvmodal,
  setSelectedCustomer,
} = modalslice.actions;

export default modalslice.reducer;
