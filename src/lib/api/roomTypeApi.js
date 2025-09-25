import apiService from "../../services/apiService"

export const newRoomType = async (data) => {
    try {
        const res = await apiService.post("/admin/room-types", data);

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
        const res = await apiService.delete(`/admin/room-types/${id}`);

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
        const res = await apiService.get("/admin/room-types");

        if (res.status !== 200) {
            return {
                success: false,
                message: "Failed to fetch room types"
            }
        }

        return {
            success: true,
            data: res.data
        }

    } catch (error) {
        console.error("Error fetching room types:", error)
        throw error.response?.data?.message || error.message
    }
}
