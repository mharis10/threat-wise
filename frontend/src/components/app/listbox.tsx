import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Fragment } from 'react'

import { cn } from 'utils/cn'

type Option = { id: number; name: string }

interface ListBoxProps {
	label: string
	options: Option[]
	value: Option
	onChange: (option: Option) => void
}

export const ListBox = ({ label, options, value, onChange }: ListBoxProps) => {
	return (
		<Listbox value={value} onChange={onChange}>
			{({ open }) => (
				<>
					<Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
						{label}
					</Listbox.Label>
					<div className="relative mt-2">
						<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-darkBlue sm:text-sm sm:leading-6">
							<span className="block truncate max-md:text-sm">{value.name}</span>
							<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
								<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
							</span>
						</Listbox.Button>

						<Transition
							show={open}
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0">
							<Listbox.Options className="absolute min-w-max z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
								{options.map(option => (
									<Listbox.Option
										key={option.id}
										className={({ active }) =>
											cn(
												active ? 'bg-darkBlue text-white' : 'text-gray-900',
												'relative cursor-default select-none py-2 pl-3 pr-9'
											)
										}
										value={option}>
										{({ selected, active }) => (
											<>
												<span
													className={cn(
														selected ? 'font-semibold' : 'font-normal',
														'block truncate max-md:text-sm'
													)}>
													{option.name}
												</span>

												{selected ? (
													<span
														className={cn(
															active ? 'text-white' : 'text-darkBlue',
															'absolute inset-y-0 right-0 flex items-center pr-4'
														)}>
														<CheckIcon className="h-5 w-5" aria-hidden="true" />
													</span>
												) : null}
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	)
}
