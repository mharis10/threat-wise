import axios from 'axios'
import newAxios from 'services/axios'
import { apiHost } from 'utils/host'
import { indexedStorageDB } from 'utils/local-forage'

const login = async (email: string, password: string): Promise<any> => {
	const response = await axios.post(apiHost + '/auth', {
		email,
		password
	})
	return {
		user: response.data.user,
		accessToken: response.headers['access-token'],
		refreshToken: response.headers['refresh-token']
	}
}

const validateEmail = async (email: string): Promise<any> => {
	const response = await axios.post(apiHost + '/email/resetPassword', {
		email
	})
	return response.data
}

const resetPassword = async (newPassword: string, token: string): Promise<any> => {
	const response = await axios.patch(
		apiHost + '/auth/resetPassword',
		{ newPassword },
		{ headers: { 'Access-Token': token } }
	)
	return response.data
}

const updatePassword = async (oldPassword: string, newPassword: string) => {
	const response = await newAxios.patch('/auth/updatePassword', { oldPassword, newPassword })
	return response.data
}

const setupPassword = async (newPassword: string, token: string) => {
	const response = await axios.patch(
		apiHost + '/auth/setupPassword',
		{ newPassword },
		{ headers: { 'Access-Token': token } }
	)
	return response.data
}

const logout = async () => {
	await newAxios.post('/auth/logout')
	indexedStorageDB.clear()
	window.location.reload()
}

const authService = {
	login,
	logout,
	setupPassword,
	validateEmail,
	resetPassword,
	updatePassword
}

export default authService
