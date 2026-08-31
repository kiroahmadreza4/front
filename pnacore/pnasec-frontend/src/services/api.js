import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')
const DEFAULT_LOGIN = {
  email: import.meta.env.VITE_API_EMAIL || 'admin@example.com',
  password: import.meta.env.VITE_API_PASSWORD || 'admin123',
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const login = async (credentials = DEFAULT_LOGIN) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, credentials)
    const token = response?.data?.data?.token

    if (token) {
      localStorage.setItem('token', token)
      return token
    }

    return null
  } catch (error) {
    console.error('Login error:', error)
    return null
  }
}

api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('token')

    if (!token) {
      token = await login()
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')

      const newToken = await login()
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`
        return api(error.config)
      }
    }

    return Promise.reject(error)
  }
)

export default api
