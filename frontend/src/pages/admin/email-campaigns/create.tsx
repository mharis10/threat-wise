import { yupResolver } from '@hookform/resolvers/yup'
import { Spinner } from 'components/animation/spinner'
import { Button } from 'components/app/button'
import { AppLayout } from 'components/app/layout'
import { MultiCombobox } from 'components/inputs/combo-box'
import { Input } from 'components/inputs/input'
import { QUERY_KEYS } from 'constants'
import { enqueueSnackbar } from 'notistack'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import emailCampaignService from 'services/email-campaign-service'
import groupService from 'services/group-service'
import userService from 'services/user-service'

import { cn } from 'utils/cn'
import * as yup from 'yup'
import { CreateCampaignRecipients as CreateRecipientForm } from './members'

export const CreateOrEditCampaign = () => {
	const { id: campaignId } = useParams()
	const navigate = useNavigate()

	const schema = yup.object<{ name: string }>().shape({
		name: yup.string().required('Name is missing')
	})

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<{ name: string }>({
		resolver: yupResolver(schema as any),
		mode: 'all'
	})

	useQuery(QUERY_KEYS.ALL_CAMPAIGNS, emailCampaignService.getMyCampaigns, {
		enabled: !!campaignId,
		refetchOnWindowFocus: false,
		onSuccess(data) {
			if (campaignId) {
				const selectedCampaign = data.find(d => d.id === Number(campaignId))
				reset({ name: selectedCampaign?.name })
			}
		},
		onError() {
			enqueueSnackbar('Error fetching campaigns', { variant: 'error' })
		}
	})

	const { mutate: createCampaign, isLoading: campaignLoading } = useMutation({
		mutationKey: QUERY_KEYS.CREATE_CAMPAIGN,
		mutationFn: (data: { name: string }) => emailCampaignService.createCampaign(data),
		onSuccess: () => {
			enqueueSnackbar('Campaign created successfully')
			navigate('/admin/email-campaigns/list')
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const { mutate: updateCampaign, isLoading: campaignUpading } = useMutation({
		mutationKey: QUERY_KEYS.UPDATE_CAMPAIGN,
		mutationFn: ({ id, data }: { id: number; data: { name: string } }) =>
			emailCampaignService.updateCampaign(id, data),
		onSuccess: () => {
			enqueueSnackbar('Campaign updated successfully')
			navigate('/admin/email-campaigns/list')
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const onSubmit = (data: { name: string }) => {
		if (campaignId) {
			updateCampaign({ id: Number(campaignId), data })
		} else {
			createCampaign(data)
		}
	}

	return (
		<AppLayout isHeaderVisible={false} isSidebarVisible>
			<form onSubmit={handleSubmit(onSubmit)} className="py-6 md:px-8 max-md:px-5">
				<div className="flex flex-col gap-y-5">
					<h1 className="text-primary font-domine font-bold md:text-lg">Campaign Name</h1>
					<Input register={register} errors={errors} labelText="Campaign Name" name="name" />
					<div className="flex gap-x-6 justify-end">
						<button
							type="button"
							onClick={() => navigate('/admin/email-campaigns/list')}
							className="text-primary font-bold text-sm">
							Cancel
						</button>

						<Button disabled={campaignLoading || campaignUpading} className="text-sm font-bold">
							{campaignLoading || campaignUpading ? (
								<div className="flex items-center justify-center gap-x-5">
									<Spinner />
									<span className="animate-pulse whitespace-nowrap">Please Wait...</span>
								</div>
							) : (
								<span>{campaignId ? 'Update' : 'Save'}</span>
							)}
						</Button>
					</div>
				</div>
			</form>
		</AppLayout>
	)
}

interface CreateCampaignRecipientsProps {
	campaignId: number
	onCreation: () => void
	onCancel: () => void
}

export const CreateCampaignRecipients = ({
	campaignId,
	onCreation,
	onCancel
}: CreateCampaignRecipientsProps) => {
	const [employees, setEmployees] = useState<User[]>([])
	const [groups, setGroups] = useState<Group[]>([])
	const [selectedEmployees, setSelectedEmployees] = useState<{ id: number; label: string }[]>([])
	const [selectedGroups, setSelectedGroups] = useState<{ id: number; label: string }[]>([])

	useQuery(QUERY_KEYS.ALL_EMPLOYEES, userService.getAllEmployees, {
		refetchOnWindowFocus: false,
		onSuccess(data) {
			setEmployees(data)
		},
		onError() {
			setEmployees([])
			enqueueSnackbar('Error fetching employees', { variant: 'error' })
		}
	})

	useQuery(QUERY_KEYS.ALL_GROUPS, groupService.getMyGroups, {
		refetchOnWindowFocus: false,
		onSuccess(data) {
			setGroups(data)
		},
		onError() {
			setGroups([])
			enqueueSnackbar('Error fetching groups', { variant: 'error' })
		}
	})

	const { mutate: createCampaignRecipient, isLoading: campaignLoading } = useMutation({
		mutationKey: QUERY_KEYS.ADD_GROUP_MEMBERS,
		mutationFn: (data: CreateRecipientForm) => emailCampaignService.addCampaignRecipients(data),
		onSuccess: () => {
			enqueueSnackbar(
				selectedEmployees.length + selectedGroups.length > 1
					? 'Campaign Recipients added successfully'
					: 'Campaign Recipeint added successfully'
			)
			onCreation()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const onSubmit = (event: React.FormEvent) => {
		event.preventDefault()

		const payload: CreateRecipientForm = {
			campaignId,
			groupIds: selectedGroups.map(group => group.id),
			userIds: selectedEmployees.map(employee => employee.id)
		}
		createCampaignRecipient(payload)
	}

	return (
		<form onSubmit={onSubmit} className="py-6 md:px-8 max-md:px-5">
			<div className="flex flex-col gap-y-5">
				<div className="sm:flex sm:items-center">
					<div className="sm:flex-auto">
						<h1 className="text-primary font-domine font-bold md:text-lg">
							Select Campaign Recipients
						</h1>
					</div>
				</div>
				<MultiCombobox
					options={employees.map(employee => ({
						id: employee.id,
						label: employee.firstName + ' ' + employee.lastName
					}))}
					placeholder="Select Employees"
					selectedItems={selectedEmployees}
					onChange={value => setSelectedEmployees(value)}
				/>

				<MultiCombobox
					options={groups.map(group => ({
						id: group.id,
						label: group.name
					}))}
					placeholder="Select Groups"
					selectedItems={selectedGroups}
					onChange={value => setSelectedGroups(value)}
				/>

				<div className="flex gap-x-6 justify-end">
					<button type="button" onClick={onCancel} className="text-primary font-bold text-sm">
						Cancel
					</button>

					<Button
						disabled={campaignLoading || selectedGroups.length + selectedEmployees.length === 0}
						className={cn('text-sm font-bold', {
							'bg-gray-400 !text-white': selectedGroups.length + selectedEmployees.length === 0
						})}>
						{campaignLoading ? (
							<div className="flex items-center justify-center gap-x-5">
								<Spinner />
								<span className="animate-pulse whitespace-nowrap">Please Wait...</span>
							</div>
						) : (
							<span>Add</span>
						)}
					</Button>
				</div>
			</div>
		</form>
	)
}
