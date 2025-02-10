import { TemplateForm } from 'pages/admin/email-templates/create'
import { HelperForm } from 'pages/admin/email-templates/helper-form'
import axios from 'services/axios'

const getAllTemplates = async (): Promise<EmailTemplate[]> => {
	const response = await axios.get('/emailTemplate')
	return response.data
}

const getMyTemplates = async (): Promise<EmailTemplate[]> => {
	const response = await axios.get('/emailTemplate/me')
	return response.data
}

const getValidTags = async (): Promise<string[]> => {
	const response = await axios.get('/emailTemplate/validTags')
	return response.data
}

const createTemplate = async (data: TemplateForm) => {
	const response = await axios.post('/emailTemplate', data)
	return response.data
}

const sendEmail = async (employeeIds: number[], templateId: number) => {
	const response = await axios.post('/email/phishing', { employeeIds, templateId })
	return response.data
}

const updateTemplate = async (templateId: number, data: TemplateForm, role: User['role']) => {
	const endPoint =
		role === 'Super Admin' ? `/emailTemplate/${templateId}` : `/emailTemplate/me/${templateId}`
	const response = await axios.patch(endPoint, data)
	return response.data
}

const enableTemplate = async (templateId: number, role: User['role']) => {
	const endPoint =
		role === 'Super Admin'
			? `/emailTemplate/enable/${templateId}`
			: `/emailTemplate/enable/me/${templateId}`
	const response = await axios.patch(endPoint)
	return response.data
}

const disableTemplate = async (templateId: number, role: User['role']) => {
	const endPoint =
		role === 'Super Admin'
			? `/emailTemplate/disable/${templateId}`
			: `/emailTemplate/disable/me/${templateId}`
	const response = await axios.patch(endPoint)
	return response.data
}

const getTemplateHelp = async (query: HelperForm) => {
	const response = await axios.post('/gpt/emailTemplateHelp', query)
	return response.data
}

const emailTemplateService = {
	getAllTemplates,
	getMyTemplates,
	getValidTags,
	createTemplate,
	sendEmail,
	getTemplateHelp,
	updateTemplate,
	enableTemplate,
	disableTemplate
}

export default emailTemplateService
