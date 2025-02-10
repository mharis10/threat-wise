let fallbackHost: string | undefined = 'localhost:3000'
let host = fallbackHost

let schemeForHttp = 'https://'

if (host === 'localhost:3000') {
	schemeForHttp = 'http://'
}

export const apiHost = schemeForHttp + host + '/api'
