import { useMemo, useState } from 'react'

import { DateTime } from 'luxon'

import { AppLayout } from 'components/app/layout'
import { ListBox } from 'components/app/listbox'
import { QUERY_KEYS } from 'constants'
import { enqueueSnackbar } from 'notistack'
import { useQuery } from 'react-query'
import logsService from 'services/logs-service'

type State = {
	id: number
	name: string
}

export const ErrorLogs = () => {
	const [errorLogs, setErrorLogs] = useState<ErrorLogs[]>([])
	const [selectedOption, setSelectedOption] = useState<State>({ id: 0, name: 'Select Sort Option' })

	useQuery(QUERY_KEYS.ALL_ERROR_LOGS, logsService.getErrorLogs, {
		refetchOnWindowFocus: false,
		onSuccess(data) {
			setErrorLogs(data)
		},
		onError() {
			setErrorLogs([])
			enqueueSnackbar('Error fetching error logs', { variant: 'error' })
		}
	})

	const sortedLogs = useMemo(() => {
		if (selectedOption.id === 1) {
			return [...errorLogs].sort(
				(a, b) =>
					DateTime.fromISO(a.updatedAt).toMillis() - DateTime.fromISO(b.updatedAt).toMillis()
			)
		} else if (selectedOption.id === 2) {
			return [...errorLogs].sort(
				(a, b) =>
					DateTime.fromISO(a.createdAt).toMillis() - DateTime.fromISO(b.createdAt).toMillis()
			)
		} else {
			return errorLogs
		}
	}, [selectedOption, errorLogs])

	return (
		<AppLayout isHeaderVisible={false} isSidebarVisible>
			<div className="px-4 sm:px-6 lg:px-8 flex flex-col gap-y-8">
				<div className="sm:flex sm:items-center">
					<div className="flex flex-col md:flex-row w-full md:items-center justify-between">
						<div className="sm:flex-auto">
							<h1 className="text-base font-semibold leading-6 text-gray-900">Error Logs</h1>
							<p className="mt-2 text-sm text-gray-700">
								A list of all the error logs in your account.
							</p>
						</div>
						<div className="max-md:mt-2">
							<ListBox
								label="Sort By"
								options={[
									{ id: 0, name: 'Select Sort Option' },
									{ id: 1, name: 'Updated On' },
									{ id: 2, name: 'Created At' }
								]}
								value={selectedOption}
								onChange={value => setSelectedOption(value)}
							/>
						</div>
					</div>
				</div>
				<ul role="list" className="divide-y divide-gray-100">
					{sortedLogs.map(log => (
						<li key={log.createdAt} className="flex items-center justify-between gap-x-6 py-5">
							<div className="min-w-0">
								<div className="flex items-start gap-x-3">
									<svg
										className="h-5 w-5"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
										<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
										<g id="SVGRepo_iconCarrier">
											<path
												d="M17 17L21 21M21 17L17 21M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H13M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19M19 9V14M9 17H13M9 13H15M9 9H10"
												stroke="#e81111"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"></path>{' '}
										</g>
									</svg>
									<p className="text-sm font-semibold capitalize leading-6 text-gray-900">
										{log.filename}
									</p>
								</div>
								<div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
									<p className="whitespace-nowrap">
										Updated on{' '}
										<time dateTime={DateTime.fromISO(log.updatedAt).toFormat('LLLL dd, yyyy')}>
											{DateTime.fromISO(log.updatedAt).toFormat('LLLL dd, yyyy')}
										</time>
									</p>
									<svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
										<circle cx={1} cy={1} r={1} />
									</svg>
									<p className="truncate">
										Created at {DateTime.fromISO(log.createdAt).toFormat('LLLL dd, yyyy')}
									</p>
								</div>
							</div>
							<div
								onClick={() => logsService.downloadErrorLog(log.filename)}
								className="flex flex-none items-center gap-x-4">
								<button className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 block">
									Download<span className="sr-only">, {log.filename}</span>
								</button>
							</div>
						</li>
					))}
				</ul>
			</div>
		</AppLayout>
	)
}
