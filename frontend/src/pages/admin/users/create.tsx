import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { Spinner } from 'components/animation/spinner'
import { Button } from 'components/app/button'
import { ComboBox } from 'components/inputs/combo-box'
import { Input } from 'components/inputs/input'
import { Select } from 'components/inputs/select'
import { DEPARTMENTS, JOB_TITLES, LANGUAGES, LOCATIONS, QUERY_KEYS } from 'constants'
import { useAppSelector } from 'hooks'
import { enqueueSnackbar } from 'notistack'
import userService from 'services/user-service'

interface CreateOrEditUserProps {
	user: User | undefined
	companies: Company[]
	userId: number | undefined
	refetch: () => void
	onCancel: () => void
}

export type AdminForm = {
	firstName: string
	lastName: string
	email: string
	phoneNumber: string
	companyId: number
	startDate: string
	endDate: string
	mobileNumber: string
	jobTitle: string
	linkedin: string
	location: string
	department: string
	language: string
	lineManagerId: string | null
}

export type EmployeeForm = Omit<AdminForm, 'companyId'>

export const CreateOrEditUser = ({
	user,
	companies,
	userId,
	refetch,
	onCancel
}: CreateOrEditUserProps) => {
	const auth = useAppSelector(state => state.auth)

	const [users, setUsers] = useState<User[]>([])

	const { mutate: mutateAdmin, isLoading: adminLoading } = useMutation({
		mutationKey: QUERY_KEYS.REGISTER_ADMIN,
		mutationFn: (data: AdminForm) => userService.registerAdmin(data),
		onSuccess: () => {
			enqueueSnackbar('Admin registered successfully')
			refetch()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const { mutate: mutateEmployee, isLoading: employeeLoading } = useMutation({
		mutationKey: QUERY_KEYS.REGISTER_EMPLOYEE,
		mutationFn: (data: EmployeeForm) => userService.registerEmployee(data),
		onSuccess: () => {
			enqueueSnackbar('Employee registered successfully')
			refetch()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const { mutate: updateUser, isLoading: userUpdating } = useMutation({
		mutationKey: QUERY_KEYS.UPDATE_USER,
		mutationFn: ({ userId, data }: { userId: number; data: EmployeeForm }) =>
			userService.updateUser(userId, data),
		onSuccess: () => {
			enqueueSnackbar('Employee updated successfully')
			refetch()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const schema = yup.object<AdminForm | EmployeeForm>().shape({
		firstName: yup.string().required('First Name is missing'),
		lastName: yup.string().required('Last Name is missing'),
		jobTitle: yup.string().required('Job Title is missing'),
		linkedin: yup.string().notRequired(),
		location: yup.string().required('Location is missing'),
		department: yup.string().required('Department is missing'),
		language: yup.string().required('Language is missing'),
		lineManagerId: yup.string().notRequired(),
		email: yup.string().required('Email is missing').email('Enter a valid email'),
		phoneNumber: yup
			.string()
			.nullable()
			.transform(value => (value === '' ? null : value))
			.test('length', 'Phone number must be of 11 digits', value => !value || value.length === 11),
		mobileNumber: yup
			.string()
			.nullable()
			.transform(value => (value === '' ? null : value))
			.test('length', 'Mobile number must be of 11 digits', value => !value || value.length === 11),
		startDate: yup.date().typeError('Start date is missing').required('Start date is missing'),
		endDate: yup
			.date()
			.typeError('End date must be a valid date')
			.nullable()
			.transform((curr, orig) => (orig === '' ? null : curr))
			.notRequired()
			.min(yup.ref('startDate'), 'End date must be after start date'),
		companyId: yup.string().when('$role', {
			is: 'Super Admin',
			then: schema => schema.required('Select a Company')
		})
	})

	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { errors }
	} = useForm<AdminForm | EmployeeForm>({
		resolver: yupResolver(schema as any),
		defaultValues: user as any,
		context: { role: auth.user?.role },
		mode: 'all'
	})

	useQuery(QUERY_KEYS.ALL_USERS, userService.getAllUsers, {
		refetchOnWindowFocus: false,
		enabled: auth.user?.role === 'Super Admin',
		onSuccess(data) {
			setUsers(data)
		},
		onError() {
			setUsers([])
			enqueueSnackbar('Error fetching users', { variant: 'error' })
		}
	})

	useQuery(QUERY_KEYS.ALL_EMPLOYEES, userService.getAllEmployees, {
		refetchOnWindowFocus: false,
		enabled: auth.user?.role === 'Company Admin',
		onSuccess(data) {
			setUsers(data)
		},
		onError() {
			setUsers([])
			enqueueSnackbar('Error fetching users', { variant: 'error' })
		}
	})

	const startDate = watch('startDate')

	const onSubmit = (data: AdminForm | EmployeeForm) => {
		if (auth.user?.role === 'Super Admin') {
			mutateAdmin(
				(data.lineManagerId === '' ? { ...data, lineManagerId: null } : data) as AdminForm
			)
		} else {
			if (userId) {
				return updateUser({
					userId,
					data: data.lineManagerId === '' ? { ...data, lineManagerId: null } : data
				})
			}
			mutateEmployee(
				(data.lineManagerId === '' ? { ...data, lineManagerId: null } : data) as EmployeeForm
			)
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="md:px-8 py-6 max-md:px-5">
			<div className="flex flex-col gap-y-5">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-5">
					<Input register={register} errors={errors} labelText="First Name" name="firstName" />
					<Input register={register} errors={errors} labelText="Last Name" name="lastName" />
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-5">
					<Input labelText="Email" type="email" name="email" register={register} errors={errors} />
					<Input
						labelText="Phone"
						isRequired="false"
						type="phone"
						name="phoneNumber"
						register={register}
						errors={errors}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-5">
					<Input
						labelText="Mobile Phone"
						isRequired="false"
						type="phone"
						name="mobileNumber"
						register={register}
						errors={errors}
					/>
					<Controller
						control={control}
						name="jobTitle"
						render={({ field: { onChange, value } }) => (
							<div className="flex flex-col gap-y-1">
								<ComboBox
									labelText="Job Title"
									onChange={onChange}
									value={value}
									hasError={!!errors.jobTitle}
									options={JOB_TITLES}
								/>
								{errors.jobTitle && (
									<p className="text-xs text-red-500">{errors.jobTitle.message}</p>
								)}
							</div>
						)}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-5">
					<Controller
						control={control}
						name="department"
						render={({ field: { onChange, value } }) => (
							<div className="flex flex-col gap-y-1">
								<ComboBox
									labelText="Department"
									onChange={onChange}
									value={value}
									hasError={!!errors.department}
									options={DEPARTMENTS}
								/>
								{errors.department && (
									<p className="text-xs text-red-500">{errors.department.message}</p>
								)}
							</div>
						)}
					/>
					<Controller
						control={control}
						name="location"
						render={({ field: { onChange, value } }) => (
							<div className="flex flex-col gap-y-1">
								<ComboBox
									labelText="Location"
									onChange={onChange}
									hasError={!!errors.location}
									value={value}
									options={LOCATIONS}
								/>
								{errors.location && (
									<p className="text-xs text-red-500">{errors.location.message}</p>
								)}
							</div>
						)}
					/>
				</div>

				<div className="grid grid-cols-1 gap-y-5 gap-x-5 md:grid-cols-3">
					<Input
						labelText="Linkedin"
						isRequired="false"
						type="text"
						name="linkedin"
						register={register}
						errors={errors}
					/>
					<Controller
						control={control}
						name="language"
						render={({ field: { onChange, value } }) => (
							<div className="flex flex-col gap-y-1">
								<ComboBox
									labelText="Language"
									hasError={!!errors.language}
									onChange={onChange}
									value={value}
									options={LANGUAGES}
								/>
								{errors.language && (
									<p className="text-xs text-red-500">{errors.language.message}</p>
								)}
							</div>
						)}
					/>

					{auth.user?.role === 'Company Admin' && (
						<Select
							register={register}
							errors={errors}
							labelText="Line Manager"
							isRequired="false"
							name="lineManagerId">
							<option value="">Select Line Manager</option>
							{users.map(user => (
								<option key={user.id} value={user.id}>
									{user.firstName + ' ' + user.lastName}
								</option>
							))}
						</Select>
					)}

					{auth.user?.role === 'Super Admin' && (
						<Select register={register} errors={errors} labelText="Company" name="companyId">
							<option value="">Select Company</option>
							{companies.map(company => (
								<option key={company.id} value={company.id}>
									{company.name}
								</option>
							))}
						</Select>
					)}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-5">
					<Input
						labelText="Start Date"
						type="date"
						name="startDate"
						register={register}
						errors={errors}
					/>
					<Input
						labelText="End Date"
						type="date"
						name="endDate"
						min={startDate ?? ''}
						register={register}
						errors={errors}
						defaultValue=""
					/>
				</div>

				<div className="flex gap-x-6 justify-end">
					<button type="button" onClick={onCancel} className="text-primary font-bold text-sm">
						Cancel
					</button>
					<Button disabled={adminLoading || employeeLoading} className="text-sm font-bold">
						{adminLoading || employeeLoading || userUpdating ? (
							<div className="flex items-center justify-center gap-x-5">
								<Spinner />
								<span className="animate-pulse whitespace-nowrap">Please Wait...</span>
							</div>
						) : (
							<span>{userId ? 'Update' : 'Save'}</span>
						)}
					</Button>
				</div>
			</div>
		</form>
	)
}
