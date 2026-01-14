import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFollowup } from "../services/followupRouter";
import ScheduleLead from "./ScheduleLead";

const FollowupLead = ({ leadId, onClose }) => {
  const queryClient = useQueryClient();
  const [schedule, setSchedule] = useState(false);

  // ✅ React Query mutation
  const addDescription = useMutation({
    mutationFn: addFollowup,
    mutationKey: ["addFollowup"],
    onSuccess: () => {
      queryClient.invalidateQueries(["List description"]);
      if (onClose) onClose();
    },
    onError: (err) => {
      console.error("Failed to add follow-up:", err);
    },
  });

  // ✅ Validation schema
  const followupValidation = Yup.object({
    description: Yup.string().required("Description is required"),
  });

  // ✅ Formik setup
  const followupForm = useFormik({
    initialValues: {
      description: "",
    },
    validationSchema: followupValidation,
    onSubmit: async (values, { resetForm }) => {
      await addDescription.mutateAsync({
        followupdata: { leadId, description: values.description },
      });
      resetForm();
    },
  });

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Add Follow-up</h2>
        <button
          className="px-3 py-2 text-white border rounded-lg bg-blue-600 hover:bg-blue-700"
          onClick={() => setSchedule(true)}
        >
          Schedule
        </button>
      </div>

      <form onSubmit={followupForm.handleSubmit} className="space-y-4">
        <div>
          <textarea
            name="description"
            placeholder="Enter follow-up description"
            value={followupForm.values.description}
            onChange={followupForm.handleChange}
            onBlur={followupForm.handleBlur}
            className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={4}
          ></textarea>
          {followupForm.touched.description &&
            followupForm.errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {followupForm.errors.description}
              </p>
            )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 border rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={addDescription.isPending}
            className={`px-4 py-2 text-white rounded-lg ${
              addDescription.isPending
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {addDescription.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

      {/* ✅ Schedule Modal */}
      {schedule && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <div className="bg-white p-6 rounded-xl shadow-lg relative max-w-lg w-full">
            <button
              onClick={() => setSchedule(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              ×
            </button>

            <ScheduleLead
              leadId={leadId}
              onClose={() => setSchedule(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowupLead;
