import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label,
  Transition
} from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Fragment, useState } from 'react'
import { FixedSizeList as List } from 'react-window'

import { cn } from 'utils/cn'

interface ComboBoxProps {
	labelText: string
	options: string[]
	value?: string
	onChange: (option: string | null) => void
	hasError?: boolean
}

export const ComboBox = ({ labelText, hasError, value = '', options, onChange }: ComboBoxProps) => {
	const [query, setQuery] = useState('')

	const filteredOptions =
		query === ''
			? options
			: options.filter(option => {
					return option.toLowerCase().includes(query.toLowerCase())
				})

	return (
		<Combobox immediate as="div" value={value} onChange={onChange}>
			<Label className="block text-sm font-medium leading-6 text-gray-900">{labelText}</Label>
			<div className="relative mt-2">
				<ComboboxInput
					className={cn(
						'w-full rounded font-normal py-2 pl-4 pr-8 bg-white focus:ring-0 border disabled:text-gray-500 focus:border-secondary focus-visible:outline-none border-[#D3E3F1] text-primary placeholder-[#7F9AB2] placeholder:text-sm focus:outline-none text-sm',
						{ 'border-red-500 focus:border-red-500': hasError }
					)}
					onChange={event => setQuery(event.target.value)}
				/>
				<ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
					<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
				</ComboboxButton>

				<ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-hidden rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
					{query.length > 0 && (
						<ComboboxOption
							value={query}
							className="data-[focus]:bg-darkBlue data-[focus]:text-white text-gray-900 py-2 pl-3 pr-9">
							<span className="font-bold">{query}</span>
						</ComboboxOption>
					)}
					{filteredOptions.length > 0 && (
						<List height={240} itemCount={filteredOptions.length} itemSize={35} width="100%">
							{({ index, style }) => (
								<ComboboxOption
									key={filteredOptions[index]}
									value={filteredOptions[index]}
									style={style}
									className={({ active }) =>
										cn(
											'relative cursor-default select-none py-2 pl-3 pr-9',
											active ? 'bg-darkBlue text-white' : 'text-gray-900'
										)
									}>
									{({ active, selected }) => (
										<>
											<span className={cn('block truncate', selected && 'font-semibold')}>
												{filteredOptions[index]}
											</span>

											{selected && (
												<span
													className={cn(
														'absolute inset-y-0 right-0 flex items-center pr-4',
														active ? 'text-white' : 'text-darkBlue'
													)}>
													<CheckIcon className="h-5 w-5" aria-hidden="true" />
												</span>
											)}
										</>
									)}
								</ComboboxOption>
							)}
						</List>
					)}
				</ComboboxOptions>
			</div>
		</Combobox>
	)
}

interface MultiComboboxProps {
	options: { id: number; label: string }[]
	onChange: (value: { id: number; label: string }[]) => void
	selectedItems: { id: number; label: string }[]
	placeholder: string
	className?: string
}

