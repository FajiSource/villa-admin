import apiService from "../../services/apiService";

// Get feedback statistics for a specific year
export const getFeedbackStatistics = async (year = null) => {
    try {
        const url = year 
            ? `/api/feedback/statistics?year=${year}`
            : `/api/feedback/statistics`;
        const res = await apiService.get(url);
        return res.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

