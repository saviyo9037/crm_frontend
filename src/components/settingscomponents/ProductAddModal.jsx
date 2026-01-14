import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProductSetting } from '../../services/settingservices/productSettingRouter';
import { toggleproductsModal } from '../../redux/settingsmodalSlice';
import { AnimatePresence, motion } from 'framer-motion'; 
import Spinner from '../Spinner'; 
import { duration } from 'moment/moment';

const ProductAddModal = () => { 
    const dispatch = useDispatch();
    const queryclient = useQueryClient();
    const [showSuccess, setShowSuccess] = useState(false);

    const addingProducts = useMutation({
        mutationKey: ["adding products"],
        mutationFn: addProductSetting,
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ['products list'] });
        }
    });

    const productValidationSchema = Yup.object({
        title: Yup.string().required("Name is required")
    });

    const formik = useFormik({
        initialValues: {
            title: "",
            duration : "",
            amount : ""
        },
        validationSchema: productValidationSchema,
        onSubmit: async (values) => {
            await addingProducts.mutateAsync({ title: values.title, duration : values.duration, amount: values.amount });
            setShowSuccess(true);
            setTimeout(() => {
                dispatch(toggleproductsModal(null));
            }, 1000);
        }
    });

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-2 sm:px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white w-full max-w-md sm:max-w-lg rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 relative"
            >
                <button
                    onClick={() => dispatch(toggleproductsModal(null))}
                    className="absolute top-2 sm:top-3 right-3 sm:right-4 text-xl sm:text-2xl text-gray-400 hover:text-red-500 transition"
                >
                    &times;
                </button>

                {addingProducts.isPending && <Spinner />}

                {addingProducts.isError && (
                    <p className="text-red-600 bg-red-100 p-2 rounded-md mb-3 text-sm">
                        {addingProducts.error?.response?.data?.message || "An error occurred."}
                    </p>
                )}

                <form onSubmit={formik.handleSubmit} className="space-y-3">
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium mb-1 text-sm">
                            Product Name
                        </label>
                        <input
                            type="text"
                            name="title"
                            {...formik.getFieldProps("title")}
                            className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Enter product name"
                        />
                        {formik.errors.title && formik.touched.title && (
                            <span className="text-red-500 text-xs mt-1">
                                {formik.errors.title}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium mb-1 text-sm">
                            Enter the duration
                        </label>
                        <input
                            type="text"
                            name="duration"
                            {...formik.getFieldProps("duration")}
                            className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Enter the duration"
                        />
                        {formik.errors.duration && formik.touched.duration && (
                            <span className="text-red-500 text-xs mt-1">
                                {formik.errors.duration}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium mb-1 text-sm">
                            Enter the amount
                        </label>
                        <input
                            type="text"
                            name="amount"
                           {...formik.getFieldProps("amount")}
                            className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Enter the amount"
                        />
                        {formik.errors.amount && formik.touched.amount && (
                            <span className="text-red-500 text-xs mt-1">
                                {formik.errors.amount}
                            </span>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={formik.isSubmitting} // IMPROVEMENT: Disable button when submitting
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition text-sm disabled:bg-gray-400"
                    >
                        {formik.isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </form>

            </motion.div>
            <AnimatePresence>
                {showSuccess && (
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
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            {/* FIX: Corrected success message */}
                            ✅ Product added successfully!
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ProductAddModal;