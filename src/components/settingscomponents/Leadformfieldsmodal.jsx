import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { addleadsettingsformfields } from "../../services/settingservices/leadFormFieldsSettingsRouter";
import { toggleleadformModal } from "../../redux/settingsmodalSlice";
import { AnimatePresence, motion } from "framer-motion";
import Spinner from "../Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function Leadformfieldsmodal() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState(false);
  const [options, setOptions] = useState([]);
  const [optionInput, setOptionInput] = useState("");

  const addingLeadFormField = useMutation({
    mutationKey: ["Adding Lead Form"],
    mutationFn: addleadsettingsformfields,
    onSuccess: () => {
      queryClient.invalidateQueries(["List Form Fields"]);
      setOptions([]); // Clear options only on successful submission
      setOptionInput("");
    },
  });

  const leadFormFieldValidation = Yup.object({
    name: Yup.string().required("Field name is required"),
    type: Yup.string().required("Field type is required"),
    options: Yup.array().when("type", {
      is: (val) => val === "choice" || val === "checkbox",
      then: (schema) =>
        schema
          .of(Yup.string())
          .min(1, "At least one option is required for dropdown")
          .required("Options are required for dropdown"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const addLeadFormField = useFormik({
    initialValues: {
      name: "",
      type: "",
      options: [],
      requiredProductType: false,
    },
    validationSchema: leadFormFieldValidation,
    onSubmit: async (values) => {
      try {
        await addingLeadFormField.mutateAsync(values);
        setShowSuccess(true);
        setTimeout(() => {
          dispatch(toggleleadformModal());
          setShowSuccess(false);
          addLeadFormField.resetForm(); // Reset form after submission
        }, 1000);
      } catch (error) {
        console.error("Submission error:", error);
      }
    },
  });

  const handleAddOption = () => {
    if (optionInput.trim()) {
      const newOptions = [...options, optionInput.trim()];
      setOptions(newOptions);
      addLeadFormField.setFieldValue("options", newOptions);
      setOptionInput("");
    }
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    addLeadFormField.setFieldValue("options", newOptions);
  };

  const handleTypeChange = (e) => {
    addLeadFormField.handleChange(e);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-2 sm:px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-white w-full max-w-lg sm:max-w-2xl rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 relative"
      >
        <button
          onClick={() => dispatch(toggleleadformModal())}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 text-xl sm:text-2xl text-gray-500 hover:text-red-600 transition-colors"
        >
          ×
        </button>

        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
          Create Field Type
        </h2>

        {addingLeadFormField.isPending && <Spinner />}
        {addingLeadFormField.isError && (
          <div className="mb-4 sm:mb-6 p-2 sm:p-3 bg-red-100 text-red-700 rounded-lg flex items-center text-sm sm:text-base">
            {addingLeadFormField.error?.response?.data?.message}
          </div>
        )}

        <form
          onSubmit={addLeadFormField.handleSubmit}
          className="space-y-4 sm:space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                {...addLeadFormField.getFieldProps("name")}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                placeholder="Enter field name"
              />
              {addLeadFormField.touched.name &&
                addLeadFormField.errors.name && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {addLeadFormField.errors.name}
                  </p>
                )}
            </div>
            <div>
              <label
                htmlFor="type"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                Type
              </label>
              <select
                name="type"
                {...addLeadFormField.getFieldProps("type")}
                onChange={handleTypeChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
              >
                <option value="" disabled>
                  Select field type
                </option>
                <option value="text">Character</option>
                <option value="number">Number</option>
                <option value="email">Email</option>
                <option value="textarea">Textarea</option>
                <option value="file">File</option>
                <option value="image">Image</option>
                <option value="date">Date</option>
                <option value="choice">Dropdown</option>
                <option value="checkbox">Checkbox</option>
              </select>
              {addLeadFormField.touched.type &&
                addLeadFormField.errors.type && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {addLeadFormField.errors.type}
                  </p>
                )}
            </div>
          </div>

          {(addLeadFormField.values.type === "choice" ||
            addLeadFormField.values.type === "checkbox") && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                {addLeadFormField.values.type === "choice" 
                  ? "Dropdown Options"
                  : "Checkbox Options"}
              </label>

              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={optionInput}
                  onChange={(e) => setOptionInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddOption())
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                  placeholder="Enter option"
                />
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                  disabled={!optionInput.trim()}
                >
                  Add
                </button>
              </div>

              {options.length > 0 && (
                <ul className="mt-2 max-h-[110px] overflow-y-auto rounded-lg border border-gray-200">
                  {options.map((option, index) => (
                    <li
                      key={index}
                      className={`flex justify-between items-center text-sm px-3 py-2 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-100"
                      }`}
                    >
                      <span>{option}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="text-red-600 hover:text-red-800"
                        title="Remove option"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {addLeadFormField.touched.options &&
                addLeadFormField.errors.options && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {addLeadFormField.errors.options}
                  </p>
                )}
            </div>
          )}

          <div className="text-xs sm:text-sm text-gray-500">
            <span className="font-medium">Note:</span> For phone numbers, please
            select the "Character" type.
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-2.5 rounded-lg font-semibold transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Submit
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
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              ✅ Lead form added successfully!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Leadformfieldsmodal;
