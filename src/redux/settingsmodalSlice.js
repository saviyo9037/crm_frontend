import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customerstatusModal: false,
  customerstatuseditModal: false,
  documentsModal: false,
  documentseditModal: false,
  productsModal: false,
  productseditModal: false,
  leadsourceModal: false,
  leadsourceeditModal: false,
  leadformModal: false,
  leadformeditModal: false,
  permissionStatusEditModal: false,
  gstUpdateModal: false,
  selectedForm: null,
  selectedSource: null,
  selectedCustomerstatus: null,
  selectedDocument: null,
  selectedProduct: null,
  selectedPermissionStatus: null,
  selectedGstModal: null
};

const settingsmodalslice = createSlice({
  name: "settingsmodal",
  initialState,
  reducers: {
    togglecustomerstatusModal: (state) => {
      state.customerstatusModal = !state.customerstatusModal;
    },
    togglecustomerstatuseditModal: (state, action) => {
      state.customerstatuseditModal = !state.customerstatuseditModal;
      state.selectedCustomerstatus = action.payload;
    },
    toggledocumentsModal: (state) => {
      state.documentsModal = !state.documentsModal;
    },
    toggledocumentseditModal: (state, action) => {
      state.documentseditModal = !state.documentseditModal;
      state.selectedDocument = action.payload;
    },
    toggleleadsourceModal: (state) => {
      state.leadsourceModal = !state.leadsourceModal;
    },
    toggleleadsourceeditModal: (state, action) => {
      state.leadsourceeditModal = !state.leadsourceeditModal;
      state.selectedSource = action.payload;
    },
    toggleleadformModal: (state) => {
      state.leadformModal = !state.leadformModal;
    },
    toggleleadformeditModal: (state, action) => {
      state.leadformeditModal = !state.leadformeditModal;
      state.selectedForm = action.payload;
    },
    toggleproductsModal: (state) => {
      state.productsModal = !state.productsModal;
    },
    toggleproductseditModal: (state, action) => {
      state.productseditModal = !state.productseditModal;
      state.selectedProduct = action.payload;
    },
    permissionStatusEditModal: (state, action) => {
      state.permissionStatusEditModal = !state.permissionStatusEditModal;
      state.selectedPermissionStatus = action.payload;
    },
    gstUpdateModal: (state, action) => {
      state.gstUpdateModal = !state.gstUpdateModal;
      state.selectedGstModal = action.payload;
    },
    togglegsteditModal: (state, action) => {
      state.gstUpdateModal = !state.gstUpdateModal;
      state.selectedGstModal = action.payload;
    }
  }
});

export const {
  togglecustomerstatusModal,
  togglecustomerstatuseditModal,
  toggledocumentsModal,
  toggledocumentseditModal,
  toggleleadsourceModal,
  toggleleadsourceeditModal,
  toggleleadformModal,
  toggleleadformeditModal,
  toggleproductsModal,
  toggleproductseditModal,
  permissionStatusEditModal,
  gstUpdateModal,
  togglegsteditModal
} = settingsmodalslice.actions;

export default settingsmodalslice.reducer;
