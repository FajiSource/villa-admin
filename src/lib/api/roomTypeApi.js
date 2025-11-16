import apiService from "../../services/apiService"

export const newRoomType = async (data) => {
    try {
        // Not implemented in backend; return unsupported
        const res = { status: 501, message: "Not implemented" };

        if (res.status !== 201) {
            return {
                success: false,
                message: res.message || "Failed to create room type"
            }
        }

        return {
            success: true,
            message: res.data.message,
            data: res.data.data
        }

    } catch (error) {
        console.error("Error adding room type:", error)
        throw error.response?.data?.message || error.message
    }
}

export const deleteRoomType = async (id) => {
    try {
        // Not implemented in backend; return unsupported
        const res = { status: 501, message: "Not implemented" };

        if (res.status !== 200) {
            return {
                success: false,
                message: res.message || "Failed to delete room type"
            }
        }

        return {
            success: true,
            message: res.data.message
        }

    } catch (error) {
        console.error("Error deleting room type:", error)
        throw error.response?.data?.message || error.message
    }
}

export const getRoomTypes = async () => {
    try {
        // Derive room types from villas endpoint
        const res = await apiService.get("/api/villas");
        const items = Array.isArray(res.data) ? res.data : res.data?.data || [];
        const types = [...new Set(items.map((v) => (v.type || '').toLowerCase()))]
            .filter(Boolean)
            .map((t) => ({ id: t, name: t }));
        return { success: true, data: types };

    } catch (error) {
        console.error("Error fetching room types:", error)
        throw error.response?.data?.message || error.message
    }
}
