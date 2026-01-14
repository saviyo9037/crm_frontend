// import { useMutation, useQueryClient } from '@tanstack/react-query'
// import React, { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import * as Yup from 'yup'
// import { useFormik } from 'formik'
// import { togglestaffeditmodal } from '../redux/modalSlice'
// import { AnimatePresence, motion } from 'framer-motion'
// import { FaBell, FaUserEdit, FaUserPlus } from 'react-icons/fa'
// import { editstaff } from '../services/staffRouter'
// import Spinner from './Spinner'

// function Staffeditmodal() {
//     const dispatch = useDispatch()
//     const navigate = useNavigate()
//     const queryclient = useQueryClient()
//     const isSelectedstaff = useSelector((state) => state.modal.selectedStaff)

//     const [showsuccess, setshowsuccess] = useState(false)

//     const updatingstaff = useMutation({
//         mutationKey: ["Update staff"],
//         mutationFn: editstaff,
//         onSuccess: () => {
//             queryclient.invalidateQueries(["Updating staffs"])
//             navigate('/agents')
//         }
//     })

//     const staffeditvalidation = Yup.object({
//         name: Yup.string(),
//         email: Yup.string().matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Invalid email format"),
//         mobile: Yup.string().matches(/^\d{10}$/, "Mobile number must be 10 digits")
//     })

//     const updateStaffform = useFormik({
//         initialValues: {
//             name: isSelectedstaff?.name || '',
//             role: isSelectedstaff?.role || '',
//             email: '',
//             mobile: ''
//         },
//         validationSchema: staffeditvalidation,
//         onSubmit: async (values) => {
//             await updatingstaff.mutateAsync({ staffId: isSelectedstaff._id, staffdata: values })
//             setshowsuccess(true)
//             setTimeout(() => {
//                 dispatch(togglestaffeditmodal(null))
//                 setshowsuccess(false)
//             }, 1000);
//         }
//     })

//     return (
//         <div className='fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-0'>
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ duration: 0.4 }}
//                 className='bg-white w-full max-w-md sm:max-w-lg md:max-w-3xl mx-auto rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden'
//             >
//                 {updatingstaff.isPending &&
//                     <Spinner />
//                 }
//                 <div className="bg-gradient-to-b from-[#00B5A6] to-[#1E6DB0] w-full md:w-1/3 flex flex-col items-center justify-center p-4 sm:p-6 text-white">
//                     <FaUserPlus className='text-5xl sm:text-6xl md:text-[80px] mb-3 sm:mb-4' />
//                     <h2 className='text-lg sm:text-xl md:text-2xl font-bold'>Edit staff details</h2>
//                     <p className='text-xs sm:text-sm mt-2 text-center'>Edit Sub-admins or Agents details accordingly.</p>
//                 </div>
//                 <div className='relative w-full md:w-2/3 p-4 sm:p-6 md:p-8'>
//                     <button
//                         onClick={() => dispatch(togglestaffeditmodal())}
//                         className='absolute top-3 right-3 sm:top-4 sm:right-4 text-xl sm:text-2xl text-gray-400 hover:text-red-500 transition'
//                     >
//                         &times;
//                     </button>
//                     <h3 className='text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4'>Edit Staff Details</h3>

//                     {updatingstaff.isError && (
//                         <p className='text-red-600 bg-red-100 p-2 sm:p-3 rounded-md mb-3 sm:mb-4 text-sm sm:text-base'>{updatingstaff.error?.response?.data?.message}</p>
//                     )}

//                     <form onSubmit={updateStaffform.handleSubmit} className='space-y-3 sm:space-y-4'>
//                         <div>
//                             <input
//                                 type='text'
//                                 name='name'
//                                 value={updateStaffform.values.name}
//                                 {...updateStaffform.getFieldProps('name')}
//                                 className='border border-gray-300 p-2 sm:p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base'
//                                 placeholder='Enter the name'
//                             />
//                             {updateStaffform.touched.name && updateStaffform.errors.name && (
//                                 <p className='text-red-500 text-xs sm:text-sm mt-1'>{updateStaffform.errors.name}</p>
//                             )}
//                         </div>

