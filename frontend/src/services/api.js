import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const getMode = () => localStorage.getItem("aegisMode") || "demo";

export const sendAttack = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/attack?mode=${getMode()}`, data);
    return response.data;
  } catch (error) {
    console.error("API Error [sendAttack]:", error);
    throw error;
  }
};

export const getLogs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/logs?mode=${getMode()}`);
    return response.data;
  } catch (error) {
    console.error("API Error [getLogs]:", error);
    throw error;
  }
};

export const getAnalysis = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/analysis?mode=${getMode()}`);
    return response.data;
  } catch (error) {
    console.error("API Error [getAnalysis]:", error);
    throw error;
  }
};

export const getInsights = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/insights?mode=${getMode()}`);
    return response.data;
  } catch (error) {
    console.error("API Error [getInsights]:", error);
    throw error;
  }
};
