import apiService from "../../services/apiService";

export const getTodayBookingCount = async () => {
  try {
    const res = await apiService.get("/api/stats/bookings-today");
    return res.data;

  } catch (error) {
    console.error("Error in getTodayBookingCount:", error);
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
};
