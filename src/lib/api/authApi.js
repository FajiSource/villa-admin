import apiService from "../../services/apiService"

// user
export const signInUser = async ({email,password}) => {
    try {
        const response = await apiService.post("/api/login",
            {
                email,password
            }
        );
        if (response.status !== 200) {
            return {success:false,message: "Login failed"}
        }
        return {
            success:true,
            message: "Login success",
            token: response.data.token
        }
    } catch (error) {
        throw error;
    }
}

export const getCurrentUser = async () => {
    try {
        const res = await apiService.get("/api/user")

        if(res.status !== 200){
            return {
                success:false,
                message: "Something went wrong."
            }
        }
        return {
            success:true,
            user: res.data
        }
    } catch (error) {
        throw error
    }
}
export const logout = async (token) => {
    return await apiService.post(`/api/logout`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};