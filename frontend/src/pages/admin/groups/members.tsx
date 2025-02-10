import { CellContext } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'

import { enqueueSnackbar } from 'notistack'

import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import ConfirmationPrompt from 'components/app/confirmation-prompt'
import { AppLayout } from 'components/app/layout'
import { Modal } from 'components/app/modal'
import { Table } from 'components/app/table'
import { QUERY_KEYS } from 'constants'
import { useNavigate, useParams } from 'react-router-dom'
import groupMemberService from 'services/group-member-service'
import { CreateGroupMembers } from './create'

type State = isModalVisible | undefined

type isModalVisible = {
	visibility: boolean
	id?: number | undefined
}

export const GroupMembers = () => {
	const { id: groupId } = useParams() as { id: string }
	const navigate = useNavigate()
	const [groupMembers, setGroupMembers] = useState<GroupMember[]>([])
	const [searchText, setSearchText] = useState<string>()
	const [modalState, setModalState] = useState<State>({
		visibility: false,
		id: undefined
	})
	const [deletePrompt, setDeletePrompt] = useState<State>({
		visibility: false,
		id: undefined
	})

	const { refetch } = useQuery(
		QUERY_KEYS.ADD_GROUP_MEMBERS,
		() => groupMemberService.getMyGroupMembers(Number(groupId)),
		{
			refetchOnWindowFocus: false,
			onSuccess(data) {
				setGroupMembers(data)
			},
			onError() {
				setGroupMembers([])
				enqueueSnackbar('Error fetching group members', { variant: 'error' })
			}
		}
	)

	const { mutate: removeGroupMember } = useMutation({
		mutationKey: QUERY_KEYS.REMOVE_GROUP_MEMBERS,
		mutationFn: (userId: number) => groupMemberService.removeGroupMember(Number(groupId), userId),
		onSuccess: () => {
			enqueueSnackbar('Group member removed successfully')
			setDeletePrompt(undefined)
			refetch()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const { filteredGroupMembers } = useMemo(() => {
		const { filteredGroupMembers } = groupMembers.reduce(
			(prev, curr) => {
				if (searchText) {
					const memberName = curr.User.firstName + ' ' + curr.User.lastName
					if (
						memberName?.toLowerCase().includes(searchText.toLowerCase()) ||
						curr.User.email.toLowerCase().includes(searchText.toLowerCase())
					) {
						return { filteredGroupMembers: [...prev.filteredGroupMembers, curr] }
					}
				} else {
					return { filteredGroupMembers: [...prev.filteredGroupMembers, curr] }
				}
				return prev
			},
			{
				filteredGroupMembers: [] as GroupMember[]
			}
		)
		return { filteredGroupMembers }
	}, [groupMembers, searchText])

	const columns = [
		{
			header: 'Id',
			accessorKey: 'id'
		},
		{
			header: 'Name',
			accessorFn: (row: GroupMember) => `${row.User.firstName} ${row.User.lastName}`
		},
		{
			header: 'Email',
			accessorKey: 'User.email'
		},
		{
			header: 'User Id',
			accessorKey: 'userId'
		},
		{
			id: 'action-group-member',
			cell: (data: CellContext<GroupMember, 'id'>) => (
				<div className="flex justify-end gap-x-1 items-center">
					<span
						onClick={event => {
							event.stopPropagation()
							setDeletePrompt({ visibility: true, id: (data.row.original as GroupMember).userId })
						}}
						className="inline-flex cursor-pointer items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium ring-1 ring-inset text-primaryRed ring-red-600/20">
						Delete
					</span>
				</div>
			)
		}
	]

	return (
		<AppLayout isHeaderVisible={false} isSidebarVisible>
			{deletePrompt?.visibility && (
				<ConfirmationPrompt
					title="Delete Group Member"
					label="Enter delete to confirm your action"
					onDelete={() => removeGroupMember(deletePrompt.id as number)}
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
							Add Group Members
						</h1>
						<div className="md:hidden" />
						<XMarkIcon
							onClick={() => setModalState(undefined)}
							className="text-primary max-md:hidden bg-white h-6 w-6 cursor-pointer"
						/>
					</div>
					<CreateGroupMembers
						groupId={Number(groupId)}
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
						<h1 className="text-base font-semibold leading-6 text-gray-900">Group Members</h1>
						<p className="mt-2 text-sm text-gray-700">A list of all the group members.</p>
					</div>
					<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
						<button
							type="button"
							onClick={() => setModalState({ visibility: true })}
							className="block rounded-md bg-darkBlue px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
							Add group members
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
								data={filteredGroupMembers}
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
