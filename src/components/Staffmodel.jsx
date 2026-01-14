import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { togglestaffmodal } from "../redux/modalSlice";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { FaUserPlus } from "react-icons/fa";
import { createstaff } from "../services/staffRouter";
import Spinner from "./Spinner";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

function Staffmodel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryclient = useQueryClient();

  const [showsuccess, setshowsuccess] = useState(false);

  const staff = useMutation({
    mutationKey: ["create staff"],
    mutationFn: createstaff,
    onSuccess: () => {
      queryclient.invalidateQueries(["fetch staffs"]);
      navigate("/agents");
    },
  });

  const staffvalidation = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
      .min(3, "Name must be at least 3 characters"),
    role: Yup.string().required("Role is required"),
    email: Yup.string().required("Email is required").email("Invalid email format"),
    mobile: Yup.string()
      .required("Mobile number is required")
      .matches(/^\+\d{7,14}$/, "Enter a valid phone number"),
  });

  const createStaffform = useFormik({
    initialValues: {
      name: "",
      role: "",
      email: "",
      mobile: "",
    },
    validationSchema: staffvalidation,
    onSubmit: async (values) => {
      await staff.mutateAsync(values);
      setshowsuccess(true);
      setTimeout(() => {
        dispatch(togglestaffmodal(null));
        setshowsuccess(false);
      }, 1000);
    },
  });

  // Handle phone input (convert to +countryCode format)
  const handlePhoneChange = (value) => {
    createStaffform.setFieldValue("mobile", `+${value}`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full max-w-md sm:max-w-lg md:max-w-3xl mx-auto rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden"
      >
        {staff.isPending && <Spinner />}

        {/* LEFT SECTION */}
        <div className="bg-gradient-to-b from-[#00B5A6] to-[#1E6DB0] w-full md:w-1/3 flex flex-col items-center justify-center p-6 text-white">
          <FaUserPlus className="text-6xl mb-3" />
          <h2 className="text-2xl font-bold">Add New Staff</h2>
          <p className="text-sm mt-2 text-center">
            Register Sub-admins or Agents to manage your leads & team.
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="relative w-full md:w-2/3 p-6 md:p-8">
          <button
            onClick={() => dispatch(togglestaffmodal())}
            className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500 transition"
          >
            &times;
          </button>

          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
            Enter Staff Details
          </h3>

          {staff.isError && (
            <p className="text-red-600 bg-red-100 p-3 rounded-md mb-4">
              {staff.error?.response?.data?.message}
            </p>
          )}

          <form onSubmit={createStaffform.handleSubmit} className="space-y-4">
            {/* NAME */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                {...createStaffform.getFieldProps("name")}
                className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
                placeholder="Enter staff name"
              />
              {createStaffform.touched.name && createStaffform.errors.name && (
                <p className="text-red-500 text-sm mt-1">{createStaffform.errors.name}</p>
              )}
            </div>

            {/* ROLE */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Role</label>
              <select
                {...createStaffform.getFieldProps("role")}
                className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select role</option>
                <option value="Sub-Admin">Sub-Admin</option>
                <option value="Agent">Agent</option>
              </select>
              {createStaffform.touched.role && createStaffform.errors.role && (
                <p className="text-red-500 text-sm mt-1">{createStaffform.errors.role}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                {...createStaffform.getFieldProps("email")}
                className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
                placeholder="Enter staff email"
              />
              {createStaffform.touched.email && createStaffform.errors.email && (
                <p className="text-red-500 text-sm mt-1">{createStaffform.errors.email}</p>
              )}
            </div>

            {/* MOBILE */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Mobile Number</label>
              <PhoneInput
                country={"in"}
                value={createStaffform.values.mobile.replace("+", "")}
                onChange={handlePhoneChange}
                enableSearch
                inputClass="!w-full !pl-17 !py-3 !border !border-gray-300 !rounded-lg placeholder-gray-400"
                buttonClass="!border-gray-300 !bg-white"
                containerClass="!w-full"
                placeholder="Enter phone number"
              />

              {createStaffform.touched.mobile && createStaffform.errors.mobile && (
                <p className="text-red-500 text-sm mt-2">{createStaffform.errors.mobile}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Register
            </button>
          </form>
        </div>
      </motion.div>

      {/* SUCCESS POPUP */}
      <AnimatePresence>
        {showsuccess && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black opacity-30" />

            <motion.div
              className="bg-green-200 text-green-800 px-10 py-6 rounded-xl shadow-xl font-semibold text-center"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              ✅ Staff added successfully!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Staffmodel;
