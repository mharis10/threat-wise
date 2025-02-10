import axios from 'services/axios'

const getMyGroupMembers = async (groupId: number): Promise<GroupMember[]> => {
	const response = await axios.get(`/groupMember/me/${groupId}`)
	return response.data
}

const addGroupMembers = async (data: { groupId: number; userIds: number[] }) => {
	const response = await axios.post('/groupMember/add', data)
	return response.data
}

const removeGroupMember = async (groupId: number, userId: number) => {
	const response = await axios.post(`/groupMember/remove`, { groupId, userId })
	return response.data
}

const groupMemberService = {
	getMyGroupMembers,
	addGroupMembers,
	removeGroupMember
}

export default groupMemberService
