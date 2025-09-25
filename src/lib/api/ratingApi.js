import apiService from "../../services/apiService";

export const getRatingTotals = async () => {
  try {
    const res = await apiService.get('/admin/ratings');
    return res.data;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    throw error.response?.data || error.message;
  }
};