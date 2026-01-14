import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import Spinner from "../Spinner";
import { editProductSetting } from "../../services/settingservices/productSettingRouter";
import { toggleproductseditModal } from "../../redux/settingsmodalSlice";


const ProductEditModal = () => {
  const queryclient = useQueryClient();
  const dispatch = useDispatch();

  const selectedProduct = useSelector(
    (state) => state.settingsmodal.selectedProduct
  );

  const [showSuccess, setShowSuccess] = useState(false);

  const productSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    duration: Yup.string().required("Duration is required"),
    amount: Yup.number()
      .typeError("Amount must be a number")
      .required("Amount is required"),
  });

  const updateProducts = useMutation({
    mutationKey: ["updating products"],
    mutationFn: editProductSetting,
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["products list"] });
    },
  });

  const formik = useFormik({
    initialValues: {
      title: selectedProduct?.title || "",
      duration: selectedProduct?.duration || "",
      amount: selectedProduct?.amount || "",
    },
    validationSchema: productSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await updateProducts.mutateAsync({
        settingsproductId: selectedProduct._id,
        title: values.title,
        duration: values.duration,
        amount: values.amount,
      });

      setShowSuccess(true);
      setTimeout(() => {
        dispatch(toggleproductseditModal(null));
        setShowSuccess(false);
      }, 1000);
    },
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-2 sm-px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white w-full max-w-md sm:max-w-lg rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 relative"
      >
        <button
          onClick={() => dispatch(toggleproductseditModal(null))}
          className="absolute top-2 sm:top-3 right-3 sm:right-4 text-xl sm:text-2xl text-gray-400 hover:text-red-500 transition"
        >
          &times;
        </button>

        {updateProducts.isPending && <Spinner />}
        {updateProducts.isError && (
          <p className="text-red-600 bg-red-100 p-2 sm:p-3 rounded-md mb-3 sm:mb-4 text-sm sm:text-base">
            {updateProducts.error?.response?.data?.message ||
              "An error occurred."}
          </p>
        )}

        {/* FIX 3: Use the correct formik instance name */}
        <form onSubmit={formik.handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Product Name
            </label>
            <input
              type="text"
              name="title"
              {...formik.getFieldProps("title")}
              className="border border-gray-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="Enter product name"
            />
            {formik.errors.title && formik.touched.title && (
              <span className="text-red-500 text-xs sm:text-sm mt-1">
                {formik.errors.title}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              {...formik.getFieldProps("duration")}
              className="border border-gray-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="Enter product duration"
            />
            {formik.errors.duration && formik.touched.duration && (
              <span className="text-red-500 text-xs sm:text-sm mt-1">
                {formik.errors.duration}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Amount
            </label>
            <input
              type="text"
              name="amount"
              {...formik.getFieldProps("amount")}
              className="border border-gray-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="Enter product amount"
            />
            {formik.errors.amount && formik.touched.amount && (
              <span className="text-red-500 text-xs sm:text-sm mt-1">
                {formik.errors.amount}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-2.5 rounded-lg font-semibold transition text-sm sm:text-base disabled:bg-gray-400"
          >
            {formik.isSubmitting ? "Updating..." : "Update Product"}
          </button>
        </form>
      </motion.div>
      <AnimatePresence>
        {/* FIX: Use correct state variable name */}
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
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              ✅ Product edited successfully!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductEditModal;

// {ispermmission ? (<Leads) : you cannot acces for sometime}
