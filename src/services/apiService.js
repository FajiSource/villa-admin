import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiService = axios.create({
    baseURL: API_BASE_URL
});

const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
if (csrfTokenElement) {
    apiService.defaults.headers.common['X-CSRF-TOKEN'] = csrfTokenElement.getAttribute('content');
}
apiService.interceptors.request.use((config) => {
    const token = localStorage.getItem("pelagicAdminToken")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
});


apiService.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;
        if (response && response.status === 401) {
            localStorage.removeItem('pelagicAdminToken')
        }
        throw error;
    }
)

export default apiService;