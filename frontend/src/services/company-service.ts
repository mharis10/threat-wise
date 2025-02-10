import { CompanyForm } from 'pages/admin/companies/create'
import axios from 'services/axios'

const getAllCompanies = async (): Promise<Company[]> => {
	const response = await axios.get('/company')
	return response.data
}

const getMyCompany = async (): Promise<Company> => {
	const response = await axios.get('/company/me')
	return response.data
}

const createCompany = async (data: CompanyForm) => {
	const response = await axios.post('/company', data)
	return response.data
}

const updateCompany = async (companyId: number, data: CompanyForm, role: User['role']) => {
	const endPoint = role === 'Super Admin' ? `/company/${companyId}` : '/company/me'
	const response = await axios.patch(endPoint, data)
	return response.data
}

const enableCompany = async (companyId: number, role: User['role']) => {
	const endPoint = role === 'Super Admin' ? `/company/enable/${companyId}` : '/company/enable/me/'
	const response = await axios.patch(endPoint)
	return response.data
}

const disableCompany = async (companyId: number, role: User['role']) => {
	const endPoint = role === 'Super Admin' ? `/company/disable/${companyId}` : '/company/disable/me/'
	const response = await axios.patch(endPoint)
	return response.data
}

const companyService = {
	getAllCompanies,
	getMyCompany,
	createCompany,
	enableCompany,
	updateCompany,
	disableCompany
}

export default companyService
