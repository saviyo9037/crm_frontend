import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleconvertedleadeditModal,
  toggleCustomerdetailmodal,
  toggleCustomereditmodal,
} from "../redux/modalSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { motion, AnimatePresence } from "framer-motion";
import {
  listleads,
  setnextfollowup,
  updateleadstatus,
  updateuserleadform,
} from "../services/leadsRouter";
import { deletecustomer } from "../services/customersRouter";
import { deletestaff } from "../services/staffRouter";
import CustomereditModal from "./CustomereditModal";
import { listleadsettingsformfields } from "../services/settingservices/leadFormFieldsSettingsRouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faUser,
  faPhone,
  faCalendar,
  faTag,
  faDollarSign,
  faFileDownload,
  faCheckCircle,
  faTimesCircle,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import Spinner from "./Spinner";
import Convertedleadeditmodal from "./Convertedleadeditmodal";
import { getnextfollowup } from "../services/nextfollowupRouter";
import { User } from "lucide-react";
import { getpaymentDetails } from "../services/paymentstatusRouter";
import FollowupLead from "./FollowupLead";
import { getFollowupsByLead } from "../services/followupRouter";

// import { getallpaymentstatus, getallpaymentstatus } from "../services/paymentstatusRouter";

function Customerdetailmodal() {
  const dispatch = useDispatch();
  const queryclient = useQueryClient();
  const selectedlead = useSelector((state) => state.modal.selectedLead);
  const isCustomereditmodal = useSelector(
    (state) => state.modal.customereditModal
  );
  const isConvertededitmodal = useSelector(
    (state) => state.modal.convertedleadeditModal
  );

  const role = useSelector((state) => state.auth.role);
  const metadata = useSelector((state) => state.auth.metadataUser);

  const [showconfirm, setshowconfirm] = useState(false);
  const [statussuccessmodal, setstatussuccessmodal] = useState(false);
  const [updatesuccessmodal, setupdatesuccessmodal] = useState(false);
  const [convertsuccessmodal, setconvertsuccessmodal] = useState(false);
  const [followupsuccess, setfollowupsuccess] = useState(false);
  const [nextFollowupdate, setnextFollowupdate] = useState("");
  const [dateerror, setdateerror] = useState("");
  const [activeTab, setActiveTab] = useState("personal");
  const [personalTab, setPersonalTab] = useState("personal");
  const [currentpage, setCurrentPage] = useState(1);
  const scrollContainerRef = useRef(null);
  const leadsperpage = 10;
  const [showFollowup, setShowFollowup] = useState(false);
  const {
    data: paymentDetailsData,
    isLoading: isPaymentDetailsLoading,
    isError: isPaymentDetailsError,
    error: paymentDetailsError,
  } = useQuery({
    queryKey: ["paymentDetails", selectedlead?._id], // ✅ Dynamic key
    queryFn: () => getpaymentDetails(selectedlead?._id), // ✅ Pass lead ID
    enabled: !!selectedlead?._id, // ✅ Only run when lead selected
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const [followups, setFollowups] = useState([]);

  // ✅ Fetch followups when selected lead changes
  useEffect(() => {
    if (selectedlead?._id) {
      getFollowupsByLead(selectedlead._id)
        .then((res) => setFollowups(res))
        .catch((err) => console.error("Failed to load followups:", err));
    }
  }, [selectedlead, showFollowup]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["listleadss"],
    queryFn: listleads,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const deletingLeads = useMutation({
    mutationKey: ["Deleting Leads"],
    mutationFn: deletestaff,
    onSuccess: () => {
      queryclient.invalidateQueries(["Listleads"]);
    },
  });

  // Inside Customerdetailmodal
  const { data: followupsData, isLoading: isFollowupsLoading } = useQuery({
    queryKey: ["followups", selectedlead?._id],
    queryFn: () => getnextfollowup(selectedlead?._id),
    enabled: !!selectedlead?._id,
  });

  const markFollowupDone = useMutation({
    mutationKey: ["Mark Followup Done"],
    mutationFn: (id) =>
      updateleadstatus({ followupId: id, status: "completed" }), // Update API accordingly
    onSuccess: () => {
      queryclient.invalidateQueries(["followups", selectedlead?._id]);
    },
  });

  const handleMarkDone = (id) => {
    markFollowupDone.mutate(id);
  };
  const canEdit =
    metadata?.permissions?.includes("editLead") ||
    ["Admin", "Sub-Admin", "Agent"].includes(role);
  const canDelete =
    metadata?.permissions?.includes("deleteLead") ||
    ["Admin", "Sub-Admin", "Agent"].includes(role);
  const canUpdate =
    metadata?.permissions?.includes("updateLead") ||
    ["Admin", "Sub-Admin", "Agent"].includes(role);
  const canConvert =
    metadata?.permissions?.includes("ConvertedLead") ||
    ["Admin", "Sub-Admin", "Agent"].includes(role);
  const deletingCustomers = useMutation({
    mutationKey: ["Deleting Customers"],
    mutationFn: deletecustomer,
    onSuccess: () => {
      queryclient.invalidateQueries(["List converted customers"]);
    },
  });
  useEffect(() => {
    setActiveTab("personal");
    if (selectedlead?.status === "new") {
      convertingcustomer.mutate(
        {
          leadId: selectedlead._id,
          status: "open",
        },
        {
          onSuccess: () => {
            queryclient.invalidateQueries(["listleads"]);
          },
          onError: (err) => console.log(err),
        }
      );
    }
  }, [selectedlead]);
  const convertingcustomer = useMutation({
    mutationKey: ["Converting Customer"],
    mutationFn: updateleadstatus,
    onSuccess: () => {
      queryclient.invalidateQueries(["Listleads"]);
    },
  });
  const updatingnextfollowup = useMutation({
    mutationKey: ["Set Nextfollowup"],
    mutationFn: setnextfollowup,
    onSuccess: () => {
      queryclient.invalidateQueries(["Listleads"]);
    },
  });

  const fetchleadforms = useQuery({
    queryKey: ["List Form Fields"],
    queryFn: listleadsettingsformfields,
  });

  const updatinguserleadform = useMutation({
    mutationKey: ["Update user leadform"],
    mutationFn: updateuserleadform,
    onSuccess: () => {
      queryclient.invalidateQueries(["List Form Fields"]);
    },
  });

  const handleconfirm = () => setshowconfirm(true);
  const closeconfirm = () => setshowconfirm(false);

  const confirmdelete = async () => {
    await deletingLeads.mutateAsync(selectedlead._id);
    setshowconfirm(false);
    setstatussuccessmodal(true);
    setTimeout(() => {
      setstatussuccessmodal(false);
      dispatch(toggleCustomerdetailmodal(null));
    }, 2000);
  };

  const confirmcustomerdelete = async () => {
    await deletingCustomers.mutateAsync(selectedlead._id);
    setshowconfirm(false);
    setstatussuccessmodal(true);
    setTimeout(() => {
      setstatussuccessmodal(false);
      dispatch(toggleCustomerdetailmodal(null));
    }, 2000);
  };

  const convertcustomer = async (leadId, status) => {
    await convertingcustomer.mutateAsync({ leadId, status });
    setconvertsuccessmodal(true);
    setTimeout(() => {
      setconvertsuccessmodal(false);
      dispatch(toggleCustomerdetailmodal(null));
    }, 2000);
  };
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        dispatch(toggleCustomerdetailmodal(null));
      }
    };

    window.addEventListener("keydown", handleEscKey);

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [dispatch]);
  const handlenextfollowup = async () => {
    if (!nextFollowupdate) {
      setdateerror("Please select a date");
      return;
    }

    // Validate year range (4 digits max, reasonable range)
    const selectedDate = new Date(nextFollowupdate);
    const year = selectedDate.getFullYear();
    const currentYear = new Date().getFullYear();

    if (year < 1900 || year > currentYear + 10) {
      setdateerror("Year must be between 1900 and " + (currentYear + 10));
      return;
    }

    const today = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setdateerror("Next follow-up date cannot be in the past");
      return;
    }

    setdateerror("");

    try {
      await updatingnextfollowup.mutateAsync({
        id: selectedlead._id,
        nextFollowUp: [
          {
            nextFollowUpDate: nextFollowupdate,
            description: "Follow-up scheduled",
            status: "pending",
          },
        ],
      });

      setfollowupsuccess(true);
      setTimeout(() => {
        setfollowupsuccess(false);
        dispatch(toggleCustomerdetailmodal(null));
      }, 2000);
    } catch (err) {
      console.error("Error updating follow-up:", err);
      setdateerror("Something went wrong while updating follow-up.");
    }
  };

  const filteredleadform = fetchleadforms?.data?.getLeadform?.filter(
    (leadform) => leadform.active
  );
  const updateuserleadsform = useFormik({
    enableReinitialize: true,
    initialValues: {
      userDetails:
        filteredleadform?.map((leadform) => {
          const matchedField = selectedlead?.userDetails?.find(
            (detail) => detail.leadFormId === leadform._id
          );
          return {
            leadFormId: leadform._id,
            value: matchedField?.value,
          };
        }) || [],
    },
    onSubmit: async (values) => {
      const formData = new FormData();

      values.userDetails.forEach((item) => {
        const key = item.leadFormId;
        formData.append(key, item.value);
      });

      await updatinguserleadform.mutateAsync({
        id: selectedlead._id,
        userDetails: formData,
      });
      setupdatesuccessmodal(true);
      setTimeout(() => {
        setupdatesuccessmodal(false);
        dispatch(toggleCustomerdetailmodal(null));
      }, 2000);
    },
  });

  const handleDownload = (fileUrl) => {
    if (!fileUrl) {
      console.error("Invalid file URL");
      return;
    }
    const extractFileName = (url) => {
      const decodedUrl = decodeURIComponent(url);
      const urlParts = decodedUrl.split("/");
      return urlParts[urlParts.length - 1].replace(/^\d+-/, "");
    };

    const fileName = extractFileName(fileUrl);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchnextfollowup = useQuery({
    queryKey: ["Get next followup"],
    queryFn: getnextfollowup,
  });

  useEffect(() => {}, [filteredleadform, fetchnextfollowup?.data]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextfollowupDate = selectedlead?.nextFollowUp
    ? new Date(selectedlead.nextFollowUp)
    : null;
  if (nextfollowupDate) {
    nextfollowupDate.setHours(0, 0, 0, 0);
  }

  const isDateover = nextfollowupDate && nextfollowupDate < today;

  const nextfollowupUpdatedrole = selectedlead?.nextfollowupupdatedBy?.role;

  const roleHeirarchy = {
    Admin: 3,
    "Sub-Admin": 2,
    Agent: 1,
  };

  const currentRolepower = roleHeirarchy[role] || 0;
  const updatedRolepower = roleHeirarchy[nextfollowupUpdatedrole] || 0;
  const isdisabled = currentRolepower < updatedRolepower && !isDateover;

  const [dynamicHeight, setDynamicHeight] = useState(700); // initial height

  useEffect(() => {
    const scrollEl = scrollContainerRef.current;
    if (!scrollEl) return;

    const handleScroll = () => {
      const scrollTop = scrollEl.scrollTop;

      // Min height limit: 400px, Max height: 700px
      const newHeight = Math.max(400, 700 - scrollTop / 2);
      setDynamicHeight(newHeight);
    };

    scrollEl.addEventListener("scroll", handleScroll);
    return () => scrollEl.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-2 sm:p-0 h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-3xl border border-gray-200 font-['Inter',sans-serif]"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {(deletingLeads.isPending ||
            deletingCustomers.isPending ||
            convertingcustomer.isPending ||
            fetchleadforms.isLoading ||
            updatinguserleadform.isPending) && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50 rounded ">
              <Spinner />
            </div>
          )}
          <div
            ref={scrollContainerRef}
            className="max-h-[700px] overflow-y-auto !important scroll-smoot -webkit-overflow-scrolling-touch"
          >
            {/* Header */}
            <div className="sticky top-0 z-20 bg-gradient-to-r from-green-600 to-blue-700 text-white p-5 sm:p-6 rounded-t-[10px] shadow-md">
              {/* Top row: user details + action buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Left: User details */}
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-full">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-2xl sm:text-3xl"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-wide">
                      {selectedlead?.name || "Customer Details"}
                    </h2>
                    <p className="text-sm sm:text-base mt-1 flex items-center gap-2 text-white/90">
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="text-sm opacity-80"
                      />
                      {selectedlead?.mobile || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Right: Action buttons */}
                <div className="flex items-center gap-3">
                  {selectedlead?.role === "user" &&
                    selectedlead?.status !== "converted" &&
                    canConvert && (
                      <button
                        onClick={() =>
                          convertcustomer(selectedlead?._id, "converted")
                        }
                        className="inline-flex items-center gap-2 bg-white text-green-700 hover:bg-green-50 px-4 py-2 rounded-full text-sm font-semibold shadow transition-all duration-300"
                      >
                        <FontAwesomeIcon icon={faCheckCircle} />
                        Convert
                      </button>
                    )}

                  {canDelete && (
                    <button
                      onClick={handleconfirm}
                      title="Delete"
                      className="hover:bg-white/20 p-2 rounded-full transition-all duration-200"
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-base" />
                    </button>
                  )}

                  {canEdit && (
                    <button
                      onClick={() => {
                        if (selectedlead?.leadId?.status === "converted") {
                          dispatch(toggleconvertedleadeditModal(selectedlead));
                        } else {
                          dispatch(toggleCustomereditmodal(selectedlead));
                        }
                      }}
                      title="Edit"
                      className="hover:bg-white/20 p-2 rounded-full transition-all duration-200"
                    >
                      <FontAwesomeIcon icon={faEdit} className="text-base" />
                    </button>
                  )}

                  <button
                    onClick={() => dispatch(toggleCustomerdetailmodal(null))}
                    className="hover:bg-white/20 p-2 rounded-full transition-all duration-200"
                  >
                    <FontAwesomeIcon icon={faTimesCircle} className="text-lg" />
                  </button>
                </div>
              </div>
            </div>

            {/* Lead Info */}

            <div className="px-4 sm:px-6 pt-4 pb-3  ">
              <div className="flex border-b border-gray-300 bg-white shadow-sm rounded-t-xl overflow-hidden">
                {["personal", "details", "followups"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-6 py-3 text-center  font-medium transition-all duration-200 
        ${
          activeTab === tab
            ? "bg-blue-600 text-white shadow-inner hover:scale-[1.02]"
            : "text-gray-600 hover:bg-gray-100 hover:scale-[1.02]"
        }`}
                  >
                    {tab === "personal" && (
                      <span className="text-sm sm:text-base  font-semibold tracking-wide">
                        Personal Details
                      </span>
                    )}
                    {tab === "details" && (
                      <span className=" text-sm sm:text-base font-semibold tracking-wide">
                        Details
                      </span>
                    )}
                    {tab === "followups" && (
                      <span className="text-sm sm:text-base font-semibold tracking-wide">
                        Follow-ups
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {activeTab === "personal" && (
                <div className="bg-white rounded-2xl rounded-t-[0] shadow-md border border-gray-200 p-6  space-y-6">
                  {/* Info Section */}
                  <div className="grid grid-cols-1transition-transform duration-200 hover:scale-[1.02] sm:grid-cols-2 gap-6 bg-white shadow-md rounded-xl p-5">
                    {/* Left Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="text-[#00B5A6] w-5 h-5"
                        />
                        <div>
                          <p className="text-gray-500 text-xs">Created By</p>
                          <p className="font-semibold text-gray-800">
                            {selectedlead?.createdBy?.name || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm mb-6">
                        <FontAwesomeIcon
                          icon={faTag}
                          className="text-[#00B5A6] w-5 h-5"
                        />
                        <div>
                          <p className="text-gray-500 text-xs">Source</p>
                          <p className="font-semibold text-gray-800">
                            {selectedlead?.source?.title || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex-col  sm:justify-end items-center gap-3 text-sm">
                      <div className="flex items-center gap-3 text-sm mb-6">
                        <FontAwesomeIcon
                          icon={faDollarSign}
                          className="text-[#00B5A6] w-5 h-5"
                        />
                        <div>
                          <p className="text-gray-500 text-xs">Lead Value</p>
                          <p className="font-semibold text-gray-800">
                            {selectedlead?.leadvalue || "Not Given"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <FontAwesomeIcon
                          icon={faCalendar}
                          className="text-[#00B5A6] w-5 h-5"
                        />
                        <div>
                          <p className="text-gray-500 text-xs">Date</p>
                          <p className="font-semibold text-gray-800">
                            {selectedlead?.createdAt
                              ? new Date(
                                  selectedlead.createdAt
                                ).toLocaleDateString("en-US")
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Follow-up Section */}

                  {/* Update Toggle */}

                  {/* Update Form */}
                </div>
              )}
              {activeTab === "details" && (
                <div className=" bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6 max-h-[600px] overflow-y-auto transition-all duration-300">
                  {selectedlead ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-100 text-sm text-gray-800 rounded-lg overflow-hidden">
                        {/* Table Header */}
                        <thead className="bg-gradient-to-r from-[#00B5A6]/30 to-[#0077B6]/30">
                          <tr className="text-[#004E48] font-semibold uppercase tracking-wide text-[13px]">
                            <th className="px-6 py-4 text-left">Agent</th>
                            <th className="px-6 py-4 text-left">Description</th>
                            <th className="px-6 py-4 text-left">
                              Enquiry Program
                            </th>
                            <th className="px-6 py-4 text-left">
                              Required Program
                            </th>
                            <th className="px-6 py-4 text-left">WhatsApp</th>
                            <th className="px-6 py-4 text-left">Status</th>
                          </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-200">
                          <tr className=" transition-all duration-200 even:bg-gray-50">
                            {/* Agent */}
                            <td className="px-6 py-3 text-[#0077B6] font-semibold whitespace-nowrap">
                              {/* {selectedlead.nextfollowupupdatedBy?.name ||
                                selectedlead.nextfollowupupdatedBy ||
                                "Not updated"} */}
                                 {selectedlead.assignedTo?.name ||
                                "N/A"}
                                {console.log("selecteedLEad",selectedlead)}
                            </td>

                            {/* Description */}
                            <td className="px-6 py-3 text-gray-700 max-w-[250px] break-words leading-relaxed">
                              {selectedlead.userDetails?.[2]?.value &&
                              selectedlead.userDetails?.[2]?.value !==
                                "undefined"
                                ? selectedlead.userDetails[2].value
                                : "No data"}
                            </td>

                            {/* Enquiry Program */}
                            <td className="px-6 py-3 text-[#2563EB] font-semibold">
                              {selectedlead.userDetails?.[4]?.value &&
                              selectedlead.userDetails?.[4]?.value !==
                                "undefined"
                                ? selectedlead.userDetails[4].value
                                : "No program"}
                            </td>

                            {/* Required Program */}
                            <td className="px-6 py-3 text-[#2563EB]  font-semibold">
                              {selectedlead.userDetails?.[1]?.value &&
                              selectedlead.userDetails?.[1]?.value !==
                                "undefined"
                                ? selectedlead.userDetails[1].value
                                : "No program"}
                            </td>

                            {/* WhatsApp */}
                            <td className="px-6 py-3 text-[#059669] font-semibold">
                              {selectedlead.userDetails?.[0]?.value &&
                              selectedlead.userDetails?.[0]?.value !==
                                "undefined"
                                ? selectedlead.userDetails[0].value
                                : "Nil"}
                            </td>

                            {/* Status */}
                            <td className="px-6 py-3 capitalize">
                              <span
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm
                    ${
                      selectedlead.status === "completed"
                        ? "bg-green-100 text-green-700 border-green-300"
                        : selectedlead.status === "pending"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                        : selectedlead.status === "cancelled"
                        ? "bg-red-100 text-red-700 border-red-300"
                        : "bg-gray-100 text-gray-700 border-gray-300"
                    }`}
                              >
                                {selectedlead.status || "N/A"}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8 italic">
                      No follow-up data available
                    </p>
                  )}
                </div>
              )}
              {activeTab === "followups" && (
                <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl rounded-t-[0px] shadow-lg border border-gray-200 p-6  transition-all duration-300">
                  <div className="mt-[10px] ml-[500px] mb-[10px] ">
                    <button
                      className="w-[150px] inline-flex items-center justify-center gap-2 bg-[#00B5A6] hover:bg-[#1E6DB0] text-white text-sm px-5 py-2.5 rounded-lg font-semibold shadow-md transition-all duration-300 hover:scale-105"
                      onClick={() => setShowFollowup(true)}
                    >
                      Follow-up
                    </button>
                  </div>

                  {fetchnextfollowup?.data?.setting?.isnextfollowupActive &&
                    (selectedlead?.status === "new" ||
                      selectedlead?.status === "open") && (
                      <div className="bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6] p-6 transition-transform duration-200 hover:scale-[1.02] rounded-2xl shadow-lg border border-gray-200 text-center">
                        {/* Heading */}
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center justify-center gap-2 mb-3">
                          <FontAwesomeIcon
                            icon={faCalendarCheck}
                            className="text-[#00B5A6]"
                          />
                          Next Follow-up Date
                        </h3>

                        {/* Date Info */}
                        <p className="text-xl font-bold text-gray-800 mb-4">
                          {selectedlead?.nextFollowUp?.length > 0
                            ? new Date(
                                selectedlead.nextFollowUp[
                                  selectedlead.nextFollowUp.length - 1
                                ]?.nextFollowUpDate
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "Follow-up not set"}
                        </p>

                        {/* Input & Button */}
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                          <input
                            id="followupDate"
                            type="date"
                            disabled={isdisabled}
                            value={nextFollowupdate}
                            onChange={(e) =>
                              setnextFollowupdate(e.target.value)
                            }
                            className="px-4 py-2 w-44 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#00B5A6] focus:border-[#00B5A6] disabled:bg-gray-100 transition-transform duration-200 hover:scale-[1.02]"
                          />

                          {!isdisabled && (
                            <button
                              type="button"
                              onClick={handlenextfollowup}
                              className="inline-flex items-center justify-center gap-2 bg-[#00B5A6] hover:bg-[#1E6DB0] text-white text-sm px-5 py-2.5 rounded-lg font-semibold shadow-md transition-all duration-300 hover:scale-105"
                            >
                              <FontAwesomeIcon icon={faCalendarCheck} />
                              Set
                            </button>
                          )}
                        </div>

                        {/* Error */}
                        {dateerror && (
                          <p className="text-red-600 text-xs mt-3 font-medium">
                            {dateerror}
                          </p>
                        )}

                        {/* Success */}
                        {followupsuccess && (
                          <p className="text-green-600 text-sm mt-3 font-medium">
                            Follow-up date set successfully!
                          </p>
                        )}
                      </div>
                    )}

                  <div className="overflow-x-auto mt-[10px]">
                    <table className="min-w-full border border-gray-200 text-sm text-gray-800">
                      <thead className="bg-gradient-to-r from-[#00B5A6]/20 to-[#0077B6]/20 border-b border-gray-300">
                        <tr className="text-[#004e48] font-semibold tracking-wide">
                          <th className="px-5 py-3 text-left">
                            Next Follow-Up
                          </th>
                          <th className="px-5 py-3 text-left">Agent</th>
                          <th className="px-5 py-3 text-left">Description</th>
                          <th className="px-5 py-3 text-left">Created Date</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-200">
                        {followups?.length > 0 ? (
                          followups.map((f, i) => (
                            <tr
                              key={i}
                              className="transition-all duration-200 even:bg-gray-50 hover:bg-gray-100"
                            >
                              <td className="px-6 py-3 text-gray-700 font-medium whitespace-nowrap">
                                {f.nextFollowUpDate
                                  ? new Date(
                                      f.nextFollowUpDate
                                    ).toLocaleDateString("en-GB")
                                  : "-"}
                              </td>
                              <td className="px-6 py-3 text-[#0077B6] font-semibold whitespace-nowrap">
                                {selectedlead?.createdBy?.name || "N/A"}
                              </td>
                              <td className="px-6 py-3 text-gray-700 text-left">
                                {f.description || "-"}
                              </td>
                              <td className="px-6 py-3 text-gray-700 font-medium whitespace-nowrap">
                                {new Date(f.createdAt).toLocaleDateString(
                                  "en-GB"
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="text-center py-5 text-gray-500 font-medium"
                            >
                              No follow-up records available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Follow-up Modal */}
                </div>
              )}{" "}
              {/* Left Column */}
            </div>
          </div>

          {showFollowup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
              <div className="bg-white p-6 rounded-xl shadow-lg relative max-w-lg w-full">
                <button
                  onClick={() => setShowFollowup(false)}
                  className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
                >
                  ×
                </button>

                <FollowupLead
                  leadId={selectedlead?._id}
                  onClose={() => setShowFollowup(false)}
                />
              </div>
            </div>
          )}

          {/* Confirmation Modals */}
          <AnimatePresence>
            {showconfirm && (
              <motion.div
                className="absolute inset-0 bg-black/80 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="bg-white rounded-2xl p-5 sm:p-6 shadow-xl text-center w-full max-w-xs"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center justify-center gap-1.5">
                    <FontAwesomeIcon icon={faTrash} className="text-red-600" />
                    Confirm Deletion
                  </h3>
                  <p className="text-xs text-gray-600 mb-4">
                    Are you sure you want to delete this lead?
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={
                        selectedlead?.role === "user"
                          ? confirmdelete
                          : confirmcustomerdelete
                      }
                      className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <FontAwesomeIcon icon={faCheckCircle} />
                      Yes
                    </button>
                    <button
                      onClick={closeconfirm}
                      className="inline-flex items-center gap-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <FontAwesomeIcon icon={faTimesCircle} />
                      No
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
            {statussuccessmodal && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div className="absolute inset-0 bg-black/40" />
                <motion.div
                  className="relative z-10 bg-green-100 text-green-800 px-5 py-3 rounded-2xl shadow-xl text-xs font-semibold w-full max-w-xs flex items-center justify-center gap-1.5"
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.7 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-600"
                  />
                  Lead deleted successfully!
                </motion.div>
              </motion.div>
            )}
            {convertsuccessmodal && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div className="absolute inset-0 bg-black/40" />
                <motion.div
                  className="relative z-10 bg-green-100 text-green-800 px-5 py-3 rounded-2xl shadow-xl text-xs font-semibold w-full max-w-xs flex items-center justify-center gap-1.5"
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.7 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-600"
                  />
                  Lead converted successfully!
                </motion.div>
              </motion.div>
            )}
            {updatesuccessmodal && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div className="absolute inset-0 bg-black/40" />
                <motion.div
                  className="relative z-10 bg-green-100 text-green-800 px-5 py-3 rounded-2xl shadow-xl text-xs font-semibold w-full max-w-xs flex items-center justify-center gap-1.5"
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.7 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-600"
                  />
                  Form updated successfully!
                </motion.div>
              </motion.div>
            )}
            {followupsuccess && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div className="absolute inset-0 bg-black/40" />
                <motion.div
                  className="relative z-10 bg-green-100 text-green-800 px-5 py-3 rounded-2xl shadow-xl text-xs font-semibold w-full max-w-xs flex items-center justify-center gap-1.5"
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.7 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-600"
                  />
                  Next followup updated!
                </motion.div>
              </motion.div>
            )}

            {isCustomereditmodal && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div className="absolute inset-0 bg-black/60" />
                <div className="relative z-10 w-full max-w-md sm:max-w-lg">
                  <CustomereditModal />
                </div>
              </motion.div>
            )}
            {isConvertededitmodal && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div className="absolute inset-0 bg-black/60" />
                <div className="relative z-10 w-full max-w-md sm:max-w-lg">
                  <Convertedleadeditmodal />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Customerdetailmodal;
