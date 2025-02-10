import { Controller, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { Spinner } from 'components/animation/spinner'
import { Button } from 'components/app/button'
import { Input } from 'components/inputs/input'
import { Select } from 'components/inputs/select'
import { ToggleButton } from 'components/inputs/toggle'
import { QUERY_KEYS } from 'constants'
import { useAppSelector } from 'hooks'
import { enqueueSnackbar } from 'notistack'
import companyService from 'services/company-service'
import { cn } from 'utils/cn'

interface CreateOrEditCompanyProps {
	company: Company | undefined
	companyId: number | undefined
	refetch: () => void
	onCancel: () => void
}

export type CompanyForm = {
	name: string
	industry: string
	email: string
	address: string
	contractStartDate: string
	contractLength: string
	currentMailBoxes: number
	maxMailBoxes: number
	chatgptIntegration: boolean
	smsPhishingSimulation: boolean
	trainingVideos: boolean
	widget: boolean
	rewards: boolean
	price: number
}

export const CreateOrEditCompany = ({
	company,
	companyId,
	refetch,
	onCancel
}: CreateOrEditCompanyProps) => {
	const auth = useAppSelector(state => state.auth)

	const { mutate: mutateCompany, isLoading: companyLoading } = useMutation({
		mutationKey: QUERY_KEYS.CREATE_COMPANY,
		mutationFn: (data: CompanyForm) => companyService.createCompany(data),
		onSuccess: () => {
			enqueueSnackbar('Company created successfully')
			refetch()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const { mutate: updateCompany, isLoading: companyUpdating } = useMutation({
		mutationKey: QUERY_KEYS.UPDATE_COMPANY,
		mutationFn: ({ id, data }: { id: number; data: CompanyForm }) =>
			companyService.updateCompany(id, data, auth.user?.role as User['role']),
		onSuccess: () => {
			enqueueSnackbar('Company updated successfully')
			refetch()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const schema = yup.object<CompanyForm>().shape({
		name: yup.string().required('Name is missing'),
		industry: yup.string().required('Industry is missing'),
		currentMailBoxes: yup
			.number()
			.transform((value, originalValue) => {
				return originalValue === '' ? undefined : value
			})
			.typeError('Current mailbox must be a number')
			.required('Current mailbox is missing'),
		maxMailBoxes: yup
			.number()
			.transform((value, originalValue) => {
				return originalValue === '' ? undefined : value
			})
			.typeError('Maximum mailbox must be a number')
			.required('Maximum mailbox is missing'),
		contractStartDate: yup.string().required('Contract start date is missing'),
		contractLength: yup.string().required('Contract length is missing'),
		email: yup.string().required('Email is missing').email('Enter a valid email'),
		address: yup.string().required('Company address is missing'),
		trainingVideos: yup.bool().notRequired().default(false),
		smsPhishingSimulation: yup.bool().notRequired().default(false),
		widget: yup.bool().notRequired().default(false),
		chatgptIntegration: yup.bool().notRequired().default(false),
		rewards: yup.bool().notRequired().default(false),
		price: yup.number().when('$role', {
			is: 'Super Admin',
			then: schema =>
				schema
					.transform((value, originalValue) => {
						return originalValue === '' ? undefined : value
					})
					.typeError('Price must be a number')
					.required('Price is missing')
		})
	})

	const {
		register,
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<CompanyForm>({
		resolver: yupResolver(schema as any),
		context: { role: auth.user?.role },
		defaultValues: company,
		mode: 'all'
	})

	const onSubmit = (data: CompanyForm) => {
		if (companyId) {
			return updateCompany({ id: companyId, data })
		}
		mutateCompany(data)
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className={cn(
				auth.user?.role === 'Company Admin' ? 'py-0 px-0' : 'py-6 md:px-8 max-md:px-5'
			)}>
			<div className="flex flex-col gap-y-5">
				<h1 className="text-primary font-domine font-bold md:text-lg">Company Details</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-5">
					<Input register={register} errors={errors} labelText="Company Name" name="name" />
					<Input register={register} errors={errors} labelText="Industry" name="industry" />
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-5">
					<Input
						register={register}
						errors={errors}
						disabled={auth.user?.role === 'Company Admin' && !!companyId}
						labelText="Current Mailboxes"
						name="currentMailBoxes"
					/>
					<Input
						register={register}
						errors={errors}
						disabled={auth.user?.role === 'Company Admin' && !!companyId}
						labelText="Maximum Mailboxes"
						name="maxMailBoxes"
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-5">
					<Input
						labelText="Contract Start Date"
						type="date"
						name="contractStartDate"
						register={register}
						errors={errors}
					/>
					<Select
						register={register}
						errors={errors}
						disabled={auth.user?.role === 'Company Admin' && !!companyId}
						labelText="Contract Length"
						name="contractLength">
						<option value="1 year">1 year</option>
						<option value="2 year">2 year</option>
						<option value="3 year">3 year</option>
						<option value="0 year">Free</option>
					</Select>
					<Input labelText="Email" type="email" name="email" register={register} errors={errors} />
				</div>
				<div
					className={cn(
						'grid grid-cols-1 gap-y-5 gap-x-5',
						auth.user?.role === 'Super Admin' ? 'md:grid-cols-2' : 'md:grid-cols-1'
					)}>
					<Input labelText="Address" name="address" register={register} errors={errors} />
					{auth.user?.role === 'Super Admin' && (
						<Input labelText="Price" name="price" register={register} errors={errors} />
					)}
				</div>
			</div>

			<div className="flex flex-col gap-y-6 mt-5">
				<h1 className="text-primary font-domine font-bold md:text-lg">Company Settings</h1>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-5">
					<Controller
						control={control}
						name="chatgptIntegration"
						render={({ field: { onChange, value } }) => (
							<ToggleButton label="Chat GPT Integration" onChange={onChange} value={value} />
						)}
					/>

					<Controller
						control={control}
						name="trainingVideos"
						render={({ field: { onChange, value } }) => (
							<ToggleButton label="Training Videos" onChange={onChange} value={value} />
						)}
					/>

					<Controller
						control={control}
						name="smsPhishingSimulation"
						render={({ field: { onChange, value } }) => (
							<ToggleButton label="SMS Phishing Simulation" onChange={onChange} value={value} />
						)}
					/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-5">
					<Controller
						control={control}
						name="widget"
						render={({ field: { onChange, value } }) => (
							<ToggleButton label="Widget" onChange={onChange} value={value} />
						)}
					/>

					<Controller
						control={control}
						name="rewards"
						render={({ field: { onChange, value } }) => (
							<ToggleButton label="Rewards" onChange={onChange} value={value} />
						)}
					/>
				</div>

				<div
					className={cn(
						'flex gap-x-6',
						auth.user?.role === 'Company Admin' ? 'justify-end' : 'justify-end'
					)}>
					{auth.user?.role === 'Super Admin' && (
						<button type="button" onClick={onCancel} className="text-primary font-bold text-sm">
							Cancel
						</button>
					)}
					<Button disabled={companyLoading || companyUpdating} className="text-sm font-bold">
						{companyLoading || companyUpdating ? (
							<div className="flex items-center justify-center gap-x-5">
								<Spinner />
								<span className="animate-pulse whitespace-nowrap">Please Wait...</span>
							</div>
						) : (
							<span>{companyId ? 'Update' : 'Save'}</span>
						)}
					</Button>
				</div>
			</div>
		</form>
	)
}