export const MultiCombobox = ({
	selectedItems,
	options,
	onChange,
	placeholder,
	className
}: MultiComboboxProps) => {
	const [query, setQuery] = useState('')

	const filteredOptions =
		query === ''
			? options
			: options.filter(option => {
					return option.label
						.toLowerCase()
						.replace(/\s+/g, '')
						.includes(query.toLowerCase().replace(/\s+/g, ''))
				})

	return (
		<Combobox immediate value={selectedItems} onChange={onChange} multiple>
			<div className="flex flex-col">
				<div className="relative cursor-default bg-white text-left border-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
					<div className="relative overflow-visible rounded-md">
						<Label className="block mb-2 text-sm font-medium leading-6 text-gray-900">
							{placeholder}
						</Label>
						<ComboboxInput
							className="w-full rounded font-normal pr-8 py-2 pl-4 bg-white focus:ring-0 border disabled:text-gray-500 focus:border-secondary focus-visible:outline-none border-[#D3E3F1] text-primary placeholder-[#7F9AB2] placeholder:text-sm focus:outline-none text-sm"
							displayValue={() => selectedItems.map(item => item.label).join(', ')}
							onChange={event => setQuery(event.target.value)}
						/>
					</div>
					<ComboboxButton className="absolute inset-y-0 translate-y-[16px] flex items-center right-0 pr-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none">
							<path
								d="M9.99988 12.2178C9.89945 12.2178 9.80597 12.2018 9.71944 12.1697C9.6329 12.1377 9.55064 12.0826 9.47265 12.0047L5.72746 8.25947C5.61207 8.14409 5.55305 7.99906 5.55038 7.82438C5.5477 7.6497 5.60673 7.502 5.72746 7.38128C5.84819 7.26056 5.99455 7.2002 6.16655 7.2002C6.33855 7.2002 6.48491 7.26056 6.60563 7.38128L9.99988 10.7755L13.3941 7.38128C13.5095 7.2659 13.6545 7.20687 13.8292 7.20419C14.0039 7.20153 14.1516 7.26056 14.2723 7.38128C14.393 7.502 14.4534 7.64837 14.4534 7.82038C14.4534 7.99238 14.393 8.13874 14.2723 8.25947L10.5271 12.0047C10.4491 12.0826 10.3669 12.1377 10.2803 12.1697C10.1938 12.2018 10.1003 12.2178 9.99988 12.2178Z"
								fill="#123258"
							/>
						</svg>
					</ComboboxButton>
				</div>
				{filteredOptions.length > 0 && (
					<Transition
						as={Fragment}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						<ComboboxOptions
							className={cn(
								'mt-1 z-50 max-h-60 min-w-max overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm',
								className
							)}>
							{filteredOptions.map(option => (
								<ComboboxOption
									className={({ active }) =>
										`relative flex gap-x-3 group items-center cursor-pointer select-none py-1 pr-2 pl-4 ${
											active ? 'bg-primaryRed text-white' : 'text-gray-900'
										}`
									}
									key={option.id}
									value={option}>
									{({ active }) => (
										<>
											{selectedItems.some(item => item.id === option.id) ? (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="18"
													height="19"
													viewBox="0 0 18 19"
													fill="none">
													<path
														d="M7.94998 10.8096L6.20766 9.06731C6.10382 8.96346 5.97329 8.91033 5.81608 8.90793C5.65888 8.90552 5.52596 8.95864 5.41731 9.06731C5.30864 9.17596 5.25431 9.30768 5.25431 9.46248C5.25431 9.61728 5.30864 9.74901 5.41731 9.85766L7.47547 11.9158C7.61105 12.0514 7.76922 12.1192 7.94998 12.1192C8.13074 12.1192 8.28891 12.0514 8.42449 11.9158L12.5971 7.74324C12.7009 7.6394 12.7541 7.50887 12.7565 7.35166C12.7589 7.19445 12.7057 7.06152 12.5971 6.95287C12.4884 6.84422 12.3567 6.78989 12.2019 6.78989C12.0471 6.78989 11.9154 6.84422 11.8067 6.95287L7.94998 10.8096ZM3.98077 15.875C3.60193 15.875 3.28125 15.7437 3.01875 15.4812C2.75625 15.2187 2.625 14.898 2.625 14.5192V4.48078C2.625 4.10193 2.75625 3.78125 3.01875 3.51875C3.28125 3.25625 3.60193 3.125 3.98077 3.125H14.0192C14.398 3.125 14.7187 3.25625 14.9812 3.51875C15.2437 3.78125 15.375 4.10193 15.375 4.48078V14.5192C15.375 14.898 15.2437 15.2187 14.9812 15.4812C14.7187 15.7437 14.398 15.875 14.0192 15.875H3.98077Z"
														fill="#ff5555"
														className={cn('group-hover:fill-white', {
															'fill-white': active
														})}
													/>
												</svg>
											) : (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="18"
													height="19"
													viewBox="0 0 18 19"
													fill="none">
													<path
														d="M3.98077 15.875C3.60193 15.875 3.28125 15.7437 3.01875 15.4812C2.75625 15.2187 2.625 14.898 2.625 14.5192V4.48078C2.625 4.10193 2.75625 3.78125 3.01875 3.51875C3.28125 3.25625 3.60193 3.125 3.98077 3.125H14.0192C14.398 3.125 14.7187 3.25625 14.9812 3.51875C15.2437 3.78125 15.375 4.10193 15.375 4.48078V14.5192C15.375 14.898 15.2437 15.2187 14.9812 15.4812C14.7187 15.7437 14.398 15.875 14.0192 15.875H3.98077ZM3.98077 14.75H14.0192C14.0769 14.75 14.1298 14.7259 14.1779 14.6779C14.2259 14.6298 14.25 14.5769 14.25 14.5192V4.48078C14.25 4.42308 14.2259 4.37018 14.1779 4.32209C14.1298 4.27402 14.0769 4.24998 14.0192 4.24998H3.98077C3.92308 4.24998 3.87018 4.27402 3.82209 4.32209C3.77402 4.37018 3.74998 4.42308 3.74998 4.48078V14.5192C3.74998 14.5769 3.77402 14.6298 3.82209 14.6779C3.87018 14.7259 3.92308 14.75 3.98077 14.75Z"
														fill="#7F9AB2"
														className={cn('group-hover:fill-white', { 'fill-white': active })}
													/>
												</svg>
											)}

											{option.label}
										</>
									)}
								</ComboboxOption>
							))}
						</ComboboxOptions>
					</Transition>
				)}
			</div>
		</Combobox>
	)
}
