import apiService from "../../services/apiService"

export const registerNewUser = async (data) => {
    try {
        const name = [data.fname, data.lname].filter(Boolean).join(' ').trim();
        const username = data.username || (data.email ? data.email.split('@')[0] : name.replace(/\s+/g, '').toLowerCase());
        const payload = {
            email: data.email,
            username,
            phone: data.phone || null,
            name: name || username,
            password: data.password,
            role: data.role || 'admin'
        };
        const newUser = await apiService.post("/api/register", payload)
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
        const res = await apiService.get("/api/users/latest");
        return res.data?.data || [];
    } catch (error) {
        throw error
    }
}

export const getLatestuUsers = async () => {
    try {
        const res = await apiService.get("/api/users/latest");
        return res.data?.data || [];
    } catch (error) {
        return [];
    }
}

export const getAdmins = async () => {
    try {
        const res = await apiService.get("/api/users/admins");
        return res.data?.data || [];
    } catch (error) {
        throw error;
    }
}

export const getCustomers = async () => {
    try {
        const res = await apiService.get("/api/users/customers");
        return res.data?.data || [];
    } catch (error) {
        throw error;
    }
}

export const deleteAdminUser = async (userID) => {
    try {
        await apiService.delete(`/api/users/${userID}`);
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
