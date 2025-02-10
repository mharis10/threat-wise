import { CreateCampaignRecipients } from 'pages/admin/email-campaigns/members'
import axios from 'services/axios'

const getMyCampaigns = async (): Promise<Campaign[]> => {
	const response = await axios.get('/campaign/me')
	return response.data
}

const createCampaign = async (data: { name: string }) => {
	const response = await axios.post('/campaign', data)
	return response.data
}

const getCampaignRecipients = async (campaignId: number): Promise<CampaignRecipient[]> => {
	const response = await axios.get(`/campaignRecipient/me/${campaignId}`)
	return response.data
}

const addCampaignRecipients = async (data: CreateCampaignRecipients) => {
	const response = await axios.post('/campaignRecipient/add', data)
	return response.data
}

const updateCampaign = async (campaignId: Campaign['id'], data: { name: string }) => {
	const response = await axios.patch(`/campaign/me/${campaignId}`, data)
	return response.data
}

const deleteCampaign = async (campaignId: Campaign['id']) => {
	const response = await axios.delete(`/campaign/me/${campaignId}`)
	return response.data
}

const deleteCampaignRecipient = async (campaignId: Campaign['id'], userId: number) => {
	const response = await axios.post(`/campaignRecipient/remove`, { campaignId, userId })
	return response.data
}

const emailCampaignService = {
	getMyCampaigns,
	createCampaign,
	getCampaignRecipients,
	addCampaignRecipients,
	deleteCampaignRecipient,
	updateCampaign,
	deleteCampaign
}

export default emailCampaignService
