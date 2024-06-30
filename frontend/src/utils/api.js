import axios from 'axios'

const baseUrl =
  import.meta.env.VITE_environment === 'development'
    ? 'http://localhost:8000'
    : '/api'
export const api = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})
