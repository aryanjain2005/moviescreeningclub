import axios from 'axios'

const baseUrl =
  import.meta.env.VITE_environment === 'development'
    ? 'https://chalchitra.iitmandi.ac.in/api'
    : 'http://localhost:8000/'
export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true
  // headers: {
  //   Authorization: `Bearer ${localStorage.getItem('token')}`
  // }
})
