import { AppLayout } from 'components/app/layout'
import { QUERY_KEYS } from 'constants'
import { enqueueSnackbar } from 'notistack'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import statsService from 'services/stats-service'

export const EmployeeStats = () => {
	const { id } = useParams() as { id: string }

	const [userStat, setUserStat] = useState<EmployeeStats>()

	useQuery(QUERY_KEYS.GET_USER_STATS, () => statsService.getUserStats(Number(id)), {
		refetchOnWindowFocus: false,
		onSuccess(data) {
			setUserStat(data)
		},
		onError() {
			setUserStat(undefined)
			enqueueSnackbar('Error fetching stats', { variant: 'error' })
		}
	})

	return (
		<AppLayout isHeaderVisible={false} isSidebarVisible>
			<div className="px-4 sm:px-6 lg:px-8">
				<div className="px-4 sm:px-0">
					<h3 className="text-base font-semibold leading-7 text-gray-900">
						{userStat?.firstName + ' ' + userStat?.lastName} Stats
					</h3>
				</div>
				<div className="mt-6 border-t border-gray-100">
					<dl className="divide-y divide-gray-100">
						<div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
							<dt className="text-sm font-medium leading-6 text-gray-900">Full name</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
								{userStat?.firstName + ' ' + userStat?.lastName}
							</dd>
						</div>

						<div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
							<dt className="text-sm font-medium leading-6 text-gray-900">Email address</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
								{userStat?.email}
							</dd>
						</div>
						<div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
							<dt className="text-sm font-medium leading-6 text-gray-900">Email open count</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
								{userStat?.stats.emailOpenCount}
							</dd>
						</div>
						<div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
							<dt className="text-sm font-medium leading-6 text-gray-900">Report phishing count</dt>
							<dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
								{userStat?.stats.reportPhishingCount}
							</dd>
						</div>
					</dl>
				</div>
			</div>
		</AppLayout>
	)
}
