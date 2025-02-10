import axios from 'axios'

import { enqueueSnackbar } from 'notistack'
import { getAuthHeader } from 'services/auth-header'
import { apiHost } from 'utils/host'
import { indexedStorageDB } from 'utils/local-forage'

axios.defaults.baseURL = apiHost

const axiosInstance = axios.create({
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json; charset=UTF-8'
	}
})

axiosInstance.interceptors.request.use(async config => {
	const tokens = await getAuthHeader()
	config.headers['access-token'] = tokens.accessToken
	config.headers['refresh-token'] = tokens.refreshToken
	return config
})

axiosInstance.interceptors.response.use(
	response => {
		return response
	},
	error => {
		if (!error.response) {
			enqueueSnackbar('Service not available!', { variant: 'error' })
		} else if (error.response.status === 401) {
			enqueueSnackbar('Session has been expired, login again!', { variant: 'error' })
			setTimeout(() => {
				indexedStorageDB.clear()
				window.location.reload()
			}, 1000)
		}

		return Promise.reject(error)
	}
)

export const parseErrorResponse = (error: any) => {
	return (
		error.response?.data?.message ||
		error.response?.data?.errors ||
		error.response?.data?.error ||
		error.message ||
		error.toString()
	)
}

export default axiosInstance
