export const SERVERIP =
	import.meta.env.VITE_environment === 'development'
		? 'https://chalchitra.iitmandi.ac.in/api'
		: '/api'
