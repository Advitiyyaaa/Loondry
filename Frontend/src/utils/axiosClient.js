import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL is missing");
}

const axiosClient = axios.create({
    
    baseURL: API_URL || 'http://localhost:2000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosClient;