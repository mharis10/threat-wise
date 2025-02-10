import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

// Import other components as necessary
import { useAppSelector } from 'hooks'
import FeaturesPage from 'pages/FeaturesPage'
import { Companies } from 'pages/admin/companies'
import { EmailCampaigns } from 'pages/admin/email-campaigns'
import { CreateOrEditCampaign } from 'pages/admin/email-campaigns/create'
import { CampaignMembers } from 'pages/admin/email-campaigns/members'
import { EmailTemplates } from 'pages/admin/email-templates'
import { CreateEmailTemplates } from 'pages/admin/email-templates/create-template'
import { ErrorLogs } from 'pages/admin/error-logs'
import { Groups } from 'pages/admin/groups'
import { GroupMembers } from 'pages/admin/groups/members'
import { Logs } from 'pages/admin/logs'
import { Users } from 'pages/admin/users'
import { EmployeeStats } from 'pages/admin/users/employee-stat'
import { Stats } from 'pages/admin/users/stats'
import { Login } from 'pages/auth/login'
import { ResetPassword } from 'pages/auth/reset-password'
import { Settings } from 'pages/auth/setup-password'
import { UpdatePassword } from 'pages/auth/update-password'
import { Blog } from 'pages/blog'
import { ContactUs } from 'pages/contact-us'
import { Home } from 'pages/home'
import { Pricing } from 'pages/pricing'

const Routing = () => {
	const auth = useAppSelector(state => state.auth)
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route
					path="/login"
					element={
						<PublicRoute auth={auth}>
							<Login />
						</PublicRoute>
					}
				/>
				<Route
					path="/reset-password"
					element={
						<PublicRoute auth={auth}>
							<ResetPassword />
						</PublicRoute>
					}
				/>
				<Route path="/contact-us" element={<ContactUs />} />
				<Route path="/pricing" element={<Pricing />} />
				<Route path="/blog" element={<Blog />} />
				<Route path="/blog/:id" element={<Blog />} />
				<Route path="/features" element={<FeaturesPage />} />
				<Route path="/settings" element={<Settings />} />
				<Route
					path="/update-password"
					element={
						<ProtectedRoute auth={auth}>
							<UpdatePassword />
						</ProtectedRoute>
					}
				/>
				<Route path="/admin">
					<Route path="users">
						<Route
							path="list"
							element={
								<ProtectedRoute auth={auth}>
									<Users />
								</ProtectedRoute>
							}
						/>
						<Route path="groups">
							<Route
								index
								element={
									<ProtectedRoute auth={auth}>
										<Groups />
									</ProtectedRoute>
								}
							/>
							<Route
								path=":id/members"
								element={
									<ProtectedRoute auth={auth}>
										<GroupMembers />
									</ProtectedRoute>
								}
							/>
						</Route>
					</Route>

					<Route path="stats">
						<Route
							index
							element={
								<ProtectedRoute customRedirect={auth.user?.role !== 'Company Admin'} auth={auth}>
									<Stats />
								</ProtectedRoute>
							}
						/>
						<Route
							path=":id"
							element={
								<ProtectedRoute customRedirect={auth.user?.role !== 'Company Admin'} auth={auth}>
									<EmployeeStats />
								</ProtectedRoute>
							}
						/>
					</Route>
					<Route
						path="companies"
						element={
							<ProtectedRoute auth={auth}>
								<Companies />
							</ProtectedRoute>
						}
					/>
					<Route path="email-templates">
						<Route
							path="list"
							element={
								<ProtectedRoute auth={auth}>
									<EmailTemplates />
								</ProtectedRoute>
							}
						/>
						<Route
							path="create"
							element={
								<ProtectedRoute auth={auth}>
									<CreateEmailTemplates />
								</ProtectedRoute>
							}
						/>
					</Route>
					<Route path="email-campaigns">
						<Route
							path="list"
							element={
								<ProtectedRoute auth={auth}>
									<EmailCampaigns />
								</ProtectedRoute>
							}
						/>
						<Route
							path="create/:id?"
							element={
								<ProtectedRoute auth={auth}>
									<CreateOrEditCampaign />
								</ProtectedRoute>
							}
						/>
						<Route
							path=":id/recipients"
							element={
								<ProtectedRoute auth={auth}>
									<CampaignMembers />
								</ProtectedRoute>
							}
						/>
					</Route>
					<Route
						path="logs"
						element={
							<ProtectedRoute customRedirect={auth.user?.role !== 'Super Admin'} auth={auth}>
								<Logs />
							</ProtectedRoute>
						}
					/>
					<Route
						path="error-logs"
						element={
							<ProtectedRoute customRedirect={auth.user?.role !== 'Super Admin'} auth={auth}>
								<ErrorLogs />
							</ProtectedRoute>
						}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

type RouteProps = {
	redirectPath?: string
	children: React.ReactNode
	customRedirect?: boolean
	auth: AuthState
}

const ProtectedRoute = ({ auth, children, customRedirect, redirectPath = '/' }: RouteProps) => {
	if (!auth?.accessToken || customRedirect) {
		return <Navigate to={redirectPath} replace={true} />
	}

	return children
}

const PublicRoute = ({ auth, children, customRedirect, redirectPath = '/' }: RouteProps) => {
	if (auth?.accessToken || customRedirect) {
		return <Navigate to={redirectPath} replace={true} />
	}

	return children
}

export default Routing
