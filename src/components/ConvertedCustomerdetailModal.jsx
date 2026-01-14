import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleConvertedcustomerdetailmodal,
  toggleconvertedleadeditModal,
} from "../redux/modalSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { updateuserleadform } from "../services/leadsRouter";
import { deletecustomer } from "../services/customersRouter";
import { listleadsettingsformfields } from "../services/settingservices/leadFormFieldsSettingsRouter";
import {
  addpaymentstatus,
  editpaymentstatus,
  getpaymentstatus,
} from "../services/paymentstatusRouter";
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
  faMoneyBill,
  faMailBulk,
} from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import Spinner from "./Spinner";
import Convertedleadeditmodal from "./Convertedleadeditmodal";
import PaymentAddModel from "./payments/PaymentAddModel";

function ConvertedCustomerdetailModal() {
  const dispatch = useDispatch();
  const queryclient = useQueryClient();
  const selectedcustomer = useSelector((state) => state.modal.selectedCustomer);
  // console.log(selectedcustomer,"selectedcustomer from customer")
  const selectedlead = useSelector((state) => state.modal.selectedLead);

  const isConvertededitmodal = useSelector(
    (state) => state.modal.convertedleadeditModal
  );
  const role = useSelector((state) => state.auth.role);
  const metadata = useSelector((state) => state.auth.metadataUser);

  const [showconfirm, setshowconfirm] = useState(false);
  const [statussuccessmodal, setstatussuccessmodal] = useState(false);
  const [updatesuccessmodal, setupdatesuccessmodal] = useState(false);
  const [paymentsuccessmodal, setpaymentsuccessmodal] = useState(false);
  const [activeTab, setactiveTab] = useState("Details");

  const scrollContainerRef = useRef(null);

  // Fetch payment details for the selected customer
  const { data: paymentDetails, isLoading: paymentLoading } = useQuery({
    queryKey: ["Customer Payment Status", selectedcustomer?._id],
    queryFn: () => getpaymentstatus(selectedcustomer?._id),
    enabled: !!selectedcustomer?._id && activeTab === "Payment",
  });

  const deletingCustomers = useMutation({
    mutationKey: ["Deleting Customers"],
    mutationFn: deletecustomer,
    onSuccess: () => {
      queryclient.invalidateQueries(["List converted customers"]);
    },
  });

  const fetchleadforms = useQuery({
    queryKey: ["List Form Fields"],
    queryFn: listleadsettingsformfields,
  });

  // updating lead form daatas .......................................................
  const updatinguserleadform = useMutation({
    mutationKey: ["Update user leadform"],
    mutationFn: updateuserleadform,
    onSuccess: () => {
      queryclient.invalidateQueries(["List Form Fields"]);
    },
  });

  const addPaymentStatus = useMutation({
    mutationKey: ["Add Payment Status"],
    mutationFn: ({
      customerId,
      paymentdate,
      paymentpaid,
      totalpayment,
      paymentmode,
    }) =>
      paymentDetails?.data
        ? editpaymentstatus(paymentDetails.data._id, {
            paymentdate,
            paymentpaid,
            totalpayment,
            paymentmode,
          })
        : addpaymentstatus({
            customerId,
            paymentdate,
            paymentpaid,
            totalpayment,
            paymentmode,
          }),
    onSuccess: () => {
      setpaymentsuccessmodal(true);
      setTimeout(() => {
        setpaymentsuccessmodal(false);
      }, 2000);
      queryclient.invalidateQueries([
        "Customer Payment Status",
        selectedcustomer?._id,
      ]);
      queryclient.invalidateQueries(["List converted customers"]); // Refresh customer list
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add or update payment";
      paymentForm.setErrors({ api: errorMessage });
    },
  });

  const handleconfirm = () => setshowconfirm(true);
  const closeconfirm = () => setshowconfirm(false);

  const confirmcustomerdelete = async () => {
    await deletingCustomers.mutateAsync(selectedcustomer._id);
    setshowconfirm(false);
    setstatussuccessmodal(true);
    setTimeout(() => {
      setstatussuccessmodal(false);
      dispatch(toggleConvertedcustomerdetailmodal(null));
    }, 2000);
  };

  const filteredleadform = fetchleadforms?.data?.getLeadform?.filter(
    (leadform) => leadform.active
  );

  const updateuserleadsform = useFormik({
    enableReinitialize: true,
    initialValues: {
      userDetails:
        filteredleadform?.map((leadform) => {
          const matchedField = selectedcustomer?.userDetails?.find(
            (detail) => detail.leadFormId === leadform._id
          );
          return {
            leadFormId: leadform._id,
            value: matchedField?.value || "",
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
        id: selectedcustomer._id,
        userDetails: formData,
      });
      setupdatesuccessmodal(true);
      setTimeout(() => {
        setupdatesuccessmodal(false);
        dispatch(toggleConvertedcustomerdetailmodal(null));
      }, 2000);
    },
  });

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        dispatch(toggleConvertedcustomerdetailmodal(null));
      }
    };

    window.addEventListener("keydown", handleEscKey);

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [dispatch]);
  //
  const paymentForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      paymentdate: paymentDetails?.data?.date_of_payment
        ? new Date(paymentDetails.data.date_of_payment)
            .toISOString()
            .split("T")[0]
        : new Date().toISOString().split("T")[0], // Default to today
      paymentpaid: paymentDetails?.data?.payment_paid || "",
      totalpayment: paymentDetails?.data?.total_payment || "",
      paymentmode: paymentDetails?.data?.payment_mode || "cash", // Default to 'cash'
    },
    validationSchema: Yup.object({
      paymentpaid: Yup.number()
        .required("Payment paid is required")
        .min(0, "Payment paid must be a positive number"),
      totalpayment: Yup.number()
        .required("Total payment is required")
        .min(0, "Total payment must be a positive number"),
      paymentmode: Yup.string()
        .required("Payment mode is required")
        .oneOf(["cash", "card", "online"], "Invalid payment mode"),
      paymentdate: Yup.date().nullable(),
      nextPaymentDate: Yup.date().nullable(),
    }),
    onSubmit: async (values) => {
      try {
        await addPaymentStatus.mutateAsync({
          customerId: selectedcustomer._id,
          paymentdate: values.paymentdate || undefined,
          paymentpaid: Number(values.paymentpaid),
          totalpayment: Number(values.totalpayment),
          paymentmode: values.paymentmode,
        });
        // Form is not reset to allow viewing updated values
      } catch (error) {
        // Error handled in onError of useMutation
      }
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

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center  bg-black/70 z-50 p-2 sm:p-0 h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl h-[620px] max-w-md sm:max-w-lg md:max-w-3xl border border-gray-200 font-['Inter',sans-serif]"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {(deletingCustomers.isPending ||
            fetchleadforms.isLoading ||
            updatinguserleadform.isPending ||
            addPaymentStatus.isPending ||
            paymentLoading) && (
            <div className="absolute inset-0 flex items-center  justify-center bg-white/80 z-50">
              <Spinner />
            </div>
          )}
          <div
            ref={scrollContainerRef}
            className="  max-h-[600px] overflow-y-auto !important scroll-smooth  -webkit-overflow-scrolling-touch"
          >
            {/* Header */}
            <div className="sticky top-0 z-20 bg-gradient-to-r from-[#00B5A6] to-[#4e8f4c] text-white p-4 sm:p-5 rounded-t-2xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center">
              {/* Left: Customer details */}
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-xl sm:text-2xl"
                />
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                    {selectedcustomer?.name || "Converted Customer Details"}
                  </h2>
                  <p className="text-sm sm:text-base mt-1 flex items-center gap-1">
                    <FontAwesomeIcon icon={faPhone} className="text-sm" />
                    {selectedcustomer?.mobile || "N/A"}
                  </p>
                </div>
              </div>

              {/* Right: Action buttons */}
              <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-0">
                {role === "Admin" && !metadata && (
                  <button
                    onClick={handleconfirm}
                    title="Delete"
                    className="text-white hover:bg-white/20 p-1.5 rounded-full transition-all duration-300 transform hover:scale-110"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-base" />
                  </button>
                )}

                {!metadata && (
                  <button
                    onClick={() =>
                      dispatch(toggleconvertedleadeditModal(selectedcustomer))
                    }
                    title="Edit"
                    className="text-white hover:bg-white/20 p-1.5 rounded-full transition-all duration-300 transform hover:scale-110"
                  >
                    <FontAwesomeIcon icon={faEdit} className="text-base" />
                  </button>
                )}

                <button
                  onClick={() =>
                    dispatch(toggleConvertedcustomerdetailmodal(null))
                  }
                  className="text-white hover:bg-white/20 p-1.5 rounded-full transition-all duration-300 transform hover:scale-110"
                >
                  <FontAwesomeIcon icon={faTimesCircle} className="text-lg" />
                </button>
              </div>
            </div>
            {/* Lead Info */}
            <div className="px-4 sm:px-6 pt-4 pb-3 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base text-gray-700 mb-4">
                {/* Left Column */}
                <div className="space-y-3">
                  <p className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-[#00B5A6] w-4"
                    />
                    <strong className="font-semibold text-gray-800">
                      Created By:
                    </strong>
                    <span className="text-gray-600">
                      {selectedcustomer?.createdBy?.name || "N/A"}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faTag}
                      className="text-[#00B5A6] w-4"
                    />
                    <strong className="font-semibold text-gray-800">
                      Source:
                    </strong>
                    <span className="text-gray-600">
                      {selectedcustomer?.leadId?.source?.title || "N/A"}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faDollarSign}
                      className="text-[#00B5A6] w-4"
                    />
                    <strong className="font-semibold text-gray-800">
                      Lead Value:
                    </strong>
                    <span className="text-gray-600">
                      {selectedcustomer?.leadId?.leadvalue || "Not Given"}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="text-[#00B5A6] w-4"
                    />
                    <strong className="font-semibold text-gray-800">
                      Mobile:
                    </strong>
                    <span className="text-gray-600">
                      {selectedcustomer?.mobile || "Not Given"}
                    </span>
                  </p>
                </div>

                {/* Right Column */}
                <div className="text-left sm:text-right space-y-3">
                  <p className="flex sm:justify-end items-center gap-2">
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="text-[#00B5A6] w-4"
                    />
                    <strong className="font-semibold text-gray-800">
                      Date:
                    </strong>
                    <span className="text-gray-600 ml-1">
                      {selectedcustomer?.createdAt
                        ? new Date(
                            selectedcustomer.createdAt
                          ).toLocaleDateString("en-US")
                        : "N/A"}
                    </span>
                  </p>
                  <p className="flex sm:justify-end items-center gap-2">
                    <FontAwesomeIcon
                      icon={faMailBulk}
                      className="text-[#00B5A6] w-4"
                    />
                    <strong className="font-semibold text-gray-800">
                      Email:
                    </strong>
                    <span className="text-gray-600">
                      {selectedcustomer?.email || "N/A"}
                    </span>
                  </p>
                </div>
              </div>
              {/* Form Container */}
              <div className="bg-white p-4 sm:p-6 rounded-b-2xl shadow-lg relative">
                  <PaymentAddModel
                    customerId={selectedcustomer?._id}
                    productId={selectedcustomer?.product}
                  />
              </div>
            </div>
          </div>

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
                    Are you sure you want to delete this customer?
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={confirmcustomerdelete}
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
                  Customer deleted successfully!
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
            {paymentsuccessmodal && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div className="absolute inset-0 bg-black/40" />
                <motion.div
                  className="relative z-10 bg-blue-100 text-blue-800 px-5 py-3 rounded-2xl shadow-xl text-xs font-semibold w-full max-w-xs flex items-center justify-center gap-1.5"
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.7 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-blue-600"
                  />
                  Payment updated successfully!
                </motion.div>
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

export default ConvertedCustomerdetailModal;
