import { CellContext } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'

import { DateTime } from 'luxon'
import { enqueueSnackbar } from 'notistack'

import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Spinner } from 'components/animation/spinner'
import ConfirmationPrompt from 'components/app/confirmation-prompt'
import { AppLayout } from 'components/app/layout'
import { Modal } from 'components/app/modal'
import { Table } from 'components/app/table'
import { QUERY_KEYS } from 'constants'
import { useNavigate } from 'react-router-dom'
import groupService from 'services/group-service'
import userService from 'services/user-service'
import { CreateOrEditGroup } from './create'

type State = isModalVisible | undefined

type isModalVisible = {
	visibility: boolean
	id?: number | undefined
}

export const Groups = () => {
	const navigate = useNavigate()
	const [groups, setGroups] = useState<Group[]>([])
	const [searchText, setSearchText] = useState<string>()
	const [modalState, setModalState] = useState<State>({
		visibility: false,
		id: undefined
	})
	const [deletePrompt, setDeletePrompt] = useState<State>({
		visibility: false,
		id: undefined
	})

	const { refetch } = useQuery(QUERY_KEYS.ALL_GROUPS, groupService.getMyGroups, {
		refetchOnWindowFocus: false,
		onSuccess(data) {
			setGroups(data)
		},
		onError() {
			setGroups([])
			enqueueSnackbar('Error fetching groups', { variant: 'error' })
		}
	})

	const { mutate: mutateGroup, isLoading: groupLoading } = useMutation({
		mutationKey: QUERY_KEYS.POPULATE_EMPLOYEE,
		mutationFn: (data: FormData) => userService.populateEmployee(data),
		onSuccess: () => {
			enqueueSnackbar('Group members added successfully')
			refetch()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const { mutate: deleteGroup } = useMutation({
		mutationKey: QUERY_KEYS.DELETE_GROUP,
		mutationFn: (id: number) => groupService.deleteGroup(id),
		onSuccess: () => {
			enqueueSnackbar('Group deleted successfully')
			setDeletePrompt(undefined)
			refetch()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const { filteredGroups } = useMemo(() => {
		const { filteredGroups } = groups.reduce(
			(prev, curr) => {
				if (searchText) {
					if (
						curr.name?.toLowerCase().includes(searchText.toLowerCase()) ||
						DateTime.fromISO(curr.createdTimestamp).toFormat('hh:mm a').includes(searchText)
					) {
						return { filteredGroups: [...prev.filteredGroups, curr] }
					}
				} else {
					return { filteredGroups: [...prev.filteredGroups, curr] }
				}
				return prev
			},
			{
				filteredGroups: [] as Group[]
			}
		)
		return { filteredGroups }
	}, [groups, searchText])

	const columns = [
		{
			header: 'Group Id',
			accessorKey: 'id'
		},
		{
			header: 'Group Name',
			accessorKey: 'name'
		},
		{
			header: 'Company Id',
			accessorKey: 'companyId'
		},
		{
			header: 'Time',
			accessorKey: 'createdTimestamp',
			cell: (data: CellContext<Group, 'createdTimestamp'>) => (
				<span>{DateTime.fromISO(data.getValue()).toFormat('hh:mm a')}</span>
			)
		},
		{
			id: 'action-group',
			cell: (data: CellContext<Group, 'id'>) => (
				<div className="flex justify-end gap-x-1 items-center">
					<span
						onClick={event => {
							event.stopPropagation()
							setModalState({ visibility: true, id: (data.row.original as Group).id })
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

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) return
		const file = event.target.files[0]

		const formdata = new FormData()
		formdata.append('file', file)
		mutateGroup(formdata)
	}

	return (
		<AppLayout isHeaderVisible={false} isSidebarVisible>
			{deletePrompt?.visibility && (
				<ConfirmationPrompt
					title="Delete Group"
					label="Enter delete to confirm your action"
					onDelete={() => deleteGroup(deletePrompt.id as number)}
					isOpen={deletePrompt.visibility}
					onClose={() => setDeletePrompt(undefined)}
				/>
			)}
			{modalState?.visibility && (
				<Modal isFullHeight width="w-[500px]" noPadding onClose={() => setModalState(undefined)}>
					<div className="sticky max-md:grid max-md:grid-flow-col max-md:auto-cols-auto md:flex items-center md:justify-between top-0 z-10 bg-white max-md:p-5 md:px-8 py-4 border-b border-border">
						<ChevronLeftIcon
							onClick={() => setModalState(undefined)}
							className="w-3 h-3 md:hidden cursor-pointer"
						/>
						<h1 className="text-primary text-[20px] max-md:text-center whitespace-nowrap max-md:text-sm font-domine font-bold">
							{modalState.id ? 'Edit Group' : 'Add Group'}
						</h1>
						<div className="md:hidden" />
						<XMarkIcon
							onClick={() => setModalState(undefined)}
							className="text-primary max-md:hidden bg-white h-6 w-6 cursor-pointer"
						/>
					</div>
					<CreateOrEditGroup
						group={groups.find(group => group.id === modalState.id)}
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
						<h1 className="text-base font-semibold leading-6 text-gray-900">Groups</h1>
						<p className="mt-2 text-sm text-gray-700">A list of all the groups in your account.</p>
					</div>
					<div className="mt-4 sm:ml-16 sm:mt-0 flex gap-x-2 sm:flex-none">
						<label
							htmlFor="file-upload"
							className="block rounded-md cursor-pointer bg-black px-3 py-2 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
							{groupLoading ? (
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
						<button
							type="button"
							onClick={() => setModalState({ visibility: true })}
							className="block rounded-md bg-darkBlue px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
							Add group
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
								data={filteredGroups}
								onRowClick={(id: number) => navigate(`/admin/users/groups/${id}/members`)}
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
