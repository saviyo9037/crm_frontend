import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deletecustomersettingstatus,
  listcustomersettingstatus,
  updateactivecustomerstatus,
} from "../services/settingservices/customerStatusSettingsRouter";
import { FaBars, FaEdit, FaTrash } from "react-icons/fa";
import Icons from "./Icons";
import {
  deleteleadsourcesettings,
  listleadsourcesettings,
  updateactivesources,
} from "../services/settingservices/leadSourceSettingsRouter";
import { useDispatch, useSelector } from "react-redux";
import {
  togglecustomerstatuseditModal,
  togglecustomerstatusModal,
  toggledocumentseditModal,
  toggledocumentsModal,
  toggleleadformeditModal,
  toggleleadformModal,
  toggleleadsourceeditModal,
  toggleleadsourceModal,
  toggleproductseditModal,
  toggleproductsModal,
} from "../redux/settingsmodalSlice";
import Leadsourcemodal from "../components/settingscomponents/Leadsourcemodal";
import Leadformfieldsmodal from "../components/settingscomponents/Leadformfieldsmodal";
import Leadformfieldseditmodal from "../components/settingscomponents/Leadformfieldseditmodal";
import Customerstatusmodal from "../components/settingscomponents/Customerstatusmodal";
import Leadsourceeditmodal from "../components/settingscomponents/Leadsourceeditmodal";
import Customerstatuseditmodal from "../components/settingscomponents/Customerstatuseditmodal";
import Documentmodal from "../components/settingscomponents/Documentmodal";
import Documenteditmodal from "../components/settingscomponents/Documenteditmodal";
import ProductAddModal from "../components/settingscomponents/ProductAddModal";
import ProductEditModal from "../components/settingscomponents/ProductEditModal";
import {
  deletesettingsdocument,
  listsettingsdocument,
  updateactivedocuments,
} from "../services/settingservices/documentSettingsRouter";
import Spinner from "../components/Spinner";
import {
  activatenextfollowup,
  getnextfollowup,
  inactivatenextfollowup,
} from "../services/nextfollowupRouter";
import {
  deleteProductSetting,
  getProductSetting,
  updateactiveProducts,
} from "../services/settingservices/productSettingRouter";
import {
  getPermissionSettings,
  updatePermissionSettings,
} from "../services/settingservices/permissionSettingsRouter";
import Gstmodal from "../components/settingscomponents/Gstmodal";
import Gsteditmodal from "../components/settingscomponents/Gsteditmodal";
import { deleteleadsettingsformfields, listleadsettingsformfields, updateactiveformfields } from "../services/settingservices/leadFormFieldsSettingsRouter";

