import { ContactUsForm } from 'pages/contact-us'
import { PricingForm } from 'pages/pricing'
import axios from 'services/axios'

const requestDemo = async (data: PricingForm) => {
	const response = await axios.post('/email/requestDemo', data)
	return response.data
}

const contactUs = async (data: ContactUsForm) => {
	const response = await axios.post('/email/contactUs', data)
	return response.data
}

const sendEmail = async (data: { campaignId: number; templateId: number }) => {
	const response = await axios.post('/email/phishing', data)
	return response.data
}

const emailService = {
	requestDemo,
	sendEmail,
	contactUs
}

export default emailService
