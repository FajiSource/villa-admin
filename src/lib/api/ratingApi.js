import apiService from "../../services/apiService";

export const getRatingTotals = async () => {
  try {
    // No backend endpoint yet; return zeroed totals to avoid UI crash
    return { success: true, data: { five: 0, four: 0, three: 0, two: 0, one: 0 } };
  } catch (error) {
    console.error("Error fetching ratings:", error);
    throw error.response?.data || error.message;
  }
};