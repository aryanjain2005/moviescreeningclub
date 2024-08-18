import axios from 'axios'

const baseUrl =
  import.meta.env.VITE_environment === 'development'
<<<<<<< HEAD
    ? 'http://localhost:8000'
=======
    ? 'http://localhost:8000/api'
>>>>>>> food
    : 'https://chalchitra.iitmandi.ac.in/api'
export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true
})
