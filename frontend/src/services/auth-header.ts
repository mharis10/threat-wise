import { indexedStorageDB } from 'utils/local-forage'

export const getAuthHeader = async () => {
	const db = (await indexedStorageDB.getItem('persist:root')) as string

	const accessToken = JSON.parse(db, (_, value) => {
		if (typeof value === 'string') {
			return JSON.parse(value)
		}
		return value
	})?.auth?.accessToken

	const refreshToken = JSON.parse(db, (_, value) => {
		if (typeof value === 'string') {
			return JSON.parse(value)
		}
		return value
	})?.auth?.refreshToken

	return { accessToken: accessToken || '', refreshToken: refreshToken || '' }
}
