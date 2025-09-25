import apiService from "../../services/apiService"

export const newRoomGallery = async (data) => {
    try {
        const res = await apiService.post("/admin/room-gallery-photos", data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        if (!res.status === 200) {
            return {
                success: false,
                message: res.message
            }
        }
        return {
            success: true,
            message: res.message
        }
    } catch (error) {
        console.log(error)
        throw error.message
    }
}

export const deleteRoomPost = async (postId) => {
    try {
        await apiService.delete(`/admin/room-gallery-photos/${postId}`);
    } catch (error) {
        throw error
    }
}
export const getRoomPhotos = async () => {
    try {
        console.log("getting post..")
        const res = await apiService.get("/admin/room-gallery-photos");
        if(!res.status === 200){
            console.log("error")
            return {
                success:false,
                message: "Failed to Fetch Photos"
            }
        }
        return res.data;

    } catch (error) {
        console.log(error)
        throw error
    }
}