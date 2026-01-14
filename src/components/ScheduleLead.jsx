import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addRemainder } from "../services/remainderRouter";


const ScheduleLead = ({ leadId, onClose }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    date: "",
    notes: "",
  });

  // --- useMutation for creating a remainder ---
  const addRemainderMutation = useMutation({
    mutationFn: (remainderData) => addRemainder(remainderData),
    onSuccess: (data) => {
      alert("Remainder scheduled successfully!");
      

      // Invalidate reminder list queries so UI updates automatically
      queryClient.invalidateQueries(["remainders"]);

      setFormData({ date: "", notes: "" });
      onClose();
    },
    onError: (error) => {
      console.error("Error adding remainder:", error);
      alert("Failed to schedule remainder. Try again.");
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.date || !formData.notes) {
      alert("Please fill all fields");
      return;
    }

    // Validate year range (4 digits max, reasonable range)
    const selectedDate = new Date(formData.date);
    const year = selectedDate.getFullYear();
    const currentYear = new Date().getFullYear();

    if (year < 1900 || year > currentYear + 10) {
      alert("Year must be between 1900 and " + (currentYear + 10));
      return;
    }

    // Validate date is not in the past
    const today = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert("Reminder date cannot be in the past");
      return;
    }

    const remainderData = {
      date: formData.date,
      description: formData.notes,
      leadId: leadId, // optional, if backend supports it
    };

    addRemainderMutation.mutate(remainderData);
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Schedule Reminder
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700 font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-gray-700 font-medium">Notes</label>
          <input
            type="text"
            name="notes"
            placeholder="Enter reminder text"
            value={formData.notes}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={addRemainderMutation.isPending}
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={addRemainderMutation.isPending}
            className={`px-4 py-2 text-white rounded-lg ${
              addRemainderMutation.isPending
                ? "bg-blue-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {addRemainderMutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleLead;
