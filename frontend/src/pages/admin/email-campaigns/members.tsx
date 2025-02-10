import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { CellContext } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import { enqueueSnackbar } from 'notistack'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import ConfirmationPrompt from 'components/app/confirmation-prompt'
import { AppLayout } from 'components/app/layout'
import { Modal } from 'components/app/modal'
import { Table } from 'components/app/table'
import { QUERY_KEYS } from 'constants'
import useIsMobile from 'hooks/useIsMobile'
import emailCampaignService from 'services/email-campaign-service'
import statsService from 'services/stats-service'
import { CreateCampaignRecipients } from './create'

type State = isModalVisible | undefined

type isModalVisible = {
	visibility: boolean
	id?: number | undefined
}

export type CreateCampaignRecipients = {
	campaignId: number
	userIds: number[]
	groupIds: number[]
}

export const CampaignMembers = () => {
	const { id: campaignId } = useParams() as { id: string }
	const isMobile = useIsMobile()
	const [campaignMembers, setCampaignMembers] = useState<CampaignRecipient[]>([])
	const [selectedCampaign, setSelectedCampaign] = useState<CampaignRecipient>()
	const [campaignStats, setCampaignStats] = useState<CampaignStats>()
	const [searchText, setSearchText] = useState<string>()
	const [modalState, setModalState] = useState<State>({
		visibility: false,
		id: undefined
	})
	const [deletePrompt, setDeletePrompt] = useState<State>({
		visibility: false,
		id: undefined
	})

	useQuery(QUERY_KEYS.CAMPAIGN_STATS, () => statsService.getCampaignStats(Number(campaignId)), {
		refetchOnWindowFocus: false,
		enabled: !!campaignId,
		onSuccess(data) {
			setCampaignStats(data)
		},
		onError() {
			setCampaignStats(undefined)
			enqueueSnackbar('Error fetching campaign stats', { variant: 'error' })
		}
	})

	const { refetch } = useQuery(
		QUERY_KEYS.GET_CAMPAIGN_MEMBERS,
		() => emailCampaignService.getCampaignRecipients(Number(campaignId)),
		{
			refetchOnWindowFocus: false,
			enabled: !!campaignId,
			onSuccess(data) {
				setCampaignMembers(data)
			},
			onError() {
				setCampaignMembers([])
				enqueueSnackbar('Error fetching campaign recipients', { variant: 'error' })
			}
		}
	)

	const { mutate: removeCampaignMember } = useMutation({
		mutationKey: QUERY_KEYS.DELETE_CAMPAIGN_MEMBERS,
		mutationFn: (userId: number) =>
			emailCampaignService.deleteCampaignRecipient(Number(campaignId), userId),
		onSuccess: () => {
			enqueueSnackbar('Campaign recipient removed successfully')
			setDeletePrompt(undefined)
			refetch()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const { filteredCampaignMembers } = useMemo(() => {
		const { filteredCampaignMembers } = campaignMembers.reduce(
			(prev, curr) => {
				if (searchText) {
					const memberName = curr.User.firstName + ' ' + curr.User.lastName
					if (
						memberName?.toLowerCase().includes(searchText.toLowerCase()) ||
						curr.User.email.toLowerCase().includes(searchText.toLowerCase())
					) {
						return { filteredCampaignMembers: [...prev.filteredCampaignMembers, curr] }
					}
				} else {
					return { filteredCampaignMembers: [...prev.filteredCampaignMembers, curr] }
				}
				return prev
			},
			{
				filteredCampaignMembers: [] as CampaignRecipient[]
			}
		)
		return { filteredCampaignMembers }
	}, [campaignMembers, searchText])

	const columns = [
		{
			header: 'Id',
			accessorKey: 'id'
		},
		{
			header: 'Name',
			accessorFn: (row: CampaignRecipient) => `${row.User.firstName} ${row.User.lastName}`
		},
		{
			header: 'Email',
			accessorKey: 'User.email'
		},
		{
			header: 'Email Open Count',
			accessorKey: 'emailOpenCount',
			cell: (data: CellContext<CampaignRecipient, 'emailOpenCount'>) => (
				<p className="text-center">{data.getValue()}</p>
			)
		},
		{
			header: 'Report Phishing Count',
			accessorKey: 'reportPhishingCount',
			cell: (data: CellContext<CampaignRecipient, 'reportPhishingCount'>) => (
				<p className="text-center">{data.getValue()}</p>
			)
		},
		{
			id: 'action-campaign-recipient',
			cell: (data: CellContext<CampaignRecipient, 'id'>) => (
				<div className="flex justify-end gap-x-1 items-center">
					{(data.row.original as CampaignRecipient).emailOpenCount +
						(data.row.original as CampaignRecipient).reportPhishingCount >
						0 && (
						<span
							onClick={() => setSelectedCampaign(data.row.original)}
							className="inline-flex cursor-pointer items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium ring-1 ring-inset text-green-500 ring-green-600/20">
							View Graph
						</span>
					)}
					<span
						onClick={event => {
							event.stopPropagation()
							setDeletePrompt({
								visibility: true,
								id: (data.row.original as CampaignRecipient).userId
							})
						}}
						className="inline-flex cursor-pointer items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium ring-1 ring-inset text-primaryRed ring-red-600/20">
						Delete
					</span>
				</div>
			)
		}
	]

	const statsData = [
		{
			name: isMobile ? 'Email Count' : 'Email Open Count',
			value: campaignStats?.overallStats.emailOpenCount
		},
		{
			name: isMobile ? 'Phishing Count' : 'Report Phishing Count',
			value: campaignStats?.overallStats.reportPhishingCount
		},
		{
			name: isMobile ? 'Total Count' : 'Total Recipients Count',
			value: campaignStats?.totalRecipients
		}
	]

	const COLORS = ['#0088FE', '#FF8042', '#00C49F']

	const RADIAN = Math.PI / 180
	const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
		const radius = innerRadius + (outerRadius - innerRadius) * 0.5

		const x = cx + radius * Math.cos(-midAngle * RADIAN)
		const y = cy + radius * Math.sin(-midAngle * RADIAN)

		return (
			<text
				x={x}
				y={y}
				fill="white"
				textAnchor={x > cx ? 'start' : 'end'}
				dominantBaseline="central">
				{value?.toLocaleString()}
			</text>
		)
	}

	if (selectedCampaign) {
		const data = [
			{
				name: isMobile ? 'Email Count' : 'Email Open Count',
				value: selectedCampaign.emailOpenCount || 0
			},
			{
				name: isMobile ? 'Phishing Count' : 'Report Phishing Count',
				value: selectedCampaign.reportPhishingCount || 0
			}
		]

		const COLORS = ['#0088FE', '#FF8042']

		const RADIAN = Math.PI / 180
		const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
			const radius = innerRadius + (outerRadius - innerRadius) * 0.5

			const x = cx + radius * Math.cos(-midAngle * RADIAN)
			const y = cy + radius * Math.sin(-midAngle * RADIAN)

			return (
				<text
					x={x}
					y={y}
					fill="white"
					textAnchor={x > cx ? 'start' : 'end'}
					dominantBaseline="central">
					{value?.toLocaleString()}
				</text>
			)
		}

		return (
			<AppLayout isHeaderVisible={false} isSidebarVisible>
				<Modal
					isFullHeight
					showCrossIcon={!isMobile}
					width="w-[900px]"
					noPadding
					onClose={() => setSelectedCampaign(undefined)}>
					<div className="grid max-md:p-5 md:px-8 pt-4 grid-cols-3 items-center">
						<ChevronLeftIcon
							className="h-5 w-5 md:hidden cursor-pointer"
							onClick={() => setSelectedCampaign(undefined)}
						/>
						<div className="max-md:hidden" />
						<h1 className="text-primary text-center text-[20px] max-md:text-center whitespace-nowrap max-md:text-sm font-domine font-bold">
							{selectedCampaign.User.firstName + ' ' + selectedCampaign.User.lastName} Stats
						</h1>
						<div />
					</div>
					<ResponsiveContainer
						className="mx-auto"
						width={isMobile ? '90%' : '100%'}
						height={isMobile ? 300 : 400}>
						<PieChart width={isMobile ? 800 : 300} height={isMobile ? 500 : 300}>
							<Tooltip />
							<Legend />
							<Pie
								data={data}
								cx="50%"
								cy="50%"
								labelLine={false}
								label={renderCustomizedLabel}
								outerRadius={isMobile ? 100 : 150}
								fill="#8884d8"
								dataKey="value">
								{data.map((_entry, index) => (
									<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
				</Modal>
			</AppLayout>
		)
	}

	return (
		<AppLayout isHeaderVisible={false} isSidebarVisible>
			{deletePrompt?.visibility && (
				<ConfirmationPrompt
					title="Delete Campaign Recipient"
					label="Enter delete to confirm your action"
					onDelete={() => removeCampaignMember(deletePrompt.id as number)}
					isOpen={deletePrompt.visibility}
					onClose={() => setDeletePrompt(undefined)}
				/>
			)}
			{modalState?.visibility && (
				<Modal isFullHeight width="w-[900px]" noPadding onClose={() => setModalState(undefined)}>
					<div className="sticky max-md:grid max-md:grid-flow-col max-md:auto-cols-auto md:flex items-center md:justify-between top-0 z-10 bg-white max-md:p-5 md:px-8 py-4 border-b border-border">
						<ChevronLeftIcon
							onClick={() => setModalState(undefined)}
							className="w-3 h-3 md:hidden cursor-pointer"
						/>
						<h1 className="text-primary text-[20px] max-md:text-center whitespace-nowrap max-md:text-sm font-domine font-bold">
							Add Campaign Recipients
						</h1>
						<div className="md:hidden" />
						<XMarkIcon
							onClick={() => setModalState(undefined)}
							className="text-primary max-md:hidden bg-white h-6 w-6 cursor-pointer"
						/>
					</div>
					<CreateCampaignRecipients
						campaignId={Number(campaignId)}
						onCreation={() => {
							refetch()
							setModalState(undefined)
						}}
						onCancel={() => setModalState(undefined)}
					/>
				</Modal>
			)}
			<div className="px-4 sm:px-6 lg:px-8">
				<div className="sm:flex sm:items-center">
					<div className="sm:flex-auto">
						<h1 className="text-base font-semibold leading-6 text-gray-900">Campaign Recipients</h1>
						<p className="mt-2 text-sm text-gray-700">A list of all the campaign recipients.</p>
					</div>
					<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
						<button
							type="button"
							onClick={() => setModalState({ visibility: true })}
							className="block rounded-md bg-darkBlue px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
							Add campaign recipients
						</button>
					</div>
				</div>
				<ResponsiveContainer
					className="mx-auto"
					width={isMobile ? '90%' : '100%'}
					height={isMobile ? 300 : 400}>
					<PieChart width={isMobile ? 800 : 300} height={isMobile ? 500 : 300}>
						<Legend />
						<Tooltip />
						<Pie
							data={statsData}
							cx="50%"
							cy="50%"
							labelLine={false}
							label={renderCustomizedLabel}
							outerRadius={isMobile ? 100 : 150}
							fill="#8884d8"
							dataKey="value">
							{statsData.map((_entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
					</PieChart>
				</ResponsiveContainer>
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
							<Table
								hasActionColumn
								data={filteredCampaignMembers}
								columns={columns}
								className="table-auto"
							/>
						</div>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
