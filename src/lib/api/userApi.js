import apiService from "../../services/apiService"

export const registerNewUser = async (data) => {
    try {
        const newUser = await apiService.post("/admin/user", { ...data })
        if (newUser.status !== 200) {
            return {
                success: false,
                message: "Failed to Register."
            }
        }
        return {
            success: true,
            user: newUser.data.success
        }
    } catch (error) {
        throw error
    }
}

export const getAdminUsers = async () => {
    try {
        const users = await apiService("/admin/users");
        if (!users.status === 200) {
            return {
                success: false,
                message: "Failed to Fetch Users."
            }
        }
        console.log("users: " ,users);

        return users.data
    } catch (error) {
        throw error
    }
}
export const deleteAdminUser = async (userID) => {
    try {
        await apiService.delete(`/admin/user/${userID}`);
    } catch (error) {
        throw error
    }
}

export const changeAdminPassword = async ({ userId, data }) => {
    try {
        const response = await apiService.post(`/admin/user/change-password/${userId}`, {
            new_password: data.new_password,
            new_password_confirmation: data.confirm_password 
        });

        if (response.status !== 200) {
            return {
                success: false,
                message: "Failed to Change Password."
            };
        }

        return {
            success: true,
            message: response.data.success || "Password updated successfully."
        };
    } catch (error) {
        throw error;
    }
};
