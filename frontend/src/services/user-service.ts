import { AdminForm, EmployeeForm } from 'pages/admin/users/create'
import axios from 'services/axios'

const getAllUsers = async (): Promise<User[]> => {
	const response = await axios.get('/user')
	return response.data
}

const getMyUser = async (): Promise<User> => {
	const response = await axios.get('/user/me')
	return response.data
}

const getAllEmployees = async (): Promise<User[]> => {
	const response = await axios.get('/user/employees')
	return response.data
}

const validateEmployeeData = async (data: FormData): Promise<ValidateUser> => {
	const response = await axios.post('/company/verifyData', data, {
		headers: { 'Content-Type': 'multipart/form-data' }
	})
	return response.data
}

const registerAdmin = async (data: AdminForm) => {
	const response = await axios.post('/user/registerCompanyAdmin', data)
	return response.data
}

const registerEmployee = async (data: EmployeeForm) => {
	const response = await axios.post('/user/registerCompanyEmployee', data)
	return response.data
}

const updateUser = async (userId: number, data: EmployeeForm) => {
	const response = await axios.patch(`/user/${userId}`, data)
	return response.data
}

const populateEmployee = async (data: FormData) => {
	const response = await axios.post('/company/populateData', data, {
		headers: { 'Content-Type': 'multipart/form-data' }
	})
	return response.data
}

const deleteEmployee = async (employeeId: number) => {
	const response = await axios.delete(`/user/employee/${employeeId}`)
	return response.data
}

const enableUser = async (userId: number) => {
	const response = await axios.patch(`/user/enable/${userId}`)
	return response.data
}

const disableUser = async (userId: number) => {
	const response = await axios.patch(`/user/disable/${userId}`)
	return response.data
}

const downloadTemplate = async () => {
	const response = await axios({
		url: `/company/downloadTemplate`,
		method: 'GET',
		responseType: 'blob'
	})
	const url = window.URL.createObjectURL(new Blob([response.data]))
	const link = document.createElement('a')
	link.href = url
	link.setAttribute('download', 'Sample Template.xlsx')
	document.body.appendChild(link)
	link.click()

	if (document.body.contains(link)) {
		document.body.removeChild(link)
	}
}

const userService = {
	getAllUsers,
	getAllEmployees,
	downloadTemplate,
	populateEmployee,
	getMyUser,
	updateUser,
	registerAdmin,
	registerEmployee,
	enableUser,
	deleteEmployee,
	validateEmployeeData,
	disableUser
}

export default userService
