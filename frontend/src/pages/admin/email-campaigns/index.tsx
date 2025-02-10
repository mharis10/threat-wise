import { CellContext } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'

import { DateTime } from 'luxon'
import { enqueueSnackbar } from 'notistack'
import * as yup from 'yup'

import { yupResolver } from '@hookform/resolvers/yup'
import { Spinner } from 'components/animation/spinner'
import { Button } from 'components/app/button'
import ConfirmationPrompt from 'components/app/confirmation-prompt'
import { AppLayout } from 'components/app/layout'
import { Modal } from 'components/app/modal'
import { Table } from 'components/app/table'
import { Select } from 'components/inputs/select'
import { QUERY_KEYS } from 'constants'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import emailCampaignService from 'services/email-campaign-service'
import emailService from 'services/email-service'
import emailTemplateService from 'services/email-template-service'

type State = isModalVisible | undefined

type isModalVisible = {
	visibility: boolean
	id?: number | undefined
}

export const EmailCampaigns = () => {
	const navigate = useNavigate()
	const [campaigns, setCampaigns] = useState<Campaign[]>([])
	const [myTemplates, setMyTemplates] = useState<EmailTemplate[]>([])
	const [searchText, setSearchText] = useState<string>()
	const [showEmailPopup, setShowEmailPopup] = useState(false)
	const [deletePrompt, setDeletePrompt] = useState<State>({
		visibility: false,
		id: undefined
	})

	const { refetch } = useQuery(QUERY_KEYS.ALL_CAMPAIGNS, emailCampaignService.getMyCampaigns, {
		refetchOnWindowFocus: false,
		onSuccess(data) {
			setCampaigns(data)
		},
		onError() {
			setCampaigns([])
			enqueueSnackbar('Error fetching campaigns', { variant: 'error' })
		}
	})

	useQuery(QUERY_KEYS.MY_TEMPLATES, emailTemplateService.getMyTemplates, {
		refetchOnWindowFocus: false,
		onSuccess(data) {
			const myTemplates = data.filter(template => template.User.role !== 'Super Admin')
			setMyTemplates(myTemplates)
		},
		onError() {
			setMyTemplates([])
			enqueueSnackbar('Error fetching templates', { variant: 'error' })
		}
	})

	const { mutate: sendEmail, isLoading } = useMutation({
		mutationKey: QUERY_KEYS.SEND_EMAIL,
		mutationFn: (data: { campaignId: number; templateId: number }) => emailService.sendEmail(data),
		onSuccess: () => {
			enqueueSnackbar('Email sent successfully')
			setShowEmailPopup(false)
			refetch()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const { mutate: deleteCampaign } = useMutation({
		mutationKey: QUERY_KEYS.DELETE_CAMPAIGN,
		mutationFn: (id: number) => emailCampaignService.deleteCampaign(id),
		onSuccess: () => {
			enqueueSnackbar('Campaign deleted successfully')
			setDeletePrompt(undefined)
			refetch()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const { filteredCampaigns } = useMemo(() => {
		const { filteredCampaigns } = campaigns.reduce(
			(prev, curr) => {
				if (searchText) {
					if (
						curr.name?.toLowerCase().includes(searchText.toLowerCase()) ||
						DateTime.fromISO(curr.createdTimestamp).toFormat('hh:mm a').includes(searchText)
					) {
						return { filteredCampaigns: [...prev.filteredCampaigns, curr] }
					}
				} else {
					return { filteredCampaigns: [...prev.filteredCampaigns, curr] }
				}
				return prev
			},
			{
				filteredCampaigns: [] as Campaign[]
			}
		)
		return { filteredCampaigns }
	}, [campaigns, searchText])

	const columns = [
		{
			header: 'Campaign Id',
			accessorKey: 'id'
		},
		{
			header: 'Campaign Name',
			accessorKey: 'name'
		},
		{
			header: 'Company Id',
			accessorKey: 'companyId'
		},
		{
			header: 'Time',
			accessorKey: 'createdTimestamp',
			cell: (data: CellContext<Campaign, 'createdTimestamp'>) => (
				<span>{DateTime.fromISO(data.getValue()).toFormat('hh:mm a')}</span>
			)
		},
		{
			id: 'action-campaign',
			cell: (data: CellContext<Campaign, 'id'>) => (
				<div className="flex justify-end gap-x-1 items-center">
					<span
						onClick={event => {
							event.stopPropagation()
							navigate(`/admin/email-campaigns/create/${(data.row.original as Campaign).id}`)
						}}
						className="inline-flex cursor-pointer items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium ring-1 ring-inset text-primary ring-blue-600/20">
						Edit
					</span>
					<span
						onClick={event => {
							event.stopPropagation()
							setDeletePrompt({ visibility: true, id: (data.row.original as Group).id })
						}}
						className="inline-flex cursor-pointer items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium ring-1 ring-inset text-primaryRed ring-red-600/20">
						Delete
					</span>
				</div>
			)
		}
	]

	const schema = yup.object<{ campaignId: number; templateId: number }>().shape({
		campaignId: yup
			.number()
			.transform((value, originalValue) => {
				return originalValue === '' ? undefined : value
			})
			.required('Campaign is required'),
		templateId: yup
			.number()
			.transform((value, originalValue) => {
				return originalValue === '' ? undefined : value
			})
			.required('Template is required')
	})

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<{ campaignId: number; templateId: number }>({
		resolver: yupResolver(schema as any),
		mode: 'all'
	})

	const onSubmit = (data: { campaignId: number; templateId: number }) => {
		sendEmail(data)
	}

	return (
		<AppLayout isHeaderVisible={false} isSidebarVisible>
			{deletePrompt?.visibility && (
				<ConfirmationPrompt
					title="Delete Campaign"
					label="Enter delete to confirm your action"
					onDelete={() => deleteCampaign(deletePrompt.id as number)}
					isOpen={deletePrompt.visibility}
					onClose={() => setDeletePrompt(undefined)}
				/>
			)}
			{showEmailPopup && (
				<Modal isFullHeight width="w-[500px]" noPadding onClose={() => setShowEmailPopup(false)}>
					<form onSubmit={handleSubmit(onSubmit)} className="py-6 md:px-8 max-md:px-5">
						<div className="flex flex-col gap-y-5">
							<div className="sm:flex sm:items-center">
								<div className="sm:flex-auto">
									<h1 className="text-primary font-domine font-bold md:text-lg">
										Select Email Recipients
									</h1>
								</div>
							</div>
							<Select
								labelText="Select Campaign"
								name="campaignId"
								register={register}
								errors={errors}>
								<option value="">Select Campaign</option>
								{campaigns.map(campaign => (
									<option key={campaign.id} value={campaign.id}>
										{campaign.name}
									</option>
								))}
							</Select>
							<Select
								labelText="Select Template"
								name="templateId"
								register={register}
								errors={errors}>
								<option value="">Select Template</option>
								{myTemplates.map(template => (
									<option value={template.id} key={template.id}>
										{template.title}
									</option>
								))}
							</Select>

							<div className="flex gap-x-6 justify-end">
								<button
									type="button"
									onClick={() => setShowEmailPopup(false)}
									className="text-primary font-bold text-sm">
									Cancel
								</button>

								<Button type="submit" className="text-sm font-bold">
									{isLoading ? (
										<div className="flex items-center justify-center gap-x-5">
											<Spinner />
											<span className="animate-pulse whitespace-nowrap">Please Wait...</span>
										</div>
									) : (
										<span>Send Email</span>
									)}
								</Button>
							</div>
						</div>
					</form>
				</Modal>
			)}
			<div className="px-4 sm:px-6 lg:px-8">
				<div className="sm:flex sm:items-center">
					<div className="sm:flex-auto">
						<h1 className="text-base font-semibold leading-6 text-gray-900">Campaigns</h1>
						<p className="mt-2 text-sm text-gray-700">
							A list of all the campaigns in your account.
						</p>
					</div>
					<div className="mt-4 sm:ml-16 flex gap-x-2 sm:mt-0 sm:flex-none">
						<button
							type="button"
							onClick={() => setShowEmailPopup(true)}
							className="block rounded-md bg-primaryRed px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
							Send Email
						</button>
						<button
							type="button"
							onClick={() => navigate('/admin/email-campaigns/create')}
							className="block rounded-md bg-darkBlue px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
							Add campaign
						</button>
					</div>
				</div>
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
								data={filteredCampaigns}
								onRowClick={(id: number) => navigate(`/admin/email-campaigns/${id}/recipients`)}
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
