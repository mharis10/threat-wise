import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { CellContext } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'

import { cn } from 'utils/cn'

import { Spinner } from 'components/animation/spinner'
import ConfirmationPrompt from 'components/app/confirmation-prompt'
import { AppLayout } from 'components/app/layout'
import { Modal } from 'components/app/modal'
import { Action, ActionTable, Table } from 'components/app/table'
import { QUERY_KEYS } from 'constants'
import { useAppSelector } from 'hooks'
import { enqueueSnackbar } from 'notistack'
import { CreateOrEditUser } from 'pages/admin/users/create'
import companyService from 'services/company-service'
import userService from 'services/user-service'

type State = isModalVisible | undefined

type isModalVisible = {
	visibility: boolean
	id?: number | undefined
}

type ValidationErrors = {
	[email: string]: string[]
}

export const Users = () => {
	const auth = useAppSelector(state => state.auth)

	const [users, setUsers] = useState<User[]>([])
	const [file, setFile] = useState<File>()
	const [duplicateUsers, setDuplicateUsers] = useState<string[]>([])
	const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
	const [missingColumns, setMissingColumns] = useState<string[]>([])
	const [companies, setCompanies] = useState<Company[]>([])
	const [searchText, setSearchText] = useState<string>()
	const [modalState, setModalState] = useState<State>({
		visibility: false,
		id: undefined
	})
	const [deletePrompt, setDeletePrompt] = useState<State>({
		visibility: false,
		id: undefined
	})

	const { refetch } = useQuery(QUERY_KEYS.ALL_USERS, userService.getAllUsers, {
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

	const { refetch: refetchEmployees } = useQuery(
		QUERY_KEYS.ALL_EMPLOYEES,
		userService.getAllEmployees,
		{
			refetchOnWindowFocus: false,
			enabled: auth.user?.role === 'Company Admin',
			onSuccess(data) {
				setUsers(data)
			},
			onError() {
				setUsers([])
				enqueueSnackbar('Error fetching users', { variant: 'error' })
			}
		}
	)

	useQuery(QUERY_KEYS.ALL_COMPANIES, companyService.getAllCompanies, {
		refetchOnWindowFocus: false,
		enabled: auth.user?.role === 'Super Admin',
		onSuccess(data) {
			setCompanies(data)
		},
		onError() {
			setCompanies([])
			enqueueSnackbar('Error fetching companies', { variant: 'error' })
		}
	})

	const { mutate: mutateEmployee, isLoading: employeeLoading } = useMutation({
		mutationKey: QUERY_KEYS.POPULATE_EMPLOYEE,
		mutationFn: (data: FormData) => userService.populateEmployee(data),
		onSuccess: () => {
			enqueueSnackbar('Employees registered successfully')
			setMissingColumns([])
			setDuplicateUsers([])
			setValidationErrors({})
			auth.user?.role === 'Super Admin' ? refetch() : refetchEmployees()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const { mutate: validateEmployee, isLoading: employeeValidating } = useMutation({
		mutationKey: QUERY_KEYS.VALIDATE_EMPLOYEE,
		mutationFn: (data: FormData) => userService.validateEmployeeData(data),
		onSuccess: (res, variables) => {
			if (
				res.missingColumns.length > 0 ||
				res.duplicateUsersInDb.length > 0 ||
				Object.keys(res.validationErrors).length > 0
			) {
				setMissingColumns(res.missingColumns)
				setDuplicateUsers(res.duplicateUsersInDb)
				setValidationErrors(res.validationErrors)
			} else {
				mutateEmployee(variables)
			}
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const { mutate: enableUser } = useMutation({
		mutationKey: QUERY_KEYS.ENABLE_USER,
		mutationFn: (userId: number) => userService.enableUser(userId),
		onSuccess: () => {
			enqueueSnackbar('User enabled successfully')
			auth.user?.role === 'Super Admin' ? refetch() : refetchEmployees()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const { mutate: disableUser } = useMutation({
		mutationKey: QUERY_KEYS.DISABLE_USER,
		mutationFn: (userId: number) => userService.disableUser(userId),
		onSuccess: () => {
			enqueueSnackbar('User disabled successfully')
			auth.user?.role === 'Super Admin' ? refetch() : refetchEmployees()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const { mutate: deleteEmployee } = useMutation({
		mutationKey: QUERY_KEYS.DELETE_EMPLOYEE,
		mutationFn: (employeeId: number) => userService.deleteEmployee(employeeId),
		onSuccess: () => {
			enqueueSnackbar('Employee deleted successfully')
			setDeletePrompt(undefined)
			auth.user?.role === 'Super Admin' ? refetch() : refetchEmployees()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) return
		const file = event.target.files[0]
		setFile(file)
		const formdata = new FormData()
		formdata.append('file', file)
		validateEmployee(formdata)
	}

	const handleValidatedFile = (action: Action) => {
		const formdata = new FormData()
		formdata.append('file', file as File)
		formdata.append('duplicateActions', JSON.stringify(action))
		mutateEmployee(formdata)
	}

	const { filteredUsers } = useMemo(() => {
		const { filteredUsers } = users.reduce(
			(prev, curr) => {
				if (searchText) {
					const fullName = curr.firstName + ' ' + curr.lastName
					const status = curr.isActive ? 'Active' : 'Inactive'
					if (
						curr.email.toLowerCase().includes(searchText.toLowerCase()) ||
						fullName.toLowerCase().includes(searchText.toLowerCase()) ||
						curr.phoneNumber.includes(searchText) ||
						status.toLowerCase().includes(searchText.toLowerCase())
					) {
						return { filteredUsers: [...prev.filteredUsers, curr] }
					}
				} else {
					return { filteredUsers: [...prev.filteredUsers, curr] }
				}
				return prev
			},
			{
				filteredUsers: [] as User[]
			}
		)
		return { filteredUsers }
	}, [users, searchText])

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
			header: 'Phone',
			accessorKey: 'phoneNumber'
		},
		{
			header: 'Role',
			accessorKey: 'role',
			cell: (data: CellContext<User, 'role'>) => (
				<span className="capitalize">{data.getValue()}</span>
			)
		},
		{
			header: 'Status',
			accessorKey: 'isActive',
			cell: (data: CellContext<User, 'isActive'>) => (
				<span
					onClick={() => {
						if ((data.row.original as User).role === 'Super Admin') {
							return
						}
						data.getValue()
							? disableUser((data.row.original as User).id)
							: enableUser((data.row.original as User).id)
					}}
					className={cn(
						'inline-flex items-center cursor-pointer rounded-md bg-green-50 px-2 py-1 text-xs font-medium ring-1 ring-inset ',
						data.getValue() ? 'text-green-700 ring-green-600/20' : 'text-red-700 ring-red-600/20',
						{ 'cursor-default': (data.row.original as User).role === 'Super Admin' }
					)}>
					{data.getValue() ? 'Active' : 'Inactive'}
				</span>
			)
		},
		{
			id: 'action-user',
			cell: (data: CellContext<User, 'id'>) => (
				<>
					{auth.user?.role === 'Company Admin' &&
					(data.row.original as User).role === 'Company Employee' ? (
						<div className="flex gap-x-1 items-center">
							<span
								onClick={() =>
									setModalState({ visibility: true, id: (data.row.original as User).id })
								}
								className="inline-flex cursor-pointer items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium ring-1 ring-inset text-primary ring-blue-600/20">
								Edit
							</span>
							<span
								onClick={() =>
									setDeletePrompt({ visibility: true, id: (data.row.original as User).id })
								}
								className="inline-flex cursor-pointer items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium ring-1 ring-inset text-primaryRed ring-red-600/20">
								Delete
							</span>
						</div>
					) : (
						''
					)}
				</>
			)
		}
	]

	return (
		<AppLayout isHeaderVisible={false} isSidebarVisible>
			{deletePrompt?.visibility && (
				<ConfirmationPrompt
					title="Delete Employee"
					label='Enter "delete" to confirm your action'
					onDelete={() => deleteEmployee(deletePrompt.id as number)}
					isOpen={deletePrompt.visibility}
					onClose={() => setDeletePrompt(undefined)}
				/>
			)}
			{(missingColumns.length > 0 ||
				duplicateUsers.length > 0 ||
				Object.keys(validationErrors).length > 0) && (
				<Modal isFullHeight width="w-[500px]" noPadding onClose={() => setModalState(undefined)}>
					<div className="sticky max-md:grid max-md:grid-flow-col max-md:auto-cols-auto md:flex items-center md:justify-between top-0 z-10 bg-white max-md:p-5 md:px-8 py-4 border-b border-border">
						<ChevronLeftIcon
							onClick={() => {
								setMissingColumns([])
								setDuplicateUsers([])
								setValidationErrors({})
							}}
							className="w-3 h-3 md:hidden cursor-pointer"
						/>
						<h1 className="text-primary text-[20px] max-md:text-center whitespace-nowrap max-md:text-sm font-domine font-bold">
							File Validation Errors
						</h1>
						<div className="md:hidden" />
						<XMarkIcon
							onClick={() => {
								setMissingColumns([])
								setDuplicateUsers([])
								setValidationErrors({})
							}}
							className="text-primary max-md:hidden bg-white h-6 w-6 cursor-pointer"
						/>
					</div>
					<ActionTable
						missingColumns={missingColumns}
						duplicateData={duplicateUsers}
						validationErrors={validationErrors}
						onConfirm={handleValidatedFile}
					/>
				</Modal>
			)}
			{modalState?.visibility && (
				<Modal isFullHeight width="w-[900px]" noPadding onClose={() => setModalState(undefined)}>
					<div className="sticky max-md:grid max-md:grid-flow-col max-md:auto-cols-auto md:flex items-center md:justify-between top-0 z-10 bg-white max-md:p-5 md:px-8 py-4 border-b border-border">
						<ChevronLeftIcon
							onClick={() => setModalState(undefined)}
							className="w-3 h-3 md:hidden cursor-pointer"
						/>
						<h1 className="text-primary text-[20px] max-md:text-center whitespace-nowrap max-md:text-sm font-domine font-bold">
							{modalState.id
								? `Edit ${auth.user?.role === 'Super Admin' ? 'User' : 'Employee'}`
								: `Add ${auth.user?.role === 'Super Admin' ? 'User' : 'Employee'}`}
						</h1>
						<div className="md:hidden" />
						<XMarkIcon
							onClick={() => setModalState(undefined)}
							className="text-primary max-md:hidden bg-white h-6 w-6 cursor-pointer"
						/>
					</div>
					<CreateOrEditUser
						refetch={() => {
							auth.user?.role === 'Super Admin' ? refetch() : refetchEmployees()
							setModalState(undefined)
						}}
						companies={companies}
						user={users.find(user => user.id === modalState.id)}
						userId={modalState.id}
						onCancel={() => setModalState(undefined)}
					/>
				</Modal>
			)}
			<div className="px-4 sm:px-6 lg:px-8">
				<div className="sm:flex sm:items-center">
					<div className="sm:flex-auto">
						<h1 className="text-base font-semibold leading-6 text-gray-900">
							{auth.user?.role === 'Super Admin' ? 'Users' : 'Employees'}
						</h1>
						<p className="mt-2 text-sm text-gray-700">
							A list of all the {auth.user?.role === 'Super Admin' ? 'users' : 'employees'} in your
							account including their name, email, phone and role.
						</p>
					</div>
					<div className="mt-4 sm:ml-16 sm:mt-0 flex gap-x-2 sm:flex-none">
						<button
							onClick={() => userService.downloadTemplate()}
							className="block rounded-md bg-primaryRed px-3 py-2 text-center max-md:text-xs text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
							Download Sample
						</button>
						{auth.user?.role === 'Company Admin' && (
							<>
								<label
									htmlFor="file-upload"
									className="flex rounded-md cursor-pointer bg-black px-3 py-2 justify-center items-center text-center max-md:text-xs text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
									{employeeLoading ? (
										<div className="flex gap-x-0.5 items-center">
											<Spinner />
											<span>Uploading...</span>
										</div>
									) : (
										<span>Upload</span>
									)}
								</label>

								<input
									id="file-upload"
									name="file-upload"
									accept=".xlsx,.csv"
									onChange={handleFileUpload}
									type="file"
									className="sr-only"
								/>
							</>
						)}
						<button
							type="button"
							onClick={() => setModalState({ visibility: true })}
							className="block rounded-md bg-darkBlue max-md:text-xs px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
							Add {auth.user?.role === 'Super Admin' ? 'user' : 'employee'}
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
								data={filteredUsers}
								hasActionColumn
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
