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

// Update villa/cottage/room by id
export const updateAccommodation = async (id, data) => {
    try {
        // Laravel requires POST with _method=PUT for multipart/form-data
        // Create a new FormData to avoid modifying the original
        const formData = new FormData();
        
        // Copy all entries from original FormData
        if (data instanceof FormData) {
            for (const [key, value] of data.entries()) {
                formData.append(key, value);
            }
        } else {
            // If it's a plain object, convert to FormData
            for (const [key, value] of Object.entries(data)) {
                formData.append(key, value);
            }
        }
        
        // Add _method=PUT for Laravel method spoofing
        formData.append('_method', 'PUT');
        
        const res = await apiService.post(`/api/villas/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    } catch (error) {
        console.error("Error updating accommodation:", error);
        console.error("Error details:", error.response?.data || error.message);
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
        // Throw the full error object so components can access error.response?.data
        throw error;
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