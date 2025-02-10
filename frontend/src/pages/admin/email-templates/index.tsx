import { CellContext } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'

import { DateTime } from 'luxon'

import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AppLayout } from 'components/app/layout'
import { Modal } from 'components/app/modal'
import { Table } from 'components/app/table'
import { QUERY_KEYS } from 'constants'
import { useAppSelector } from 'hooks'
import { enqueueSnackbar } from 'notistack'
import emailTemplateService from 'services/email-template-service'
import { cn } from 'utils/cn'
import { CreateOrEditTemplate } from './create'

type State = isModalVisible | undefined

type isModalVisible = {
	visibility: boolean
	id?: number | undefined
}

export const EmailTemplates = () => {
	const auth = useAppSelector(state => state.auth)

	const [superAdminTemplates, setSuperAdminTemplates] = useState<EmailTemplate[]>([])
	const [myTemplates, setMyTemplates] = useState<EmailTemplate[]>([])
	const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([])
	const [searchText, setSearchText] = useState<string>()
	const [modalState, setModalState] = useState<State>({
		visibility: false,
		id: undefined
	})

	const { refetch } = useQuery(QUERY_KEYS.ALL_TEMPLATES, emailTemplateService.getAllTemplates, {
		refetchOnWindowFocus: false,
		enabled: auth.user?.role === 'Super Admin',
		onSuccess(data) {
			setEmailTemplates(data)
		},
		onError() {
			setEmailTemplates([])
			enqueueSnackbar('Error fetching templates', { variant: 'error' })
		}
	})

	const { refetch: refetchMyTemplate } = useQuery(
		QUERY_KEYS.MY_TEMPLATES,
		emailTemplateService.getMyTemplates,
		{
			refetchOnWindowFocus: false,
			enabled: auth.user?.role === 'Company Admin',
			onSuccess(data) {
				const superAdminTemplates = data.filter(template => template.User.role === 'Super Admin')
				const myTemplates = data.filter(template => template.User.role !== 'Super Admin')
				setSuperAdminTemplates(superAdminTemplates)
				setMyTemplates(myTemplates)
			},
			onError() {
				setSuperAdminTemplates([])
				setMyTemplates([])
				enqueueSnackbar('Error fetching templates', { variant: 'error' })
			}
		}
	)

	const { mutate: enableTemplate } = useMutation({
		mutationKey: QUERY_KEYS.ENABLE_TEMPLATE,
		mutationFn: (templateId: number) =>
			emailTemplateService.enableTemplate(templateId, auth.user?.role as User['role']),
		onSuccess: () => {
			enqueueSnackbar('Template enabled successfully')
			auth.user?.role === 'Super Admin' ? refetch() : refetchMyTemplate()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const { mutate: disableTemplate } = useMutation({
		mutationKey: QUERY_KEYS.DISABLE_TEMPLATE,
		mutationFn: (templateId: number) =>
			emailTemplateService.disableTemplate(templateId, auth.user?.role as User['role']),
		onSuccess: () => {
			enqueueSnackbar('Template disabled successfully')
			auth.user?.role === 'Super Admin' ? refetch() : refetchMyTemplate()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const { filteredTemplates } = useMemo(() => {
		const { filteredTemplates } = emailTemplates.reduce(
			(prev, curr) => {
				if (searchText) {
					if (
						curr.title.toLowerCase().includes(searchText.toLowerCase()) ||
						curr.subject.toLowerCase().includes(searchText.toLowerCase()) ||
						curr.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
					) {
						return { filteredTemplates: [...prev.filteredTemplates, curr] }
					}
				} else {
					return { filteredTemplates: [...prev.filteredTemplates, curr] }
				}
				return prev
			},
			{
				filteredTemplates: [] as EmailTemplate[]
			}
		)
		return { filteredTemplates }
	}, [emailTemplates, searchText])

	const filteredSuperAdminTemplates = useMemo(() => {
		return superAdminTemplates.filter(template => {
			if (searchText) {
				return (
					template.title.toLowerCase().includes(searchText.toLowerCase()) ||
					template.subject.toLowerCase().includes(searchText.toLowerCase()) ||
					template.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
				)
			}
			return true
		})
	}, [superAdminTemplates, searchText])

	const filteredMyTemplates = useMemo(() => {
		return myTemplates.filter(template => {
			if (searchText) {
				return (
					template.title.toLowerCase().includes(searchText.toLowerCase()) ||
					template.subject.toLowerCase().includes(searchText.toLowerCase()) ||
					template.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
				)
			}
			return true
		})
	}, [myTemplates, searchText])

	const columns = [
		{
			header: 'Title',
			accessorKey: 'title'
		},
		{
			header: 'Subject',
			accessorKey: 'subject'
		},
		{
			header: 'Updated At',
			accessorKey: 'modifiedTimestamp',
			cell: (data: CellContext<EmailTemplate, 'modifiedTimestamp'>) =>
				DateTime.fromISO(data.getValue()).toFormat('dd-LL-yyyy')
		},
		{
			header: 'Status',
			accessorKey: 'isActive',
			cell: (data: CellContext<EmailTemplate, 'isActive'>) => (
				<span
					onClick={() => {
						if (
							auth.user?.role !== 'Super Admin' &&
							(data.row.original as EmailTemplate).User.role !== auth.user?.role
						)
							return
						data.getValue()
							? disableTemplate((data.row.original as EmailTemplate).id)
							: enableTemplate((data.row.original as EmailTemplate).id)
					}}
					className={cn(
						'inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium ring-1 ring-inset ',
						data.getValue() ? 'text-green-700 ring-green-600/20' : 'text-red-700 ring-red-600/20',
						{
							'cursor-pointer':
								auth.user?.role === 'Super Admin' ||
								(data.row.original as EmailTemplate).User.role === auth.user?.role
						}
					)}>
					{data.getValue() ? 'Active' : 'Inactive'}
				</span>
			)
		},
		{
			id: 'action-email-template',
			hasNoHeading: true,
			cell: (data: CellContext<EmailTemplate, 'id'>) => (
				<>
					{(auth.user?.role === 'Super Admin' ||
						(data.row.original as EmailTemplate).User.role === auth.user?.role) && (
						<span
							onClick={() =>
								setModalState({ visibility: true, id: (data.row.original as EmailTemplate).id })
							}
							className="inline-flex cursor-pointer items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium ring-1 ring-inset text-primary ring-blue-600/20">
							Edit
						</span>
					)}
				</>
			)
		}
	]

	const renderTable = (data: EmailTemplate[], title: string) => (
		<>
			<h2 className="text-lg font-semibold leading-6 text-gray-900 mt-4">{title}</h2>
			<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 mt-2">
				<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
					<Table hasActionColumn data={data} columns={columns} className="table-auto" />
				</div>
			</div>
		</>
	)

	return (
		<AppLayout isHeaderVisible={false} isSidebarVisible>
			{modalState?.visibility && (
				<Modal isFullHeight width="w-[900px]" noPadding onClose={() => setModalState(undefined)}>
					<div className="sticky max-md:grid max-md:grid-flow-col max-md:auto-cols-auto md:flex items-center md:justify-between top-0 z-10 bg-white max-md:p-5 md:px-8 py-4 border-b border-border">
						<ChevronLeftIcon
							onClick={() => setModalState(undefined)}
							className="w-3 h-3 md:hidden cursor-pointer"
						/>
						<h1 className="text-primary text-[20px] max-md:text-center whitespace-nowrap max-md:text-sm font-domine font-bold">
							{modalState.id ? 'Edit Template' : 'Add Template'}
						</h1>
						<div className="md:hidden" />
						<XMarkIcon
							onClick={() => setModalState(undefined)}
							className="text-primary max-md:hidden bg-white h-6 w-6 cursor-pointer"
						/>
					</div>
					<CreateOrEditTemplate
						templateId={modalState.id}
						template={myTemplates.find(template => template.id === modalState.id)}
						refetch={() => {
							refetchMyTemplate()
							setModalState(undefined)
						}}
						onCancel={() => setModalState(undefined)}
					/>
				</Modal>
			)}
			<input
				style={{ boxShadow: '0px 6px 24px 0px rgba(18, 50, 88, 0.08)' }}
				type="text"
				placeholder="Search Term..."
				value={searchText}
				onChange={e => setSearchText(e.target.value)}
				className="rounded mt-4 max-md:w-full md:w-1/3 font-normal py-2 bg-white focus:ring-0 border disabled:text-gray-500 focus:border-secondary focus-visible:outline-none border-[#D3E3F1] text-primary placeholder-[#7F9AB2] placeholder:text-sm focus:outline-none text-sm"
			/>
			<div className="mt-6 flow-root">
				<div className="-mx-0 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
					<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
						{auth.user?.role === 'Company Admin' && (
							<>
								{renderTable(filteredSuperAdminTemplates, 'Super Admin Templates')}
								{renderTable(filteredMyTemplates, 'My Templates')}
							</>
						)}
						{auth.user?.role === 'Super Admin' && (
							<Table
								hasActionColumn
								data={filteredTemplates}
								columns={columns}
								className="table-auto"
							/>
						)}
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
