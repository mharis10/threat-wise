import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import clsx from 'clsx'
import { useState } from 'react'
import userService from 'services/user-service'
import { cn } from 'utils/cn'
import ConfirmationPrompt from './confirmation-prompt'
import { PopOver } from './popover'

interface TableProps {
	columns: ColumnDef<any, any>[]
	data: Array<Object>
	hasActionColumn?: boolean
	enableSorting?: boolean
	enablePagination?: boolean
	itemsPerPage?: number
	onRowClick?: (id: number) => void
	className?: string
}

export const Table = ({
	columns,
	data,
	itemsPerPage = 10,
	hasActionColumn = false,
	enableSorting = true,
	enablePagination = true,
	onRowClick,
	className
}: TableProps) => {
	const [sorting, setSorting] = useState<SortingState>([])

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			sorting: sorting
		},
		initialState: {
			pagination: {
				pageSize: itemsPerPage
			}
		},
		sortDescFirst: false,
		onSortingChange: setSorting
	})

	const renderSortingIcons = (headerId: string) => {
		if (!enableSorting) {
			return null
		}

		const isColumnSorted = sorting[0]?.id === headerId
		const isDescending = sorting[0]?.desc

		if (!isColumnSorted) {
			return (
				<>
					<span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
						<ChevronUpIcon className={clsx('h-3 w-3 cursor-pointer')} />
					</span>
					<span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
						<ChevronDownIcon className={clsx('h-3 w-3 cursor-pointer')} />
					</span>
				</>
			)
		}

		return (
			<>
				<span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
					<ChevronUpIcon
						className={clsx('h-3 w-3 cursor-pointer', {
							'stroke-2 stroke-white': !isDescending,
							'text-gray-400': isDescending
						})}
					/>
				</span>
				<span className="ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
					<ChevronDownIcon
						className={clsx('h-3 w-3 cursor-pointer', {
							'stroke-2 stroke-white': isDescending,
							'text-gray-400': !isDescending
						})}
					/>
				</span>
			</>
		)
	}

	let pageArray = [0, 1, 2]
		.map(v => table.getState().pagination.pageIndex + 1 + v)
		.filter(page => page > 0 && page <= table.getPageCount())

	if (table.getState().pagination.pageIndex > table.getPageCount() - 4) {
		pageArray = [-1, 0, 1, 2]
			.map(v => table.getState().pagination.pageIndex + 1 + v)
			.filter(page => page > 0 && page <= table.getPageCount())
	}
	if (table.getState().pagination.pageIndex > table.getPageCount() - 3) {
		pageArray = [-2, -1, 0, 1, 2]
			.map(v => table.getState().pagination.pageIndex + 1 + v)
			.filter(page => page > 0 && page <= table.getPageCount())
	}
	if (table.getState().pagination.pageIndex > table.getPageCount() - 2) {
		pageArray = [-3, -2, -1, 0, 1, 2, 3]
			.map(v => table.getState().pagination.pageIndex + 1 + v)
			.filter(page => page > 0 && page <= table.getPageCount())
	}

	return (
		<table
			className={clsx(
				'max-md:block max-md:whitespace-nowrap border-separate w-full overflow-x-auto border-spacing-0',
				className
			)}>
			<thead>
				{table.getHeaderGroups().map(headerGroup => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map((header, index) => (
							<th
								onClick={enableSorting ? header.column.getToggleSortingHandler() : undefined}
								className="cursor-pointer py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
								key={header.id}>
								{!(hasActionColumn && index === headerGroup.headers.length - 1) && (
									<div className="flex justify-between gap-x-2 items-center">
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
										{{ asc: '', desc: '' }[header.column.getIsSorted() as string] ?? null}
										<div className="flex flex-col">{renderSortingIcons(header.id)}</div>
									</div>
								)}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody>
				{table.getRowModel().rows.map((row, rowIndex) => (
					<tr
						key={row.id}
						onClick={() => onRowClick?.(row.original?.id)}
						className={cn('even:bg-gray-50', { 'hover:bg-gray-200 cursor-pointer': !!onRowClick })}>
						{row.getVisibleCells().map((cell, index) => (
							<td
								className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3"
								key={cell.id}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</td>
						))}
					</tr>
				))}
			</tbody>
			{enablePagination && (
				<tfoot>
					<tr>
						<td colSpan={columns.length}>
							<div className="flex max-sm:ml-4 items-center py-5">
								<div className="flex sm:flex-1 sm:items-center sm:justify-between ">
									<div className="w-full sm:w-auto ml-auto text-right mt-2 sm:mt-0">
										<nav className="isolate inline-flex gap-x-2 rounded-md" aria-label="Pagination">
											<button
												type="button"
												disabled={!table.getCanPreviousPage()}
												className={clsx(
													'relative inline-flex items-center rounded p-1 text-sm font-medium text-[#FFFFFF] bg-[#1232584D] focus:z-20',
													!table.getCanPreviousPage() && 'disabled text-[#C4CDD5] opacity-30'
												)}
												onClick={() => table.previousPage()}>
												<ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
												<span className="sr-only">Previous</span>
											</button>

											{pageArray.map(page => (
												<button
													type="button"
													key={page}
													className={clsx(
														'relative inline-flex w-8 items-center justify-center rounded border px-1 py-[5px] text-primary text-sm font-bold',
														page - 1 === table.getState().pagination.pageIndex
															? 'className="relative z-10 inline-flex items-center border-primary focus:z-20'
															: 'border-[#DFE3E8]'
													)}
													onClick={() => table.setPageIndex(page - 1)}>
													{page}
												</button>
											))}
											{!pageArray.includes(table.getPageCount()) && (
												<>
													{table.getState().pagination.pageIndex < table.getPageCount() - 4 ? (
														<div>...</div>
													) : (
														''
													)}
													<button
														type="button"
														key={'last'}
														className={clsx(
															'relative inline-flex w-8 items-center justify-center rounded border px-1 py-[5px] text-primary text-sm font-bold',
															table.getPageCount() - 1 === table.getState().pagination.pageIndex
																? 'className="relative z-10 inline-flex items-center border-primary focus:z-20'
																: 'border-[#DFE3E8]'
														)}
														onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
														{table.getPageCount()}
													</button>
												</>
											)}

											<button
												type="button"
												disabled={!table.getCanNextPage()}
												className={clsx(
													'relative inline-flex items-center rounded p-1 text-sm font-medium text-[#FFFFFF] bg-[#1232584D] focus:z-20',
													!table.getCanNextPage() && 'disabled text-[#C4CDD5] opacity-30'
												)}
												onClick={() => table.nextPage()}>
												<span className="sr-only">Next</span>
												<ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
											</button>
										</nav>
									</div>
								</div>
							</div>
						</td>
					</tr>
				</tfoot>
			)}
		</table>
	)
}

type ActionTableProps = {
	missingColumns: string[]
	duplicateData: string[]
	validationErrors: {}
	onConfirm: (action: Action) => void
}

export type Action = { [email: string]: 'Skip' | 'Replace' }

type State = isModalVisible | undefined

type isModalVisible = {
	visibility: boolean
	action: 'Skip' | 'Replace'
}

export const ActionTable = ({
	missingColumns,
	duplicateData,
	validationErrors,
	onConfirm
}: ActionTableProps) => {
	const [actions, setActions] = useState<Action>()
	const [deletePrompt, setDeletePrompt] = useState<State>()
	const isButtonDisabled =
		missingColumns.length > 0 ||
		Object.values(actions ?? {}).length !== duplicateData.length ||
		Object.keys(validationErrors).length > 0

	return (
		<div className="px-4 sm:px-6 pt-4 lg:px-8">
			{deletePrompt?.visibility && (
				<ConfirmationPrompt
					title="Overwrite actions"
					label='Are you sure you want to overwrite all actions? Enter "overwrite" to confirm'
					onDelete={() => {
						setActions(undefined)
						duplicateData.map(data =>
							setActions(prev => ({ ...prev, [data]: deletePrompt.action }))
						)
						setDeletePrompt(undefined)
					}}
					actionButtonText="Overwrite"
					confirmationText="overwrite"
					isOpen={deletePrompt.visibility}
					onClose={() => setDeletePrompt(undefined)}
				/>
			)}

			{missingColumns.length > 0 && (
				<>
					<div className="sm:flex sm:items-center">
						<div className="sm:flex-auto">
							<p className="mt-2 text-sm text-gray-700">
								A list of missing columns in your CSV file. You will need to fix these before
								proceeding!
							</p>
							<button
								onClick={() => userService.downloadTemplate()}
								className="mt-1 text-sm text-blue-600 hover:underline">
								Download correct sample
							</button>
						</div>
					</div>
					<div className="mt-3 pb-20 flow-root">
						<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
							<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
								<table className="min-w-full divide-y divide-gray-300">
									<thead>
										<tr>
											<th
												scope="col"
												className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
												Missing Columns
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200 bg-white">
										{missingColumns.map((data, index) => (
											<tr key={index}>
												<td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
													{data}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</>
			)}

			{missingColumns.length === 0 && duplicateData.length > 0 && (
				<>
					<div className="sm:flex sm:items-center">
						<div className="sm:flex-auto">
							<p className="mt-2 text-sm text-gray-700">
								A list of duplicate data in your CSV file. What do you want to do with that?
							</p>
						</div>
						<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
							<button
								type="button"
								onClick={() => onConfirm(actions as Action)}
								disabled={isButtonDisabled}
								className={cn(
									'block rounded-md bg-darkBlue px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
									{ 'bg-gray-400 pointer-events-none': isButtonDisabled }
								)}>
								Confirm
							</button>
						</div>
					</div>
					<div className="mt-3 pb-20 flow-root">
						<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
							<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
								<table className="min-w-full divide-y divide-gray-300">
									<thead>
										<tr>
											<th
												scope="col"
												className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
												Emails
											</th>

											<th
												scope="col"
												className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0">
												<span className="sr-only">Action</span>
												<PopOver
													label="Apply to all"
													onChange={(value: string) =>
														setDeletePrompt({
															visibility: true,
															action: value as 'Skip' | 'Replace'
														})
													}
													options={['Skip', 'Replace']}
													className="ml-auto"
												/>
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200 bg-white">
										{duplicateData.map((data, index) => (
											<tr key={index}>
												<td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
													{data}
												</td>

												<td className="relative whitespace-nowrap flex gap-x-6 justify-end py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
													<p
														onClick={() => {
															setActions(prev => ({ ...prev, [data]: 'Skip' }))
														}}
														className={cn(' cursor-pointer text-gray-400', {
															'font-extrabold text-indigo-600': actions?.[data] === 'Skip'
														})}>
														Skip
													</p>
													<p
														onClick={() => {
															setActions(prev => ({ ...prev, [data]: 'Replace' }))
														}}
														className={cn(' cursor-pointer text-gray-400', {
															'font-extrabold text-primaryRed': actions?.[data] === 'Replace'
														})}>
														Replace
													</p>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</>
			)}

			{missingColumns.length === 0 && Object.keys(validationErrors).length > 0 && (
				<>
					<div className="sm:flex sm:items-center">
						<div className="sm:flex-auto">
							<p className="mt-2 text-sm text-gray-700">
								A list of validation errors in your CSV file. You will need to fix these before
								proceeding!
							</p>
						</div>
					</div>
					<div className="mt-3 pb-20 flow-root">
						<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
							<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
								<table className="min-w-full divide-y divide-gray-300">
									<thead>
										<tr>
											<th
												scope="col"
												className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
												Emails
											</th>
											<th
												scope="col"
												className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
												Errors
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200 bg-white">
										{Object.entries(validationErrors).map(([email, errors], index) => (
											<tr key={index}>
												<td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
													{email}
												</td>
												<td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
													{(errors as string[]).join(', ')}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	)
}
