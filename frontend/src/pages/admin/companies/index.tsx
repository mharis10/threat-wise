import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { CellContext } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'

import { cn } from 'utils/cn'

import { AppLayout } from 'components/app/layout'
import { Modal } from 'components/app/modal'
import { Table } from 'components/app/table'
import { QUERY_KEYS } from 'constants'
import { useAppSelector } from 'hooks'
import { DateTime } from 'luxon'
import { enqueueSnackbar } from 'notistack'
import { CreateOrEditCompany } from 'pages/admin/companies/create'
import companyService from 'services/company-service'

type State = isModalVisible | undefined

type isModalVisible = {
	visibility: boolean
	id?: number | undefined
}

export const Companies = () => {
	const auth = useAppSelector(state => state.auth)

	const [companies, setCompanies] = useState<Company[]>([])
	const [searchText, setSearchText] = useState<string>()
	const [modalState, setModalState] = useState<State>({
		visibility: false,
		id: undefined
	})

	const { refetch } = useQuery(QUERY_KEYS.ALL_COMPANIES, companyService.getAllCompanies, {
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

	const { refetch: fetchMyCompany } = useQuery(QUERY_KEYS.MY_COMPANY, companyService.getMyCompany, {
		refetchOnWindowFocus: false,
		enabled: auth.user?.role === 'Company Admin',
		onSuccess(data) {
			setCompanies([data])
		},
		onError() {
			setCompanies([])
			enqueueSnackbar('Error fetching companies', { variant: 'error' })
		}
	})

	const { mutate: enableCompany } = useMutation({
		mutationKey: QUERY_KEYS.ENABLE_COMPANY,
		mutationFn: (companyId: number) =>
			companyService.enableCompany(companyId, auth.user?.role as User['role']),
		onSuccess: () => {
			enqueueSnackbar('Company enabled successfully')
			auth.user?.role === 'Super Admin' ? refetch() : fetchMyCompany()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const { mutate: disableCompany } = useMutation({
		mutationKey: QUERY_KEYS.DISABLE_COMPANY,
		mutationFn: (companyId: number) =>
			companyService.disableCompany(companyId, auth.user?.role as User['role']),
		onSuccess: () => {
			enqueueSnackbar('Company disabled successfully')
			auth.user?.role === 'Super Admin' ? refetch() : fetchMyCompany()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const { filteredCompanies } = useMemo(() => {
		const { filteredCompanies } = companies.reduce(
			(prev, curr) => {
				if (searchText) {
					const status = curr.isActive ? 'Active' : 'Inactive'
					if (
						curr.name.toLowerCase().includes(searchText.toLowerCase()) ||
						curr.industry.toLowerCase().includes(searchText.toLowerCase()) ||
						curr.email.toLowerCase().includes(searchText.toLowerCase()) ||
						status.toLowerCase().includes(searchText.toLowerCase())
					) {
						return { filteredCompanies: [...prev.filteredCompanies, curr] }
					}
				} else {
					return { filteredCompanies: [...prev.filteredCompanies, curr] }
				}
				return prev
			},
			{
				filteredCompanies: [] as Company[]
			}
		)
		return { filteredCompanies }
	}, [companies, searchText])

	const columns = [
		{
			header: 'Name',
			accessorKey: 'name'
		},
		{
			header: 'Industry',
			accessorKey: 'industry'
		},
		{
			header: 'Email',
			accessorKey: 'email'
		},
		{
			header: 'Last Updated',
			accessorKey: 'modifiedTimestamp',
			cell: (data: CellContext<Company, 'modifiedTimestamp'>) =>
				DateTime.fromISO(data.getValue()).toFormat('dd-LL-yyyy')
		},
		{
			header: 'Status',
			accessorKey: 'isActive',
			cell: (data: CellContext<Company, 'isActive'>) => (
				<span
					onClick={() =>
						data.getValue()
							? disableCompany((data.row.original as Company).id)
							: enableCompany((data.row.original as Company).id)
					}
					className={cn(
						'inline-flex cursor-pointer items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium ring-1 ring-inset ',
						data.getValue() ? 'text-green-700 ring-green-600/20' : 'text-red-700 ring-red-600/20'
					)}>
					{data.getValue() ? 'Active' : 'Inactive'}
				</span>
			)
		},
		{
			id: 'action-company',
			hasNoHeading: true,
			cell: (data: CellContext<Company, 'id'>) => (
				<span
					onClick={() => setModalState({ visibility: true, id: (data.row.original as Company).id })}
					className="inline-flex cursor-pointer items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium ring-1 ring-inset text-primary ring-blue-600/20">
					Edit
				</span>
			)
		}
	]

	return (
		<AppLayout isHeaderVisible={false} isSidebarVisible>
			{auth.user?.role === 'Company Admin' && companies.length > 0 ? (
				<div className="px-4 sm:px-6 lg:px-8">
					<CreateOrEditCompany
						companyId={companies[0]?.id}
						company={companies[0]}
						refetch={() => fetchMyCompany()}
						onCancel={() => undefined}
					/>
				</div>
			) : (
				<>
					{modalState?.visibility && (
						<Modal
							isFullHeight
							width="w-[900px]"
							noPadding
							onClose={() => setModalState(undefined)}>
							<div className="sticky max-md:grid max-md:grid-flow-col max-md:auto-cols-auto md:flex items-center md:justify-between top-0 z-10 bg-white max-md:p-5 md:px-8 py-4 border-b border-border">
								<ChevronLeftIcon
									onClick={() => setModalState(undefined)}
									className="w-3 h-3 md:hidden cursor-pointer"
								/>
								<h1 className="text-primary text-[20px] max-md:text-center whitespace-nowrap max-md:text-sm font-domine font-bold">
									{modalState.id ? 'Edit Company' : 'Add Company'}
								</h1>
								<div className="md:hidden" />
								<XMarkIcon
									onClick={() => setModalState(undefined)}
									className="text-primary max-md:hidden bg-white h-6 w-6 cursor-pointer"
								/>
							</div>
							<CreateOrEditCompany
								companyId={modalState.id}
								company={companies.find(company => company.id === modalState.id)}
								refetch={() => {
									auth.user?.role === 'Super Admin' ? refetch() : fetchMyCompany()
									setModalState(undefined)
								}}
								onCancel={() => setModalState(undefined)}
							/>
						</Modal>
					)}
					<div className="px-4 sm:px-6 lg:px-8">
						<div className="sm:flex sm:items-center">
							<div className="sm:flex-auto">
								<h1 className="text-base font-semibold leading-6 text-gray-900">
									{auth.user?.role === 'Super Admin' ? 'Companies' : 'Company'}
								</h1>
								<p className="mt-2 text-sm text-gray-700">
									{auth.user?.role === 'Super Admin'
										? 'A list of all the companies in your account.'
										: 'Your company'}
								</p>
							</div>
							{auth.user?.role === 'Super Admin' && (
								<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
									<button
										type="button"
										onClick={() => setModalState({ visibility: true })}
										className="block rounded-md bg-darkBlue px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
										Add company
									</button>
								</div>
							)}
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
										data={filteredCompanies}
										columns={columns}
										className="table-auto"
									/>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</AppLayout>
	)
}
