import axios from 'axios'

const baseUrl =
  import.meta.env.VITE_environment === 'development'
    ? 'http://chalchitra.iitmandi.ac.in/api'
    : '/api'
export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true
  // headers: {
  //   Authorization: `Bearer ${localStorage.getItem('token')}`
  // }
})
