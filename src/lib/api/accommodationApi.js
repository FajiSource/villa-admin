import apiService from "../../services/apiService";

export const newAccommodation = async (data) => {
    try {
        const res = await apiService.post("/admin/accommodations/new", data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    } catch (error) {
        console.error("Error adding accommodation:", error);
        throw error;
    }
};

export const getAccommodations = async () => {
    try {
        const res = await apiService.get("/admin/accommodations");
        console.log(res)
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteAccommodation = async (id) => {
    try {
        const res = await apiService.delete(`/admin/accommodations/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error deleting accommodation:", error);
        throw error.response?.data || error.message;
    }
};


export const getAccommodationImages = async (accommodationId) => {
  try {
    const res = await apiService.get(`/accommodation-images/${accommodationId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error.response?.data || error.message;
  }
};

export const addAccommodationImage = async (data) => {
  try {
    const res = await apiService.post("/admin/accommodation-images", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error.response?.data || error.message;
  }
};

export const deleteAccommodationImage = async (id) => {
  try {
    const res = await apiService.delete(`/admin/accommodation-images/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error.response?.data || error.message;
  }
};


export const addSchedule = async ({date,accommodationId}) => {
  try {
    const res = await apiService.post(`/admin/accommodations/${accommodationId}/schedule`, {date});
    return res.data;
  } catch (error) {
    console.error("Error adding  schedule:", error);
    throw error.response?.data || error.message;
  }
};

export const getSchedules = async (accommodationId) => {
  try {
    const res = await apiService.get(`/admin/accommodations/${accommodationId}/schedule`);
    return res.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error.response?.data || error.message;
  }
};