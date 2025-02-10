import axios from 'services/axios'

const getMyGroups = async (): Promise<Group[]> => {
	const response = await axios.get('/group/me')
	return response.data
}

const createGroup = async (data: { name: string }) => {
	const response = await axios.post('/group', data)
	return response.data
}

const updateGroup = async (groupId: number, data: { name: string }) => {
	const response = await axios.patch(`/group/me/${groupId}`, data)
	return response.data
}

const deleteGroup = async (groupId: number) => {
	const response = await axios.delete(`/group/me/${groupId}`)
	return response.data
}

const groupService = {
	getMyGroups,
	createGroup,
	updateGroup,
	deleteGroup
}

export default groupService
