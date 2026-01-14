import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import * as Yup from 'yup';
import { updatecustomerdetails } from '../services/leadsRouter';
import { toggleCustomerdetailmodal, toggleCustomereditmodal } from '../redux/modalSlice';
import { listleadsourcesettings } from '../services/settingservices/leadSourceSettingsRouter';
import Spinner from './Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

function CustomereditModal() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const selectedLead = useSelector((state) => state.modal.selectedLead);
  const [updatesuccessmodal, setupdatesuccessmodal] = useState(false);

  // Fetch lead sources
  const fetchleadsource = useQuery({
    queryKey: ['List leadsource'],
    queryFn: listleadsourcesettings,
  });

  // Mutation to update customer
  const updatingcustomers = useMutation({
    mutationKey: ['Update customers'],
    mutationFn: updatecustomerdetails,
    onSuccess: () => {
      queryClient.invalidateQueries(['Listleads']);
      setupdatesuccessmodal(true); // show success
      setTimeout(() => {
        setupdatesuccessmodal(false); // hide after 2s
        dispatch(toggleCustomereditmodal());
        dispatch(toggleCustomerdetailmodal());
      }, 2000);
    },
  });

  // Form validation
  const customerEditformvalidation = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    mobile: Yup.string()
      .matches(/^\d{10}$/, 'Invalid mobile number')
      .required('Mobile is required'),
    source: Yup.string(),
    location: Yup.string(),
    interestedproduct: Yup.string(),
    leadvalue: Yup.number(),
  });

  // Formik form
  const customereditForm = useFormik({
    initialValues: {
      name: selectedLead?.name || '',
      email: selectedLead?.email || '',
      mobile: selectedLead?.mobile || '',
      source: selectedLead?.source?.title || '',
      location: selectedLead?.location || '',
      interestedproduct: selectedLead?.interestedproduct || '',
      leadvalue: selectedLead?.leadvalue || '',
    },
    validationSchema: customerEditformvalidation,
    onSubmit: async (values) => {
      await updatingcustomers.mutateAsync({
        customerId: selectedLead._id,
        customerData: values,
      });
    },
  });

  const filteredsource = fetchleadsource?.data?.getLeadsource?.filter(
    (source) => source.active
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center overflow-auto p-4 sm:p-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-3xl relative"
      >
        {/* Spinner while fetching */}
        {(fetchleadsource.isLoading || updatingcustomers.isPending) && <Spinner />}

        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-2xl font-bold text-gray-800">Edit Lead</h2>
          <button
            onClick={() => dispatch(toggleCustomereditmodal())}
            className="text-gray-400 hover:text-red-500 text-3xl font-bold transition"
          >
            &times;
          </button>
        </div>

        {/* Error */}
        {updatingcustomers.isError && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
            {updatingcustomers.error?.response?.data?.message}
          </div>
        )}

        {/* Success toast */}
        <AnimatePresence>
          {updatesuccessmodal && (
            <motion.div
              className="absolute top-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-xl shadow-md flex items-center gap-2 text-sm z-50"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <FontAwesomeIcon icon={faCheckCircle} />
              Updated successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form
          onSubmit={customereditForm.handleSubmit}
          className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Left column */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                {...customereditForm.getFieldProps('name')}
                placeholder="Enter full name"
                className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {customereditForm.touched.name && customereditForm.errors.name && (
                <p className="text-red-500 text-xs mt-1">{customereditForm.errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                {...customereditForm.getFieldProps('email')}
                placeholder="Enter email"
                className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {customereditForm.touched.email && customereditForm.errors.email && (
                <p className="text-red-500 text-xs mt-1">{customereditForm.errors.email}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Mobile Number</label>
              <input
                type="text"
                name="mobile"
                {...customereditForm.getFieldProps('mobile')}
                placeholder="Enter mobile number"
                className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {customereditForm.touched.mobile && customereditForm.errors.mobile && (
                <p className="text-red-500 text-xs mt-1">{customereditForm.errors.mobile}</p>
              )}
            </div>

            {/* Source */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Source</label>
              <select
                name="source"
                {...customereditForm.getFieldProps('source')}
                className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Source</option>
                {filteredsource?.map((source, idx) => (
                  <option key={idx} value={source.title}>
                    {source.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Location */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                {...customereditForm.getFieldProps('location')}
                placeholder="Enter location"
                className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Interested Product */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Interested Product</label>
              <input
                type="text"
                name="interestedproduct"
                {...customereditForm.getFieldProps('interestedproduct')}
                placeholder="Enter product"
                className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Lead Value */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Lead Value</label>
              <input
                type="number"
                name="leadvalue"
                {...customereditForm.getFieldProps('leadvalue')}
                placeholder="Enter lead value"
                className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="md:col-span-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              type="submit"
              className="w-full bg-gradient-to-r from-[#00B5A6] to-[#1E6DB0] text-white py-3 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all"
            >
              Update Lead
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default CustomereditModal;