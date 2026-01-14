import axios from "axios";
import { API_URL, getAuthorized } from "../utils/urls";

// Add a new follow-up description
export const addFollowup = async ({ followupdata }) => {
  const { data } = await axios.post(
    `${API_URL}/follow-up/create-description`,
    followupdata,
    getAuthorized()
  );
  console.log("Follow-up created:", data);
  return data;
};

// Get all follow-ups
export const getFollowupsByLead = async (leadId) => {
  const { data } = await axios.get(
    `${API_URL}/follow-up/list-description/${leadId}`,
    getAuthorized()
  );
  return data;
};








