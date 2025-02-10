import axios from 'services/axios'

const getMyStats = async (): Promise<Stats> => {
	const response = await axios.get('/stats')
	return response.data
}

const getMyStatsInsights = async (stats: Stats): Promise<{ insights: string }> => {
	const response = await axios.post('/stats/insights', stats)
	return response.data
}

const getUserStats = async (userId: number): Promise<EmployeeStats> => {
	const response = await axios.get(`/stats/${userId}`)
	return response.data
}

const getCampaignStats = async (campaignId: number): Promise<CampaignStats> => {
	const response = await axios.get(`/stats/campaign/${campaignId}`)
	return response.data
}

const statsService = {
	getMyStats,
	getMyStatsInsights,
	getCampaignStats,
	getUserStats
}

export default statsService
