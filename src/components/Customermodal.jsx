import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleCustomermodal } from "../redux/modalSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { FaUserPlus } from "react-icons/fa";
import { addleads } from "../services/leadsRouter";
import { listleadsourcesettings } from "../services/settingservices/leadSourceSettingsRouter";
import Spinner from "./Spinner";
import { getProducts } from "../services/paymentstatusRouter";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

function Customermodal() {
  const dispatch = useDispatch();
  const queryclient = useQueryClient();

  const [showsuccess, setshowsuccess] = useState(false);
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Fetch lead sources
  const fetchleadsource = useQuery({
    queryKey: ["List leadsource"],
    queryFn: listleadsourcesettings,
  });

  // ✅ Fetch products
  const getProduct = useQuery({
    queryKey: ["get products"],
    queryFn: getProducts,
  });

  const getSelectedProduct = getProduct?.data?.getProduct;

  // ✅ Mutation for adding customers
  // const addingcustomers = useMutation({
  //   mutationKey: ["Addh Leads"],
  //   mutationFn: addleads,
  //   onSuccess: () => {
  //     queryclient.invalidateQueries(["Addingleads"]);
  //   },
  //   onError: (error) => {
  //     console.error("Error adding lead:", error);
  //     setErrorMessage(error?.response?.data?.message || "An error occurred while adding the lead");
  //   },
  // });


  const addingcustomers = useMutation({
  mutationFn: addleads,
  onSuccess: () => {
    queryclient.invalidateQueries(["List leads"]); // correct query
    setshowsuccess(true);
  },
  onError: (error) => {
    setshowsuccess(false);
    setErrorMessage(
      error?.response?.data?.message ||
        "❌ Lead already exists or duplicate detected"
    );
  },
});


  // ✅ Yup Validation Schema
//   const customerformvalidation = Yup.object({
//     name: Yup.string()
//       .required("Name is required")
//       .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
//       .min(3, "Name must be at least 3 characters"),
//     email: Yup.string()
//       .required("Email is required")
//       .email("Invalid email format"),
//     mobile: Yup.string()
//           .matches(/^[0-9,-,+]+$/, "Mobile number must contain only digits")
//           .min(7, "Mobile number is too short")
//           .max(15, "Mobile number is too long")
//           .required("Mobile is required"),
//     countryCode: Yup.string().required("Country code is required"),
//     source: Yup.string(),
//     location: Yup.string(),
//     interestedproduct:Yup.string().required("lkjhgf"),
// leadvalue: Yup.number()
//   .required("Lead value is required")
//   .typeError("Lead value must be a valid number")
//   .moreThan(0, "Lead value must be greater than 0"),

//   });


// ✅ Yup Validation Schema
const customerformvalidation = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .matches(/^[A-Za-z\s]+$/, "Name can only contain letters")
    .min(3, "Name must be at least 3 characters"),

  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),

  mobile: Yup.string()
    .matches(/^[0-9,-,+]+$/, "Mobile number must contain only digits")
    .min(7, "Mobile number is too short")
    .max(15, "Mobile number is too long")
    .required("Mobile is required"),

  countryCode: Yup.string().required("Country code is required"),

  source: Yup.string(),

  location: Yup.string(),

  interestedproduct: Yup.string()
    .required("Product selection is required"), // 👈 FIXED (mandatory)

  leadvalue: Yup.number()
    .required("Lead value is required")
    .typeError("Lead value must be a valid number")
    .moreThan(0, "Lead value must be greater than 0"),
});

  // ✅ Formik setup
  const customerForm = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      source: "",
      location: "",
        interestedproduct: "",
      countryCode: "+91",
      leadvalue: "",
    },
    validationSchema: customerformvalidation,
    validateOnChange: true,
    validateOnBlur: true,

    onSubmit: async (values, { setTouched }) => {
      // ✅ Mark all fields as touched to trigger validation
      setTouched({
        name: true,
        email: true,
        mobile: true,
        countryCode: true,
        source: true,
        location: true,
        interestedproduct: true,
        leadvalue: true,
      });
      

      // ✅ Validate form
      const isValidForm = await customerForm.validateForm();
      if (Object.keys(isValidForm).length !== 0) return; // stop submit if invalid

      // 🧹 Ensure mobile formatting
      let mobile = values.mobile.replace(/\s+/g, "");
      if (!mobile.startsWith("+")) {
        mobile = `${values.countryCode}${mobile}`;
      }
      mobile = mobile.replace(/\++/g, "+").replace(/(\+\d+)\1+/, "$1");

      const payload = { ...values, mobile };

      setErrorMessage(""); // Clear any previous error messages
      await addingcustomers.mutateAsync(payload);
      setshowsuccess(true);
      setTimeout(() => {
        dispatch(toggleCustomermodal());
        setshowsuccess(false);
      }, 1000);
    },
  });

  // ✅ Handle phone input change
  const handlePhoneChange = (value, country) => {
    const formattedValue = `+${value.replace(/\s+/g, "")}`;
    setPhone(formattedValue);
    const dialCode = `+${country.dialCode}`;
    setCountryCode(dialCode);

    const nationalNumber = formattedValue.replace(dialCode, "");
    const regex = /^\d{6,15}$/;
    const valid = regex.test(nationalNumber);
    setIsValid(valid);

    customerForm.setFieldValue("mobile", formattedValue);
    customerForm.setFieldValue("countryCode", dialCode);
  };

  const filteredsource = fetchleadsource?.data?.getLeadsource?.filter(
    (source) => source.active
  );

  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4 sm:p-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full max-w-md sm:max-w-lg md:max-w-3xl mx-auto rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden"
      >
        {fetchleadsource.isLoading && <Spinner />}

        {/* Left Section */}
        <div className="bg-gradient-to-b from-[#00B5A6] to-[#1E6DB0] w-full md:w-1/3 flex flex-col items-center justify-center p-6 text-white">
          <FaUserPlus className="text-6xl md:text-[80px] mb-4" />
          <h2 className="text-xl md:text-2xl font-bold">Add New Lead</h2>
          <p className="text-sm mt-2 text-center">
            Fill in the customer details to generate a new lead.
          </p>
        </div>

        {/* Right Section - Form */}
        <div className="relative w-full md:w-2/3 p-6">
          <button
            onClick={() => {
              setErrorMessage("");
              dispatch(toggleCustomermodal());
            }}
            className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500 transition"
          >
            &times;
          </button>

          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
            Lead Details
          </h3>

          <form onSubmit={customerForm.handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
<input
  type="text"
  name="name"
  {...customerForm.getFieldProps("name")}
  onInput={(e) => {
    // Remove numbers and special characters live
    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "");
  }}
  className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400"
  placeholder="Enter name"
