interface AuthState {
	user: User | null
	accessToken: string | null
	refreshToken: string | null
}

interface Company {
	id: number
	name: string
	industry: string
	email: string
	address: string
	currentMailBoxes: number
	maxMailBoxes: number
	currentAdmins: number
	maxAdmins: number
	contractStartDate: string
	contractLength: string
	companyEmail: string
	companyAddress: string
	trainingVideos: boolean
	smsPhishingSimulation: boolean
	widget: boolean
	chatgptIntegration: boolean
	rewards: boolean
	lastUpdated: string
	price: number
	isActive: boolean
	createdTimestamp: string
	updatedTimestamp: string
}

interface User {
	id: number
	firstName: string
	lastName: string
	email: string
	location: string
	department: string
	language: string
	jobTitle: string
	phoneNumber: string
	startDate: string | null
	endDate: string | null
	companyId: string | null
	createdTimestamp: string
	updatedTimestamp: string
	role: 'Company Employee' | 'Company Admin' | 'Super Admin'
	isActive: boolean
}

interface Logs {
	User: User & ({ Company: { name: string } } | null)
	userId: number
	id: number
	message: string
	createdTimestamp: string
	action: string
}

interface EmailTemplate {
	id: number
	title: string
	User: User
	body: string
	createdTimestamp: string
	modifiedTimestamp: string
	isActive: boolean
	userId: number
	subject: string
	tags: string[]
}

interface ErrorLogs {
	filename: string
	createdAt: string
	updatedAt: string
}

interface EmployeeStats {
	id: number
	firstName: string
	lastName: string
	isActive: boolean
	email: string
	stats: {
		emailOpenCount: number
		reportPhishingCount: number
	}
}

interface Stats {
	activeEmployees: number
	employeeStats: EmployeeStats[]
	nonActiveEmployees: number
	totalEmployees: number
	insights: string
}

interface Group {
	id: number
	companyId: number
	name: string
	createdTimestamp: string
}

interface GroupMember {
	id: number
	groupId: number
	userId: number
	User: {
		firstName: string
		lastName: string
		email: string
	}
}

interface ValidateUser {
	missingColumns: string[]
	validationErrors: {}
	duplicateUsersInDb: string[]
	message: string
}

interface Campaign {
	id: number
	companyId: number
	name: string
	createdTimestamp: string
}

interface CampaignRecipient {
	id: number
	campaignId: number
	userId: number
	emailOpenCount: number
	reportPhishingCount: number
	User: {
		firstName: string
		lastName: string
		email: string
	}
}

interface CampaignStats {
	overallStats: {
		emailOpenCount: number
		reportPhishingCount: number
	}
	totalRecipients: number
	individualStats: {
		userId: number
		firstName: string
		lastName: string
		email: string
		isActive: boolean
		emailOpenCount: number
		reportPhishingCount: number
	}[]
}

type Maybe<T> = T | null
