import apiService from "../../services/apiService";

export const getTodayBookingCount = async () => {
  try {
    console.log("Fetching today's bookings...");
    const res = await apiService.get("/admin/bookings/today"); 
    if (res.status !== 200) {
      console.log("Error fetching today's bookings");
      return {
        success: false,
        message: "Failed to fetch today's bookings",
      };
    }

    return res.data; 

  } catch (error) {
    console.error("Error in getTodayBookingCount:", error);
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
};
