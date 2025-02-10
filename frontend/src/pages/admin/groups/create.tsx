import { yupResolver } from '@hookform/resolvers/yup'
import { Spinner } from 'components/animation/spinner'
import { Button } from 'components/app/button'
import { Checkbox } from 'components/inputs/checkbox'
import { ComboBox } from 'components/inputs/combo-box'
import { Input } from 'components/inputs/input'
import { DEPARTMENTS, JOB_TITLES, LOCATIONS, QUERY_KEYS } from 'constants'
import { DateTime } from 'luxon'
import { enqueueSnackbar } from 'notistack'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import groupMemberService from 'services/group-member-service'
import groupService from 'services/group-service'
import userService from 'services/user-service'

import * as yup from 'yup'

interface CreateOrEditGroupProps {
	group?: Group
	onCreation: () => void
	onCancel: () => void
}

export const CreateOrEditGroup = ({ group, onCreation, onCancel }: CreateOrEditGroupProps) => {
	const schema = yup.object<{ name: string }>().shape({
		name: yup.string().required('Name is missing')
	})

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<{ name: string }>({
		resolver: yupResolver(schema as any),
		defaultValues: group,
		mode: 'all'
	})

	const { mutate: createGroup, isLoading: groupLoading } = useMutation({
		mutationKey: QUERY_KEYS.CREATE_GROUP,
		mutationFn: (data: { name: string }) => groupService.createGroup(data),
		onSuccess: () => {
			enqueueSnackbar('Group created successfully')
			onCreation()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const { mutate: updateGroup, isLoading: groupUpdating } = useMutation({
		mutationKey: QUERY_KEYS.UPDATE_GROUP,
		mutationFn: ({ id, data }: { id: number; data: { name: string } }) =>
			groupService.updateGroup(id, data),
		onSuccess: () => {
			enqueueSnackbar('Group updated successfully')
			onCreation()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const onSubmit = (data: { name: string }) => {
		if (group) {
			updateGroup({ id: group.id, data })
		} else {
			createGroup(data)
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="py-6 md:px-8 max-md:px-5">
			<div className="flex flex-col gap-y-5">
				<h1 className="text-primary font-domine font-bold md:text-lg">Group Details</h1>
				<Input register={register} errors={errors} labelText="Group Name" name="name" />
				<div className="flex gap-x-6 justify-end">
					<button type="button" onClick={onCancel} className="text-primary font-bold text-sm">
						Cancel
					</button>

					<Button disabled={groupLoading || groupUpdating} className="text-sm font-bold">
						{groupLoading || groupUpdating ? (
							<div className="flex items-center justify-center gap-x-5">
								<Spinner />
								<span className="animate-pulse whitespace-nowrap">Please Wait...</span>
							</div>
						) : (
							<span>{group ? 'Update' : 'Save'}</span>
						)}
					</Button>
				</div>
			</div>
		</form>
	)
}

interface CreateGroupMembersProps {
	groupId: number
	onCreation: () => void
	onCancel: () => void
}

export const CreateGroupMembers = ({ groupId, onCreation, onCancel }: CreateGroupMembersProps) => {
	const [employees, setEmployees] = useState<User[]>([])
	const [selectedEmployees, setSelectedEmployees] = useState<number[]>([])
	const [department, setDepartment] = useState<string>()
	const [jobRole, setJobRole] = useState<string>()
	const [location, setLocation] = useState<string>()
	const [date, setDate] = useState({} as { from: string; to: string })

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

	const { mutate: createGroupMember, isLoading: groupLoading } = useMutation({
		mutationKey: QUERY_KEYS.ADD_GROUP_MEMBERS,
		mutationFn: (data: { groupId: number; userIds: number[] }) =>
			groupMemberService.addGroupMembers(data),
		onSuccess: () => {
			enqueueSnackbar(
				selectedEmployees.length > 1
					? 'Group Members added successfully'
					: 'Group Member added successfully'
			)
			onCreation()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const filteredEmployees = useMemo(() => {
		return employees.filter(employee => {
			const matchDepartment = department ? employee.department === department : true
			const matchJobRole = jobRole ? employee.jobTitle === jobRole : true
			const matchLocation = location ? employee.location === location : true
			const matchDate =
				date.from && date.to
					? DateTime.fromISO(employee.createdTimestamp) >= DateTime.fromISO(date.from) &&
						DateTime.fromISO(employee.createdTimestamp) <= DateTime.fromISO(date.to)
					: true
			return matchDepartment && matchJobRole && matchLocation && matchDate
		})
	}, [employees, department, jobRole, location, date])

	const onSubmit = (event: React.FormEvent) => {
		event.preventDefault()

		const payload = {
			groupId,
			userIds: selectedEmployees
		}
		createGroupMember(payload)
	}

	return (
		<form onSubmit={onSubmit} className="py-6 md:px-8 max-md:px-5">
			<div className="flex flex-col gap-y-5">
				<div className="sm:flex sm:items-center">
					<div className="sm:flex-auto">
						<h1 className="text-primary font-domine font-bold md:text-lg">Select Group Members</h1>
					</div>
					<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
						<button
							type="button"
							onClick={() => {
								setDepartment(undefined)
								setJobRole(undefined)
								setLocation(undefined)
								setDate({ from: '', to: '' })
							}}
							className="block rounded-md bg-darkBlue px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
							Clear Filters
						</button>
					</div>
				</div>
				<div className="max-md:hidden flex gap-x-3 items-center">
					<ComboBox
						labelText="Department"
						onChange={(option: string | null) => setDepartment(option ?? undefined)}
						value={department}
						options={DEPARTMENTS}
					/>
					<ComboBox
						labelText="Job Role"
						onChange={(option: string | null) => setJobRole(option ?? undefined)}
						value={jobRole}
						options={JOB_TITLES}
					/>
					<ComboBox
						labelText="Location"
						onChange={(option: string | null) => setLocation(option ?? undefined)}
						value={location}
						options={LOCATIONS}
					/>
					<Input
						name="from"
						value={date.from}
						labelText="From"
						onChange={event => setDate(prev => ({ ...prev, from: event.target.value }))}
						type="date"
					/>
					<Input
						name="to"
						value={date.to}
						labelText="To"
						onChange={event => setDate(prev => ({ ...prev, to: event.target.value }))}
						type="date"
					/>
				</div>
				<div className="flex md:hidden flex-col gap-y-4">
					<div className="grid grid-cols-2 gap-x-3 items-center">
						<ComboBox
							labelText="Department"
							onChange={(option: string | null) => setDepartment(option ?? undefined)}
							value={department}
							options={DEPARTMENTS}
						/>
						<ComboBox
							labelText="Job Role"
							onChange={(option: string | null) => setJobRole(option ?? undefined)}
							value={jobRole}
							options={JOB_TITLES}
						/>
					</div>
					<ComboBox
						labelText="Location"
						onChange={(option: string | null) => setLocation(option ?? undefined)}
						value={location}
						options={LOCATIONS}
					/>
					<div className="grid grid-cols-2 gap-x-3 items-center">
						<Input
							name="from"
							value={date.from}
							labelText="From"
							onChange={event => setDate(prev => ({ ...prev, from: event.target.value }))}
							type="date"
						/>
						<Input
							name="to"
							value={date.to}
							labelText="To"
							onChange={event => setDate(prev => ({ ...prev, to: event.target.value }))}
							type="date"
						/>
					</div>
				</div>
				<div className="max-h-48 overflow-auto">
					{filteredEmployees.length > 0 && (
						<Checkbox
							onChange={event => {
								if (event.target.checked) {
									return setSelectedEmployees(filteredEmployees.map(employee => employee.id))
								}
								setSelectedEmployees([])
							}}
							id="select-all"
							name="employee"
							checked={selectedEmployees.length === filteredEmployees.length}
							labelText="Select All Employees"
						/>
					)}
					{filteredEmployees.length > 0 && <div className="h-px w-full bg-gray-200 my-1" />}
					{filteredEmployees.length > 0 ? (
						filteredEmployees.map(employee => (
							<Checkbox
								key={employee.id}
								id={employee.id.toString()}
								value={employee.id.toString()}
								onChange={event => {
									if (event.target.checked) {
										return setSelectedEmployees(prev => [...prev, employee.id])
									}
									const employeesId = selectedEmployees.filter(
										employeeId => employeeId !== Number(event.target.value)
									)
									setSelectedEmployees(employeesId)
								}}
								checked={selectedEmployees.includes(employee.id)}
								name="employee"
								labelText={employee.firstName + ' ' + employee.lastName}
							/>
						))
					) : (
						<p className="text-sm text-primary">No Employees found</p>
					)}
				</div>

				<div className="flex gap-x-6 justify-end">
					<button type="button" onClick={onCancel} className="text-primary font-bold text-sm">
						Cancel
					</button>

					<Button disabled={groupLoading} className="text-sm font-bold">
						{groupLoading ? (
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