function Settings() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [activesettings, setactivesettings] = useState("customerstatus");
  const [sidebarVisible, setsidebarVisible] = useState(true);
  const [deletesuccessmodal, setdeletesuccessmodal] = useState(false);

  // Redux state selectors
  const isleadsourceModal = useSelector((state) => state.settingsmodal.leadsourceModal);
  const isleadsourceeditModal = useSelector((state) => state.settingsmodal.leadsourceeditModal);
  const isdocumentModal = useSelector((state) => state.settingsmodal.documentsModal);
  const isdocumenteditModal = useSelector((state) => state.settingsmodal.documentseditModal);
  const isleadformModal = useSelector((state) => state.settingsmodal.leadformModal);
  const isleadformeditModal = useSelector((state) => state.settingsmodal.leadformeditModal);
  const iscustomerstatusModal = useSelector((state) => state.settingsmodal.customerstatusModal);
  const iscustomerstatuseditModal = useSelector((state) => state.settingsmodal.customerstatuseditModal);
  const isproductsModal = useSelector((state) => state.settingsmodal.productsModal);
  const isproductseditModal = useSelector((state) => state.settingsmodal.productseditModal);
  const isgsteditModal = useSelector((state) => state.settingsmodal.gstUpdateModal);

  // Queries
  const fetchsettingsstatus = useQuery({
    queryKey: ["List Settingstatus"],
    queryFn: listcustomersettingstatus,
  });

  const fetchproducts = useQuery({
    queryKey: ["products list"],
    queryFn: getProductSetting,
  });

  const fetchPermission = useQuery({
    queryKey: ["permission"],
    queryFn: getPermissionSettings,
  });

  const fetchdocuments = useQuery({
    queryKey: ["List Documents"],
    queryFn: listsettingsdocument,
  });

  const fetchsettingformfield = useQuery({
    queryKey: ["List Form Fields"],
    queryFn: listleadsettingsformfields,
  });

  const fetchsettingsources = useQuery({
    queryKey: ["List setting sources"],
    queryFn: listleadsourcesettings,
  });

  const fetchnextfollowup = useQuery({
    queryKey: ["Get next followup"],
    queryFn: getnextfollowup,
  });

  // Mutations
  const updatingactivecustomerstatus = useMutation({
    mutationKey: ["Updating active customerstatus"],
    mutationFn: updateactivecustomerstatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["List Settingstatus"]);
    },
  });

  const deletingcustomerstatus = useMutation({
    mutationKey: ["Deleting customerstatus"],
    mutationFn: deletecustomersettingstatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["List Settingstatus"]);
      setdeletesuccessmodal(true);
      setTimeout(() => setdeletesuccessmodal(false), 2000);
    },
  });

  const updatingactiveproduct = useMutation({
    mutationKey: ["Updating active products"],
    mutationFn: updateactiveProducts,
    onSuccess: () => {
      queryClient.invalidateQueries(["products list"]);
    },
  });

  const deletingproduct = useMutation({
    mutationKey: ["deleting product"],
    mutationFn: deleteProductSetting,
    onSuccess: () => {
      queryClient.invalidateQueries(["products list"]);
      setdeletesuccessmodal(true);
      setTimeout(() => setdeletesuccessmodal(false), 2000);
    },
  });

  const updatingactivedocuments = useMutation({
    mutationKey: ["Updating active document"],
    mutationFn: updateactivedocuments,
    onSuccess: () => {
      queryClient.invalidateQueries(["List Documents"]);
    },
  });

  const deletingdocument = useMutation({
    mutationKey: ["Deleting document"],
    mutationFn: deletesettingsdocument,
    onSuccess: () => {
      queryClient.invalidateQueries(["List Documents"]);
      setdeletesuccessmodal(true);
      setTimeout(() => setdeletesuccessmodal(false), 2000);
    },
  });

  const updatingactiveformfields = useMutation({
    mutationKey: ["Updating active forms"],
    mutationFn: updateactiveformfields,
    onSuccess: () => {
      queryClient.invalidateQueries(["List Form Fields"]);
    },
  });

  const deletingformfields = useMutation({
    mutationKey: ["Deleting Formfield"],
    mutationFn: deleteleadsettingsformfields,
    onSuccess: () => {
      queryClient.invalidateQueries(["List Form Fields"]);
      setdeletesuccessmodal(true);
      setTimeout(() => setdeletesuccessmodal(false), 2000);
    },
  });

  const updatingactivesources = useMutation({
    mutationKey: ["Updating active sources"],
    mutationFn: updateactivesources,
    onSuccess: () => {
      queryClient.invalidateQueries(["List setting sources"]);
    },
  });

  const deletingsources = useMutation({
    mutationKey: ["Deleting Source"],
    mutationFn: deleteleadsourcesettings,
    onSuccess: () => {
      queryClient.invalidateQueries(["List setting sources"]);
      setdeletesuccessmodal(true);
      setTimeout(() => setdeletesuccessmodal(false), 2000);
    },
  });

  const updatingActivePermission = useMutation({
    mutationKey: ["update_permission"],
    mutationFn: updatePermissionSettings,
    onSuccess: () => {
      queryClient.invalidateQueries(["permission"]);
    },
  });

  const activatingnextfollowup = useMutation({
    mutationKey: ["Activating Next Followup"],
    mutationFn: activatenextfollowup,
    onSuccess: () => {
      queryClient.invalidateQueries(["Get next followup"]);
    },
  });

  const inactivatingnextfollowup = useMutation({
    mutationKey: ["Inactivate Next Followup"],
    mutationFn: inactivatenextfollowup,
    onSuccess: () => {
      queryClient.invalidateQueries(["Get next followup"]);
    },
  });

  // Handlers
  const handleactivecustomerstatus = async (settingstatusId, active) => {
    await updatingactivecustomerstatus.mutateAsync({ settingstatusId, active });
  };

  const handledeletestatus = async (settingstatusId) => {
    await deletingcustomerstatus.mutateAsync({ settingstatusId });
  };

  const handleactiveproduct = async (settingsproductId, active) => {
    await updatingactiveproduct.mutateAsync({ settingsproductId, active });
  };

  const handledeleteproduct = async (settingsproductId) => {
    await deletingproduct.mutateAsync({ settingsproductId });
  };

  const handleactivedocument = async (settingsdocumentId, active) => {
    await updatingactivedocuments.mutateAsync({ settingsdocumentId, active });
  };

  const handledeletedocument = async (settingsdocumentId) => {
    await deletingdocument.mutateAsync({ settingsdocumentId });
  };

  const handleactiveformfield = async (settingsleadformId, active) => {
    await updatingactiveformfields.mutateAsync({ settingsleadformId, active });
  };

  const handledeleteformfield = async (settingsleadformId) => {
    await deletingformfields.mutateAsync({ settingsleadformId });
  };

  const handleactivesource = async (settingsleadsourceId, active) => {
    await updatingactivesources.mutateAsync({ settingsleadsourceId, active });
  };

  const handledeletesource = async (settingsleadsourceId) => {
    await deletingsources.mutateAsync({ settingsleadsourceId });
  };

  const handleactivepermission = async (permissionId, active) => {
    await updatingActivePermission.mutateAsync({ permissionId, active });
  };

  const handleactivatenextfollowup = async (checked) => {
    if (checked) {
      await activatingnextfollowup.mutateAsync();
    } else {
      await inactivatingnextfollowup.mutateAsync();
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-100 overflow-x-hidden">
      <div className="fixed inset-y-0 left-0 z-40">
        <motion.div
          animate={{ x: sidebarVisible ? 0 : -260 }}
          transition={{ duration: 0.3 }}
          className="w-64 h-full fixed top-0 left-0 z-50"
        >
          <Sidebar />
        </motion.div>
      </div>

      <motion.div
        animate={{ marginLeft: sidebarVisible ? 256 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8"
      >
        {/* Loading Spinners */}
        {(updatingactivecustomerstatus.isPending ||
          deletingcustomerstatus.isPending ||
          updatingactiveformfields.isPending ||
          deletingformfields.isPending ||
          updatingactivedocuments.isPending ||
          deletingdocument.isPending ||
          updatingactivesources.isPending ||
          deletingsources.isPending ||
          updatingactiveproduct.isPending ||
          deletingproduct.isPending) && <Spinner />}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center mb-4 sm:mb-0">
            <button
              className="mr-4 text-blue-600 hover:text-blue-800 transition"
              onClick={() => setsidebarVisible(!sidebarVisible)}
            >
              <FaBars className="mr-3 text-blue-600 text-lg sm:text-xl" />
            </button>
            Settings
          </h3>
          <div className="self-end sm:self-auto">
            <Icons />
          </div>
        </div>


        <div className="flex flex-1 flex-col sm:flex-row overflow-hidden">
          {/* Vertical Tab Buttons */}
          <div className="flex flex-row flex-wrap sm:flex-col gap-8 sm:gap-10 mb-4 sm:mb-0 sm:mr-6">
            {["customerstatus", "document", "leadform", "leadsource", "products", "others"].map((tab) => (
              <button
                key={tab}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-md font-semibold cursor-pointer text-sm sm:text-base ${
                  activesettings === tab
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setactivesettings(tab)}
              >
                {tab === "customerstatus" && "Customer Status"}
                {tab === "document" && "Documents"}
                {tab === "leadform" && "Lead Form Fields"}
                {tab === "leadsource" && "Lead Sources"}
                {tab === "products" && "Products"}
                {tab === "others" && "Others"}
              </button>
            ))}
          </div>

          <div className="flex-1 bg-white rounded-xl shadow-md p-4 sm:p-6 overflow-y-auto h-full">
            {activesettings === "customerstatus" && (
              <>
                <div className="flex justify-end mb-4">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md shadow text-sm sm:text-base"
                    onClick={() => dispatch(togglecustomerstatusModal())}
                  >
                    + Add new
                  </button>
                </div>
                {fetchsettingsstatus.isLoading ? (
                  <Spinner />
                ) : fetchsettingsstatus.data?.getCustomerstatus?.length > 0 ? (
                  <div className="flex flex-col w-full">
                    <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-x-auto">
                      <table className="min-w-full text-xs sm:text-sm">
                        <thead className="bg-gray-200 text-gray-700">
                          <tr>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">#</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Status</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Edit</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Active</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fetchsettingsstatus.data.getCustomerstatus.map((customerstatus, index) => (
                            <tr key={customerstatus._id} className="border-b">
                              <td className="px-2 sm:px-6 py-2 sm:py-3">{index + 1}</td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3 truncate">{customerstatus.title}</td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3">
                                <button
                                  className="text-blue-600 hover:text-blue-800 text-base sm:text-lg"
                                  onClick={() => dispatch(togglecustomerstatuseditModal(customerstatus))}
                                >
                                  <FaEdit />
                                </button>
                              </td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3">
                                <label className="relative inline-flex items-center cursor-pointer w-10 sm:w-11 h-5 sm:h-6">
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={!!customerstatus?.active}
                                    onChange={(e) => handleactivecustomerstatus(customerstatus._id, e.target.checked)}
                                  />
                                  <div className="w-10 sm:w-11 h-5 sm:h-6 bg-red-600 rounded-full peer-checked:bg-green-600 transition-colors duration-300"></div>
                                  <div className="absolute left-1 top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"></div>
                                </label>
                              </td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3">
                                <button
                                  className="text-red-600 hover:text-red-800 text-base sm:text-lg"
                                  onClick={() => handledeletestatus(customerstatus._id)}
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 text-sm sm:text-lg">
                    No customer statuses added yet.
                  </div>
                )}
              </>
            )}
            {activesettings === "document" && (
              <>
                <div className="flex justify-end mb-4">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md shadow text-sm sm:text-base"
                    onClick={() => dispatch(toggledocumentsModal())}
                  >
                    + Add new
                  </button>
                </div>
                {fetchdocuments.isLoading ? (
                  <Spinner />
                ) : fetchdocuments.data?.getDocument?.length > 0 ? (
                  <div className="flex flex-col w-full">
                    <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-x-auto">
                      <table className="min-w-full text-xs sm:text-sm">
                        <thead className="bg-gray-200 text-gray-700">
                          <tr>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">#</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Status</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Edit</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Active</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fetchdocuments.data.getDocument.map((document, index) => (
                            <tr key={document._id} className="border-b">
                              <td className="px-2 sm:px-6 py-2 sm:py-3">{index + 1}</td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3 truncate">{document.title}</td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3">
                                <button
                                  className="text-blue-600 hover:text-blue-800 text-base sm:text-lg"
                                  onClick={() => dispatch(toggledocumentseditModal(document))}
                                >
                                  <FaEdit />
                                </button>
                              </td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3">
                                <label className="relative inline-flex items-center cursor-pointer w-10 sm:w-11 h-5 sm:h-6">
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={!!document?.active}
                                    onChange={(e) => handleactivedocument(document._id, e.target.checked)}
                                  />
                                  <div className="w-10 sm:w-11 h-5 sm:h-6 bg-red-600 rounded-full peer-checked:bg-green-600 transition-colors duration-300"></div>
                                  <div className="absolute left-1 top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"></div>
                                </label>
                              </td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3">
                                <button
                                  className="text-red-600 hover:text-red-800 text-base sm:text-lg"
                                  onClick={() => handledeletedocument(document._id)}
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 text-sm sm:text-lg">
                    No documents added yet.
                  </div>
                )}
              </>
            )}
            {activesettings === "leadform" && (
              <>
                <div className="flex justify-end mb-4">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md shadow text-sm sm:text-base"
                    onClick={() => dispatch(toggleleadformModal())}
                  >
                    + Add new
                  </button>
                </div>
                {fetchsettingformfield.isLoading ? (
                  <Spinner />
                ) : fetchsettingformfield.data?.getLeadform?.length > 0 ? (
                  <div className="flex flex-col w-full">
                    <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-x-auto">
                      <table className="min-w-full text-xs sm:text-sm">
                        <thead className="bg-gray-200 text-gray-700">
                          <tr>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">#</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Field Name</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Field Type</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Edit</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Active</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fetchsettingformfield.data.getLeadform.map((formfield, index) => (
                            <tr key={formfield._id} className="border-b">
                              <td className="px-2 sm:px-6 py-2 sm:py-3">{index + 1}</td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3 truncate">{formfield.name}</td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3 truncate">{formfield.type}</td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3">
                                <button
                                  className="text-blue-600 hover:text-blue-800 text-base sm:text-lg"
                                  onClick={() => dispatch(toggleleadformeditModal(formfield))}
                                >
                                  <FaEdit />
                                </button>
                              </td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3">
                                <label className="relative inline-flex items-center cursor-pointer w-10 sm:w-11 h-5 sm:h-6">
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={!!formfield?.active}
                                    onChange={(e) => handleactiveformfield(formfield._id, e.target.checked)}
                                  />
                                  <div className="w-10 sm:w-11 h-5 sm:h-6 bg-red-600 rounded-full peer-checked:bg-green-600 transition-colors duration-300"></div>
                                  <div className="absolute left-1 top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"></div>
                                </label>
                              </td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3">
                                <button
                                  className="text-red-600 hover:text-red-800 text-base sm:text-lg"
                                  onClick={() => handledeleteformfield(formfield._id)}
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 text-sm sm:text-lg">
                    No lead forms added yet.
                  </div>
                )}
              </>
            )}
            {activesettings === "leadsource" && (
              <>
                <div className="flex justify-end mb-4">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md shadow text-sm sm:text-base"
                    onClick={() => dispatch(toggleleadsourceModal())}
                  >
                    + Add new
                  </button>
                </div>
                {fetchsettingsources.isLoading ? (
                  <Spinner />
                ) : fetchsettingsources.data?.getLeadsource?.length > 0 ? (
                  <div className="flex flex-col w-full">
                    <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-x-auto">
                      <table className="min-w-full text-xs sm:text-sm">
                        <thead className="bg-gray-200 text-gray-700">
                          <tr>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">#</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Source</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Edit</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Active</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fetchsettingsources.data.getLeadsource.map((source, index) => (
                            <tr key={source._id} className="border-b">
                              <td className="px-2 sm:px-6 py-2 sm:py-3">{index + 1}</td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3 truncate">{source.title}</td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3">
                                <button
                                  className="text-blue-600 hover:text-blue-800 text-base sm:text-lg"
                                  onClick={() => dispatch(toggleleadsourceeditModal(source))}
                                >
                                  <FaEdit />
                                </button>
                              </td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3">
                                <label className="relative inline-flex items-center cursor-pointer w-10 sm:w-11 h-5 sm:h-6">
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={!!source?.active}
                                    onChange={(e) => handleactivesource(source._id, e.target.checked)}
                                  />
                                  <div className="w-10 sm:w-11 h-5 sm:h-6 bg-red-600 rounded-full peer-checked:bg-green-600 transition-colors duration-300"></div>
                                  <div className="absolute left-1 top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"></div>
                                </label>
                              </td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3">
                                <button
                                  className="text-red-600 hover:text-red-800 text-base sm:text-lg"
                                  onClick={() => handledeletesource(source._id)}
                                >
                                  <FaTrash/>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 text-sm sm:text-lg">
                    No lead sources added yet.
                  </div>
                )}
              </>
            )}
            {activesettings === "products" && (
              <>
                <div className="flex justify-end mb-4">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md shadow text-sm sm:text-base"
                    onClick={() => dispatch(toggleproductsModal())}
                  >
                    + Add new
                  </button>
                </div>
                {fetchproducts.isLoading ? (
                  <Spinner />
                ) : fetchproducts.data?.Products?.length > 0 ? (
                  <div className="flex flex-col w-full">
                    <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-x-auto">
                      <table className="min-w-full text-xs sm:text-sm">
                        <thead className="bg-gray-200 text-gray-700">
                          <tr>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">#</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Product</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Duration</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Amount</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Edit</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Active</th>
                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fetchproducts.data.Products.map((product, index) => (
                            <tr key={product._id} className="border-b">
                              <td className="px-2 sm:px-6 py-2 sm:py-3">{index + 1}</td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3 truncate">{product.title}</td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3 truncate">{product.duration}</td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3 truncate">{product.amount}</td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3">
                                <button
                                  className="text-blue-600 hover:text-blue-800 text-base sm:text-lg"
                                  onClick={() => dispatch(toggleproductseditModal(product))}
                                >
                                  <FaEdit />
                                </button>
                              </td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3">
                                <label className="relative inline-flex items-center cursor-pointer w-10 sm:w-11 h-5 sm:h-6">
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={!!product?.active}
                                    onChange={(e) => handleactiveproduct(product._id, e.target.checked)}
                                  />
                                  <div className="w-10 sm:w-11 h-5 sm:h-6 bg-red-600 rounded-full peer-checked:bg-green-600 transition-colors duration-300"></div>
                                  <div className="absolute left-1 top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"></div>
                                </label>
                              </td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3">
                                <button
                                  className="text-red-600 hover:text-red-800 text-base sm:text-lg"
                                  onClick={() => handledeleteproduct(product._id)}
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 text-sm sm:text-lg">
                    No products added yet.
                  </div>
                )}
              </>
            )}
            {activesettings === "others" && (
              <>
                <div className="flex flex-col w-full">
                  <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full text-xs sm:text-sm">
                      <thead className="bg-gray-200 text-gray-700">
                        <tr>
                          <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Activity</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Active</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-2 sm:px-6 py-2 sm:py-3 truncate">Activate Next FollowUp Date</td>
                          <td className="px-2 sm:px-6 py-2 sm:py-3">
                            <label className="relative inline-flex items-center cursor-pointer w-10 sm:w-11 h-5 sm:h-6">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={!!fetchnextfollowup?.data?.setting?.isnextfollowupActive}
                                onChange={(e) => handleactivatenextfollowup(e.target.checked)}
                              />
                              <div className="w-10 sm:w-11 h-5 sm:h-6 bg-red-600 rounded-full peer-checked:bg-green-600 transition-colors duration-300"></div>
                              <div className="absolute left-1 top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"></div>
                            </label>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table className="min-w-full text-xs sm:text-sm mt-4">
                      <thead className="bg-gray-200 text-gray-700">
                        <tr>
                          <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Permission</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fetchPermission?.data?.getPermission?.map((permission, index) => (
                          <tr className="border-b" key={permission._id}>
                            <td className="px-2 sm:px-6 py-2 sm:py-3 truncate">{permission.title}</td>
                            <td className="px-2 sm:px-6 py-2 sm:py-3">
                              <label className="relative inline-flex items-center cursor-pointer w-10 sm:w-11 h-5 sm:h-6">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={!!permission?.active}
                                  onChange={(e) => handleactivepermission(permission._id, e.target.checked)}
                                />
                                <div className="w-10 sm:w-11 h-5 sm:h-6 bg-red-600 rounded-full peer-checked:bg-green-600 transition-colors duration-300"></div>
                                <div className="absolute left-1 top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"></div>
                              </label>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Gstmodal/>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <AnimatePresence>
          {iscustomerstatusModal && (
            <motion.div
              key="customerstatus"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
            >
              <motion.div className="absolute inset-0 bg-black opacity-50" />
              <div className="relative z-10 w-full max-w-md sm:max-w-lg">
                <Customerstatusmodal />
              </div>
            </motion.div>
          )}
          {iscustomerstatuseditModal && (
            <motion.div
              key="customerstatusedit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
            >
              <motion.div className="absolute inset-0 bg-black opacity-50" />
              <div className="relative z-10 w-full max-w-md sm:max-w-lg">
                <Customerstatuseditmodal />
              </div>
            </motion.div>
          )}
          {isgsteditModal && (
            <motion.div
              key="gstedit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
            >
              <motion.div className="absolute inset-0 bg-black opacity-50" />
              <div className="relative z-10 w-full max-w-md sm:max-w-lg">
                <Gsteditmodal />
              </div>
            </motion.div>
          )}
          {isdocumentModal && (
            <motion.div
              key="document"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
            >
              <motion.div className="absolute inset-0 bg-black opacity-50" />
              <div className="relative z-10 w-full max-w-md sm:max-w-lg">
                <Documentmodal />
              </div>
            </motion.div>
          )}
          {isdocumenteditModal && (
            <motion.div
              key="documentedit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
            >
              <motion.div className="absolute inset-0 bg-black opacity-50" />
              <div className="relative z-10 w-full max-w-md sm:max-w-lg">
                <Documenteditmodal />
              </div>
            </motion.div>
          )}
          {isproductsModal && (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
            >
              <motion.div className="absolute inset-0 bg-black opacity-50" />
              <div className="relative z-10 w-full max-w-md sm:max-w-lg">
                <ProductAddModal />
              </div>
            </motion.div>
          )}
          {isproductseditModal && (
            <motion.div
              key="productsedit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
            >
              <motion.div className="absolute inset-0 bg-black opacity-50" />
              <div className="relative z-10 w-full max-w-md sm:max-w-lg">
                <ProductEditModal />
              </div>
            </motion.div>
          )}
          {isleadsourceModal && (
            <motion.div
              key="leadsource"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
            >
              <motion.div className="absolute inset-0 bg-black opacity-50" />
              <div className="relative z-10 w-full max-w-md sm:max-w-lg">
                <Leadsourcemodal />
              </div>
            </motion.div>
          )}
          {isleadsourceeditModal && (
            <motion.div
              key="leadsourceedit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
            >
              <motion.div className="absolute inset-0 bg-black opacity-50" />
              <div className="relative z-10 w-full max-w-md sm:max-w-lg">
                <Leadsourceeditmodal />
              </div>
            </motion.div>
          )}
          {isleadformModal && (
            <motion.div
              key="leadform"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
            >
              <motion.div className="absolute inset-0 bg-black opacity-50" />
              <div className="relative z-10 w-full max-w-md sm:max-w-lg">
                <Leadformfieldsmodal />
              </div>
            </motion.div>
          )}
          {isleadformeditModal && (
            <motion.div
              key="leadformedit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
            >
              <motion.div className="absolute inset-0 bg-black opacity-50" />
              <div className="relative z-10 w-full max-w-md sm:max-w-lg">
                <Leadformfieldseditmodal />
              </div>
            </motion.div>
          )}
          {deletesuccessmodal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div className="absolute inset-0 bg-black opacity-30" />
              <motion.div
                className="relative z-10 bg-green-200 text-green-800 px-6 sm:px-10 py-4 sm:py-6 rounded-xl shadow-xl text-sm sm:text-base font-semibold w-full max-w-xs sm:max-w-sm h-[100px] sm:h-[120px] flex items-center justify-center text-center"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                ✅ Deleted Successfully!
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Settings;