import { CellContext } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { enqueueSnackbar } from 'notistack'
import { cn } from 'utils/cn'

import { Spinner } from 'components/animation/spinner'
import { AppLayout } from 'components/app/layout'
import { Table } from 'components/app/table'
import { QUERY_KEYS } from 'constants'
import { useNavigate } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import statsService from 'services/stats-service'

export const Stats = () => {
	const navigate = useNavigate()

	const [stats, setStats] = useState<Stats>()
	const [insights, setInsights] = useState<string>()
	const [searchText, setSearchText] = useState<string>()

	useQuery(QUERY_KEYS.ALL_STATS, statsService.getMyStats, {
		refetchOnWindowFocus: false,
		onSuccess(data) {
			setStats(data)
		},
		onError() {
			setStats(undefined)
			enqueueSnackbar('Error fetching stats', { variant: 'error' })
		}
	})

	const { refetch, isLoading, isFetching } = useQuery(
		QUERY_KEYS.STAT_INSIGHTS,
		() => statsService.getMyStatsInsights(stats as Stats),
		{
			enabled: false,
			refetchOnWindowFocus: false,
			onSuccess(data) {
				setInsights(data.insights)
			},
			onError() {
				setStats(undefined)
				enqueueSnackbar('Error fetching stats insights', { variant: 'error' })
			}
		}
	)

	const filteredStats = useMemo(() => {
		if (stats) {
			const { filteredStats } = stats.employeeStats.reduce(
				(prev, curr) => {
					if (searchText) {
						const fullName = curr.firstName + ' ' + curr.lastName
						const status = curr.isActive ? 'Active' : 'Inactive'
						if (
							curr.email.toLowerCase().includes(searchText.toLowerCase()) ||
							fullName.toLowerCase().includes(searchText.toLowerCase()) ||
							curr.stats.emailOpenCount.toString().includes(searchText) ||
							curr.stats.reportPhishingCount.toString().includes(searchText) ||
							status.toLowerCase().includes(searchText.toLowerCase())
						) {
							return { filteredStats: [...prev.filteredStats, curr] }
						}
					} else {
						return { filteredStats: [...prev.filteredStats, curr] }
					}
					return prev
				},
				{
					filteredStats: [] as Stats['employeeStats']
				}
			)
			return { filteredStats }
		}
	}, [stats, searchText])

	const columns = [
		{
			header: 'Name',
			accessorFn: (row: User) => `${row.firstName} ${row.lastName}`
		},
		{
			header: 'Email',
			accessorKey: 'email'
		},
		{
			header: 'Email Open Count',
			accessorKey: 'stats.emailOpenCount'
		},
		{
			header: 'Report Phishing Count',
			accessorKey: 'stats.reportPhishingCount'
		},
		{
			header: 'Status',
			accessorKey: 'isActive',
			cell: (data: CellContext<Stats, 'isActive'>) => (
				<span
					className={cn(
						'inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium ring-1 ring-inset ',
						data.getValue() ? 'text-green-700 ring-green-600/20' : 'text-red-700 ring-red-600/20'
					)}>
					{data.getValue() ? 'Active' : 'Inactive'}
				</span>
			)
		}
	]

	const data = [
		{
			name: 'Employees',
			active: stats?.activeEmployees ?? 0,
			nonActive: stats?.nonActiveEmployees ?? 0,
			total: stats?.totalEmployees ?? 0
		}
	]

	const parseInsights = (insights: string) => {
		const sections = insights.split(/###\s+/).filter(Boolean)
		return sections.map((section, index) => {
			const [title, ...content] = section.split('\n').filter(Boolean)
			const parsedContent = content
				.map(line => {
					const subheading = line.match(/^\*\*(.*)\*\*$/)
					if (subheading) {
						return `<strong>${subheading[1]}</strong>`
					} else if (line.startsWith('- **')) {
						const [boldPart, rest] = line.split('**:')
						return `<strong>${boldPart.replace(/- \*\*/, '')?.trim()}</strong>: ${rest?.trim()}`
					}
					return line
				})
				.join('\n')
				.replace(/\*\*/g, '')
			return {
				title: title.trim(),
				content: parsedContent.trim().replace(/\n/g, '<br />')
			}
		})
	}

	return (
		<AppLayout isHeaderVisible={false} isSidebarVisible>
			<div className="px-4 sm:px-6 lg:px-8">
				<div className="sm:flex sm:items-center">
					<div className="sm:flex-auto">
						<h1 className="text-base font-semibold leading-6 text-gray-900">Stats</h1>
					</div>
					<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
						<button
							type="button"
							disabled={isLoading || isFetching}
							onClick={() => refetch()}
							className="block rounded-md bg-darkBlue px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
							{isLoading || isFetching ? (
								<div className="flex items-center justify-center gap-x-5">
									<Spinner />
									<span className="animate-pulse whitespace-nowrap">Please Wait...</span>
								</div>
							) : (
								'Fetch Insights'
							)}
						</button>
					</div>
				</div>

				<ResponsiveContainer height={300}>
					<BarChart className="mt-10 hover:bg-white w-full" width={900} height={300} data={data}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" />
						<YAxis />
						<Tooltip />
						<Legend />
						<Bar dataKey="active" fill="green" name="Active" />
						<Bar dataKey="nonActive" fill="red" name="Non Active" />
						<Bar dataKey="total" fill="blue" name="Total" />
					</BarChart>
				</ResponsiveContainer>

				{insights && (
					<div className="mt-6 bg-white p-6 rounded-lg shadow-md space-y-6">
						{parseInsights(insights).map((section, index) => (
							<div key={index} className="space-y-2">
								<h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
								<p
									className="text-sm text-gray-700 whitespace-pre-line"
									dangerouslySetInnerHTML={{ __html: section.content }}></p>
							</div>
						))}
					</div>
				)}

				<input
					style={{ boxShadow: '0px 6px 24px 0px rgba(18, 50, 88, 0.08)' }}
					type="text"
					placeholder="Search Term..."
					value={searchText}
					onChange={e => setSearchText(e.target.value)}
					className="rounded mt-4 max-md:w-full md:w-1/3 font-normal py-2 pl-4 bg-white focus:ring-0 border disabled:text-gray-500 focus:border-secondary focus-visible:outline-none border-[#D3E3F1] text-primary placeholder-[#7F9AB2] placeholder:text-sm focus:outline-none text-sm"
				/>
				<div className="mt-6 flow-root">
					<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
						<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
							{filteredStats?.filteredStats && (
								<Table
									data={filteredStats.filteredStats}
									columns={columns}
									onRowClick={(userId: number) => navigate(`/admin/stats/${userId}`)}
									className="table-auto"
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
