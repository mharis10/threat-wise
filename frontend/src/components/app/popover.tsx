import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { cn } from 'utils/cn'

interface PopOverProps {
	label: string
	options: string[]
	onChange: (value: string) => void
	className?: string
}

export const PopOver = ({ label, options, onChange, className }: PopOverProps) => {
	return (
		<Popover>
			<PopoverButton
				className={cn(
					'block text-sm/6 font-semibold text-primary focus:outline-none data-[active]:text-darkBlue data-[hover]:text-darkBlue data-[focus]:outline-1 data-[focus]:outline-none',
					className
				)}>
				{label}
			</PopoverButton>
			<PopoverPanel
				transition
				anchor="bottom"
				className="divide-y divide-gray-200 border border-gray-200 w-28 text-center z-50 rounded-md bg-white shadow-lg mt-1 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0">
				{options.map(option => (
					<div onClick={() => onChange(option)} key={option} className="cursor-pointer">
						<p className=" text-primary text-sm py-1 hover:bg-darkBlue hover:text-white">
							{option}
						</p>
					</div>
				))}
			</PopoverPanel>
		</Popover>
	)
}