/>

              {customerForm.touched.name && customerForm.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {customerForm.errors.name}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <PhoneInput
                country={"in"}
                value={phone}
                onChange={handlePhoneChange}
                enableSearch
                inputClass="!w-full !pl-22 !pr-4 !py-3 !text-gray-800 !border !border-gray-300 !rounded-lg focus:!ring-2 focus:!ring-blue-400"
                buttonClass="!border-gray-300 !bg-white !rounded-l-lg !p-3"
                containerClass="!w-full"
                dropdownClass="!text-gray-800"
                placeholder="Enter phone number"
              />
              {(!isValid ||
                (customerForm.touched.mobile && customerForm.errors.mobile)) && (
                <p className="text-red-500 text-sm mt-2">
                  {customerForm.errors.mobile ||
                    "⚠️ Please enter a valid phone number for selected country"}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                {...customerForm.getFieldProps("email")}
                className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400"
                placeholder="Enter email (e.g. name@gmail.com)"
              />
              {customerForm.touched.email && customerForm.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {customerForm.errors.email}
                </p>
              )}
            </div>

            {/* Source */}
            <div>
              <select
                name="source"
                {...customerForm.getFieldProps("source")}
                className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Source</option>
                {filteredsource?.map((source, index) => (
                  <option key={index} value={source.title}>
                    {source.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <input
                type="text"
                name="location"
                {...customerForm.getFieldProps("location")}
                className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400"
                placeholder="Enter location"
              />
            </div>

            {/* Product */}
            <div>
              {/* <select
                name="interestedproduct"
                {...customerForm.getFieldProps("interestedproduct")}
                className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400"
              >
                <option value="">-- Select Product --</option>
                {getSelectedProduct?.map((product) => (
                  <option key={product._id} value={product.title}>
                    {product.title}
                  </option>
                ))}
              </select> */}

              <select
  name="interestedproduct"
  {...customerForm.getFieldProps("interestedproduct")}
  className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400"
>
  <option value="">-- Select Product --</option>
  {getSelectedProduct?.map((product) => (
    <option key={product._id} value={product.title}>
      {product.title}
    </option>
  ))}
</select>
{customerForm.touched.interestedproduct && customerForm.errors.interestedproduct && (
  <p className="text-red-500 text-sm mt-1">
    {customerForm.errors.interestedproduct}
  </p>
)}
            </div>

            {/* Lead Value */}
            <div>
              <input
                type="text"
                name="leadvalue"
                {...customerForm.getFieldProps("leadvalue")}
                className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400"
                placeholder="Enter lead value"
              />
              {customerForm.touched.leadvalue &&
                customerForm.errors.leadvalue && (
                  <p className="text-red-500 text-sm mt-1">
                    {customerForm.errors.leadvalue}
                  </p>
                )}
            </div>
            {errorMessage && (
  <p className="text-red-500 text-sm mt-2 font-semibold">
    {errorMessage}
  </p>
)}


            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold transition text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Lead
            </button>
          </form>
        </div>
      </motion.div>

      {/* ✅ Success Message */}
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
              ✅ Lead added successfully!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Customermodal;
