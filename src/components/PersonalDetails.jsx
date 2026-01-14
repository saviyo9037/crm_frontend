import React, { useState } from "react";
import { useFormik } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Swal from "sweetalert2";

import {
  updatecustomerdetails,
  updateuserleadform,
} from "../services/leadsRouter";
import {
  toggleCustomerdetailmodal,
  toggleCustomereditmodal,
} from "../redux/modalSlice";
import { listleadsettingsformfields } from "../services/settingservices/leadFormFieldsSettingsRouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faFileDownload,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { getProducts } from "../services/paymentstatusRouter";

function PersonalDetails() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const selectedlead = useSelector((state) => state.modal.selectedLead);
  const role = useSelector((state) => state.auth.role);
  const metadata = useSelector((state) => state.auth.metadataUser);

  const [updatesuccessmodal, setupdatesuccessmodal] = useState(false);

  // ✅ Fetch active lead form fields
  const fetchleadforms = useQuery({
    queryKey: ["List Form Fields"],
    queryFn: listleadsettingsformfields,
  });

  const getProduct = useQuery({
    queryKey: ["get products"],
    queryFn: getProducts,
  });

  const getSelectedProduct = getProduct?.data?.getProduct;

  const filteredleadform = fetchleadforms?.data?.getLeadform?.filter(
    (leadform) => leadform.active
  );

  // ✅ Mutation to update lead form details
  const updatinguserleadform = useMutation({
    mutationKey: ["Update user leadform"],
    mutationFn: updateuserleadform,
    onSuccess: () => {
      queryClient.invalidateQueries(["List Form Fields"]);
      // Show success message
      Swal.fire({
        title: "Success",
        text: "Lead details updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      setupdatesuccessmodal(true);
      setTimeout(() => {
        setupdatesuccessmodal(false);
        dispatch(toggleCustomerdetailmodal(null));
      }, 2000);
    },
  });

  const canUpdate =
    metadata?.permissions?.includes("updateLead") || role === "Admin";

  // ✅ Formik for lead form fields
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
          value: matchedField?.value || (leadform.type === "checkbox" ? [] : ""),
        };
      }) || [],
  },
  validationSchema : Yup.object().shape({
  userDetails: Yup.array().of(
    Yup.object().shape({
      leadFormId: Yup.string(),
      value: Yup.mixed().test(
        "checkbox-validation",
        "Please select at least one option.",
        function (val) {
          // Require at least one selected checkbox for type 'checkbox'
          if (Array.isArray(val)) {
            return val.length > 0;
          }
          return true;
        }
      ),
    })
  ),
}),

  onSubmit: async (values) => {
    const formData = new FormData();
    values.userDetails.forEach((item) => formData.append(item.leadFormId, item.value));
    await updatinguserleadform.mutateAsync({
      id: selectedlead._id,
      userDetails: formData,
    });
  },
});


  // ✅ File download handler
  const handleDownload = (file) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name || "file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg transition-transform duration-200 hover:scale-[1.01] mt-4">
      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        onSubmit={updateuserleadsform.handleSubmit}
      >
        {canUpdate && (
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-[#00B5A6] hover:bg-[#1E6DB0] text-white font-semibold py-2 px-5 rounded-full shadow-md transition-transform transform hover:scale-105"
            >
              <FontAwesomeIcon icon={faCheckCircle} />
              Update
            </button>
          </div>
        )}

        {filteredleadform?.length > 0 ? (
          filteredleadform.map((leadform, index) => {
            const inputType = leadform.type;
            return (
              <div key={index} className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={
                      inputType === "file" || inputType === "image"
                        ? faFileDownload
                        : faTag
                    }
                    className="text-[#2c1ef4]"
                    required
                  />
                  {leadform?.name}
                </label>

                {/* Textarea */}
                {inputType === "textarea" ? (
                  <textarea
                    name={`userDetails[${index}].value`}
                    value={
                      updateuserleadsform.values.userDetails[index]?.value || ""
                    }
                    onChange={updateuserleadsform.handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B5A6] shadow-sm text-sm h-24 resize-none"
                    required
                  />
                ) : inputType === "checkbox" ? (
                  <div className="grid grid-cols-2 gap-3">
                    {leadform.options?.map((option, optIndex) => {
                      const selectedValues =
                        updateuserleadsform.values.userDetails[index]?.value ||
                        [];
                      return (
                        <label
                          key={optIndex}
                          className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedValues.includes(option)}
                            onChange={(e) => {
                              let updated = [...selectedValues];

                              if (e.target.checked) {
                                updated.push(option);
                              } else {
                                updated = updated.filter((o) => o !== option);
                              }
                         
                              if (updated.length === 0) {
                                alert("Choose at least one enquired product");
                              }
                              updateuserleadsform.setFieldValue(
                                `userDetails[${index}].value`,
                                updated
                              );
                            }}
                            className="h-4 w-4 text-[#00B5A6] border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">
                            {option}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                ) : inputType === "choice" ? (
                  <select
                    name={`userDetails[${index}].value`}
                    value={
                      updateuserleadsform.values.userDetails[index]?.value || ""
                    }
                    onChange={updateuserleadsform.handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B5A6] shadow-sm text-sm"
                    required
                  >
                    <option value="">Select an option</option>
                    {getSelectedProduct?.length > 0 &&
                      getSelectedProduct.map((product) => {
                        return (
                          <option key={product._id} value={product.title}>
                            {product.title}
                          </option>
                        );
                      })}
                  </select>
                ) : inputType === "file" || inputType === "image" ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      onChange={(event) =>
                        updateuserleadsform.setFieldValue(
                          `userDetails[${index}].value`,
                          event.currentTarget.files[0]
                        )
                      }
                      accept={inputType === "image" ? "image/*" : undefined}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B5A6] shadow-sm text-sm"
                      required
                    />
                    {updateuserleadsform.values.userDetails[index]?.value && (
                      <button
                        type="button"
                        onClick={() =>
                          handleDownload(
                            updateuserleadsform.values.userDetails[index]?.value
                          )
                        }
                        className="inline-flex items-center gap-2 bg-[#00B5A6] hover:bg-[#1E6DB0] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform hover:scale-105"
                      >
                        <FontAwesomeIcon icon={faFileDownload} />
                        Download
                      </button>
                    )}
                  </div>
                ) : (
                  <input
                    type={inputType}
                    name={`userDetails[${index}].value`}
                    value={
                      updateuserleadsform.values.userDetails[index]?.value || ""
                    }
                    onChange={updateuserleadsform.handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B5A6] shadow-sm text-sm"
                  />
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center text-gray-500 text-sm py-6">
            No lead form data available
          </div>
        )}
      </form>
    </div>
  );
}

export default PersonalDetails;
