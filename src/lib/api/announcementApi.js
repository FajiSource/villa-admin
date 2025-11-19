import apiService from "../../services/apiService";

// List all announcements
export const getAnnouncements = async () => {
    try {
        const res = await apiService.get("/api/announcements");
        console.log("Admin API raw response:", res);
        // Backend returns { success: true, data: [...] }
        // Axios wraps it in res.data, so res.data = { success: true, data: [...] }
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
            console.log("Admin found announcements:", res.data.data);
            return res.data.data;
        }
        // Fallback: if response is directly an array
        if (Array.isArray(res.data)) {
            console.log("Admin response is direct array:", res.data);
            return res.data;
        }
        // Fallback: if data field exists
        if (res.data && Array.isArray(res.data.data)) {
            console.log("Admin found announcements in data.data:", res.data.data);
            return res.data.data;
        }
        console.warn("Admin: No announcements found. Response structure:", res.data);
        return [];
    } catch (error) {
        console.error("Admin API error:", error);
        console.error("Error response:", error.response?.data);
        throw error.response?.data || error.message;
    }
};

// Create announcement
export const newAnnouncement = async (data) => {
    try {
        const res = await apiService.post("/api/announcements", data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    } catch (error) {
        console.error("Error adding announcement:", error);
        throw error.response?.data || error.message;
    }
};

// Update announcement by id
export const updateAnnouncement = async (id, data) => {
    try {
        // Laravel requires POST with _method=PUT for multipart/form-data
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
        
        const res = await apiService.post(`/api/announcements/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    } catch (error) {
        console.error("Error updating announcement:", error);
        throw error.response?.data || error.message;
    }
};

// Delete by id
export const deleteAnnouncement = async (id) => {
    try {
        const res = await apiService.delete(`/api/announcements/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error deleting announcement:", error);
        throw error.response?.data || error.message;
    }
};

