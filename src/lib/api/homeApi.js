import apiService from "../../services/apiService";

export const addHomePhoto = async (data) => {
    try {
        const res = await apiService.post("/admin/home-gallery", data, {
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
export const updateHomePhoto = async ({id,data}) => {
    try {
        // console.log(data)
        const res = await apiService.post(`/admin/home-gallery/update/${id}`, data, {
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

export const deleteHomePost = async (postId) => {
    try {
        await apiService.delete(`/admin/home-gallery/${postId}`);
    } catch (error) {
        throw error
    }
}
export const getHomePhotos = async () => {
    try {
        console.log("getting post..")
        const res = await apiService.get("/admin/home-gallery");
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