//                         <div>
//                             <select
//                                 name='role'
//                                 value={updateStaffform.values.role}
//                                 disabled
//                                 {...updateStaffform.getFieldProps('role')}
//                                 className='border border-gray-300 p-2 sm:p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-200 cursor-not-allowed'
//                             >
//                                 <option value='' label='Select role' />
//                                 <option value='Sub-Admin' label='Sub-Admin' />
//                                 <option value='Agent' label='Agent' />
//                             </select>
//                             {updateStaffform.touched.role && updateStaffform.errors.role && (
//                                 <p className='text-red-500 text-xs sm:text-sm mt-1'>{updateStaffform.errors.role}</p>
//                             )}
//                         </div>

//                         <div>
//                             <input
//                                 type='email'
//                                 name='email'
//                                 value={updateStaffform.values.email}
//                                 {...updateStaffform.getFieldProps('email')}
//                                 className='border border-gray-300 p-2 sm:p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base'
//                                 placeholder='Enter the email'
//                             />
//                             {updateStaffform.touched.email && updateStaffform.errors.email && (
//                                 <p className='text-red-500 text-xs sm:text-sm mt-1'>{updateStaffform.errors.email}</p>
//                             )}
//                         </div>

//                         <div>
//                             <input
//                                 type='text'
//                                 name='mobile'
//                                 value={updateStaffform.values.mobile}
//                                 {...updateStaffform.getFieldProps('mobile')}
//                                 className='border border-gray-300 p-2 sm:p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base'
//                                 placeholder='Enter the mobile number'
//                             />
//                             {updateStaffform.touched.mobile && updateStaffform.errors.mobile && (
//                                 <p className='text-red-500 text-xs sm:text-sm mt-1'>{updateStaffform.errors.mobile}</p>
//                             )}
//                         </div>

//                         <button
//                             type='submit'
//                             className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base'
//                         >
//                             Update
//                         </button>
//                     </form>
//                 </div>
//             </motion.div>
//             <AnimatePresence>
//                 {showsuccess && (
//                     <motion.div
//                         className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                     >
//                         <motion.div className="absolute inset-0 bg-black opacity-30" />
//                         <motion.div
//                             className="relative z-10 bg-green-200 text-green-800 px-6 sm:px-10 py-4 sm:py-6 rounded-xl shadow-xl text-sm sm:text-base font-semibold w-full max-w-xs sm:max-w-sm h-[100px] sm:h-[120px] flex items-center justify-center text-center"
//                             initial={{ scale: 0.5 }}
//                             animate={{ scale: 1 }}
//                             exit={{ scale: 0.5 }}
//                             transition={{ type: 'spring', stiffness: 300, damping: 20 }}
//                         >
//                             ✅ Staff Edited successfully!
//                         </motion.div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </div>
//     )
// }

// export default Staffeditmodal


import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { togglestaffeditmodal } from "../redux/modalSlice";
import { AnimatePresence, motion } from "framer-motion";
import { FaBell, FaUserEdit, FaUserPlus } from "react-icons/fa";
import { editstaff } from "../services/staffRouter";
import Spinner from "./Spinner";
import { countryCodes } from "../utils/countryCodes";
import { extractCountryAndNumber } from "../utils/phoneUtils";

