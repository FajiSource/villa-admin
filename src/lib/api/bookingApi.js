import apiService from "../../services/apiService";

export const getTodayBookingCount = async () => {
  try {
    const res = await apiService.get("/api/stats/bookings-today");
    // Backend returns { success: true, data: {...} }
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return res.data;

  } catch (error) {
    console.error("Error in getTodayBookingCount:", error);
    return {
      success: false,
      message: error.message || "Something went wrong",
      bookings: 0,
      today_count: 0,
      rooms: 0,
    };
  }
};
