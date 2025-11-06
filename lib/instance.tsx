import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // still useful if backend uses cookies
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✅ Attach token automatically from localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Optional: response interceptor for errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 or other global errors here
    return Promise.reject(error)
  }
)
