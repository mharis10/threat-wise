import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Fragment } from 'react'

interface FlyoutMenuProps {
	title: string
	children: React.ReactNode
}

export const FlyoutMenu = ({ title, children }: FlyoutMenuProps) => {
	return (
		<Popover className="relative">
			<PopoverButton className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
				<span>{title}</span>
				<ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
			</PopoverButton>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-200"
				enterFrom="opacity-0 translate-y-1"
				enterTo="opacity-100 translate-y-0"
				leave="transition ease-in duration-150"
				leaveFrom="opacity-100 translate-y-0"
				leaveTo="opacity-0 translate-y-1">
				<PopoverPanel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
					<div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
						<div className="p-4">{children}</div>
					</div>
				</PopoverPanel>
			</Transition>
		</Popover>
	)
}