function Staffeditmodal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryclient = useQueryClient();
  const isSelectedstaff = useSelector((state) => state.modal.selectedStaff);

  const [showsuccess, setshowsuccess] = useState(false);

  const { isPending: isUpdatingStaff, isError: isStaffEditError, error: updateStaffError, mutateAsync: updateStaffMutation } = useMutation({
    mutationKey: ["Update staff"],
    mutationFn: editstaff,
    onSuccess: () => {
      queryclient.invalidateQueries(["listagents"]); // Invalidate listagents query after successful update
      // navigate("/agents"); // Removed navigation as per previous context, modal should close
    },
  });

  const staffeditvalidation = Yup.object({
    name: Yup.string(),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format"),
    mobile: Yup.string()
      .matches(/^[0-9]+$/, "Mobile number must contain only digits")
      .min(7, "Mobile number is too short")
      .max(15, "Mobile number is too long")
      .required("Mobile is required"),
  });

  const { countrycode, mobile } = extractCountryAndNumber(isSelectedstaff?.mobile);

  const updateStaffform = useFormik({
    initialValues: {
      name: isSelectedstaff?.name || "",
      email: isSelectedstaff?.email || "",
      mobile: mobile || "",
      countryCode: countrycode || "+91",
      role: isSelectedstaff?.role || "",
    },
    validationSchema: staffeditvalidation,
    onSubmit: async (values) => {
      let mobile = values.mobile.replace(/\s+/g, "");

      // Remove existing country code from mobile number if present
      if (mobile.startsWith(values.countryCode)) {
        mobile = mobile.substring(values.countryCode.length);
      }

      // Combine country code and mobile number
      const fullMobile = `${values.countryCode}${mobile}`;

      const payload = { ...values, mobile: fullMobile };

      try {
        await updateStaffMutation({
          staffId: isSelectedstaff._id,
          staffdata: payload,
        });
        setshowsuccess(true);
        setTimeout(() => {
          setshowsuccess(false);
          dispatch(togglestaffeditmodal());
        }, 2000);
      } catch (error) {
        console.error("Error updating staff:", error);
      }
    },
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full max-w-md sm:max-w-lg md:max-w-3xl mx-auto rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden"
      >
        {isUpdatingStaff && <Spinner />}
        <div className="bg-gradient-to-b from-[#00B5A6] to-[#1E6DB0] w-full md:w-1/3 flex flex-col items-center justify-center p-4 sm:p-6 text-white">
          <FaUserPlus className="text-5xl sm:text-6xl md:text-[80px] mb-3 sm:mb-4" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
            Edit staff details
          </h2>
          <p className="text-xs sm:text-sm mt-2 text-center">
            Edit Sub-admins or Agents details accordingly.
          </p>
        </div>
        <div className="relative w-full md:w-2/3 p-4 sm:p-6 md:p-8">
          <button
            onClick={() => dispatch(togglestaffeditmodal())}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-xl sm:text-2xl text-gray-400 hover:text-red-500 transition"
          >
            &times;
          </button>
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
            Edit Staff Details
          </h3>
 
          {isStaffEditError && (
            <p className="text-red-600 bg-red-100 p-2 sm:p-3 rounded-md mb-3 sm:mb-4 text-sm sm:text-base">
              {updateStaffError?.response?.data?.message}
            </p>
          )}
        <form
            onSubmit={updateStaffform.handleSubmit}
            className="space-y-3 sm:space-y-4"
          >
            <div>
              <input
                type="text"
                name="name"
                value={updateStaffform.values.name}
                {...updateStaffform.getFieldProps("name")}
                className="border border-gray-300 p-2 sm:p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                placeholder="Enter the name"
              />
              {updateStaffform.touched.name && updateStaffform.errors.name && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {updateStaffform.errors.name}
                </p>
              )}
            </div>

            <div>
              <select
                name="role"
                value={updateStaffform.values.role}
                disabled
                {...updateStaffform.getFieldProps("role")}
                className="border border-gray-300 p-2 sm:p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-200 cursor-not-allowed"
              >
                <option value="" label="Select role" />
                <option value="Sub-Admin" label="Sub-Admin" />
                <option value="Agent" label="Agent" />
              </select>
              {updateStaffform.touched.role && updateStaffform.errors.role && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {updateStaffform.errors.role}
                </p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={updateStaffform.values.email}
                {...updateStaffform.getFieldProps("email")}
                className="border border-gray-300 p-2 sm:p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                placeholder="Enter the email"
              />
              {updateStaffform.touched.email &&
                updateStaffform.errors.email && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {updateStaffform.errors.email}
                  </p>
                )}
            </div>

            <div className="flex items-center gap-3">
              <select
                name="countryCode"
                id="countryCode"
                {...updateStaffform.getFieldProps("countryCode")}
                className=" w-24 h-12 border rounded-sm border-gray-300 focus:ring-2 focus:ring-blue-400" 
              >
                {countryCodes.map((country) => 
                <option key={country.code} value={country.code}>
                    {country.flag} {country.code}
                </option>)}
              </select>
              <input
                type="text"
                name="mobile"
                value={updateStaffform.values.mobile}
                {...updateStaffform.getFieldProps("mobile")}
                className="border border-gray-300 p-2 sm:p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                placeholder="Enter the mobile number"
              />
              {updateStaffform.touched.mobile &&
                updateStaffform.errors.mobile && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {updateStaffform.errors.mobile}
                  </p>
                )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base"
            >
              Update
            </button>
          </form>
        </div>
      </motion.div>
      <AnimatePresence>
        {showsuccess && (
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
              ✅ Staff Edited successfully!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Staffeditmodal;
