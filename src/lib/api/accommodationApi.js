import apiService from "../../services/apiService";

// Create villa/cottage/room
export const newAccommodation = async (data) => {
    try {
        const res = await apiService.post("/api/villas", data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    } catch (error) {
        console.error("Error adding accommodation:", error);
        throw error;
    }
};

// List all villas/cottages/rooms
export const getAccommodations = async () => {
    try {
        const res = await apiService.get("/api/villas");
        // Backend returns { success, data }
        return Array.isArray(res.data) ? res.data : res.data?.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Delete by id
export const deleteAccommodation = async (id) => {
    try {
        const res = await apiService.delete(`/api/villas/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error deleting accommodation:", error);
        throw error.response?.data || error.message;
    }
};


export const getAccommodationImages = async (accommodationId) => {
    // No backend endpoint yet; return empty list to avoid console 404 spam
    return [];
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
    // No backend endpoint yet; return empty list to avoid console 404 spam
    return [];
};