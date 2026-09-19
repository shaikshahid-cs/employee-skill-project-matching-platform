import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Passive Request Interceptor: Attaches Bearer token and handles FormData boundary
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If the body is FormData, remove Content-Type so the browser can auto-generate
    // the correct multipart/form-data boundary. Setting it manually omits the boundary.
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Dispatches 401 unauthorized event and normalizes error messages
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const status = error.response?.status;

    // Dispatch global event on 401 unauthorized so AuthContext can handle session expiry
    if (status === 401) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    const errorMessage =
      error.response?.data?.message ||
      (typeof error.response?.data === 'string' ? error.response.data : null) ||
      error.message ||
      'An unexpected network or server error occurred';

    const normalizedError = new Error(errorMessage);
    normalizedError.status = status;
    normalizedError.data = error.response?.data;

    return Promise.reject(normalizedError);
  }
);

export default axiosClient;
