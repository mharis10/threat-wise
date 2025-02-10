import axios from 'services/axios'

const getAllLogs = async (): Promise<Logs[]> => {
	const response = await axios.get('/log')
	return response.data
}

const getErrorLogs = async (): Promise<ErrorLogs[]> => {
	const response = await axios.get('/log/error')
	return response.data
}

const downloadErrorLog = async (filename: string) => {
	const response = await axios({
		url: `/log/error/download/${filename}`,
		method: 'GET',
		responseType: 'blob'
	})
	const url = window.URL.createObjectURL(new Blob([response.data]))
	const link = document.createElement('a')
	link.href = url
	link.setAttribute('download', filename)
	document.body.appendChild(link)
	link.click()

	if (document.body.contains(link)) {
		document.body.removeChild(link)
	}
}

const logsService = {
	getAllLogs,
	getErrorLogs,
	downloadErrorLog
}

export default logsService
