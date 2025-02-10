import { ChevronDownIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

import { useComponentVisible } from 'hooks/useComponentVisible'

interface MultiSelectProps {
	label?: string
	options: { label: string; value: any }[]
	selectedOptions: { label: string; value: any }[]
	onChange: (selectedOptions: any[]) => void
	className?: string
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
	label,
	options,
	selectedOptions,
	onChange,
	className
}) => {
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false)

	const handleOptionClick = (option: { label: string; value: any }) => {
		const isSelected = selectedOptions.find(opt => opt.label === option.label)
		let newSelectedOptions: any[] = []
		if (option?.value === 'all' && selectedOptions.length === options.length) {
			newSelectedOptions = []
			return onChange(newSelectedOptions)
		}
		newSelectedOptions = isSelected
			? selectedOptions.filter(selectedOption => selectedOption.label !== option.label)
			: [...selectedOptions, option]
		if (newSelectedOptions.find(option => option.value === 'all')) {
			newSelectedOptions = [...options]
		}
		onChange(newSelectedOptions)
	}

	return (
		<div className="flex flex-col gap-y-2">
			{label && (
				<label className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
			)}
			<div ref={ref} className="relative">
				<div
					className={clsx(
						'w-full flex flex-wrap gap-y-0.5 gap-x-2 items-center rounded-md font-normal pl-4 min-h-[46px] py-2 bg-transparent focus:ring-0 border text-primary placeholder-[#7F9AB2] placeholder:text-base focus:outline-none max-md:text-sm',
						isComponentVisible ? 'border-secondary' : 'border-[#D3E3F1]'
					)}
					onClick={() => {
						return
						setIsComponentVisible(prev => !prev)
					}}>
					{selectedOptions.map(option => (
						<div
							key={option.value}
							className="flex bg-[#D3E3F1] whitespace-nowrap overflow-auto text-sm w-fit gap-x-[3px] rounded-full py-0.5 pl-3 pr-2 justify-between item-center">
							<span>{option.label}</span>
							<svg
								onClick={event => {
									event.stopPropagation()
									handleOptionClick(option)
								}}
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 19 19"
								className="mt-px cursor-pointer"
								fill="none">
								<g clipPath="url(#clip0_3281_13039)">
									<path
										d="M14.75 5.74842L13.6925 4.69092L9.5 8.88342L5.3075 4.69092L4.25 5.74842L8.4425 9.94092L4.25 14.1334L5.3075 15.1909L9.5 10.9984L13.6925 15.1909L14.75 14.1334L10.5575 9.94092L14.75 5.74842Z"
										fill="#001F3F"
									/>
								</g>
								<defs>
									<clipPath id="clip0_3281_13039">
										<rect width="18" height="18" fill="white" transform="translate(0.5 0.940918)" />
									</clipPath>
								</defs>
							</svg>
						</div>
					))}
					{/* <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
						<ChevronDownIcon className="w-4 h-4" />
					</span> */}
				</div>
				{isComponentVisible && (
					<div className="absolute z-20 w-full rounded bg-white border border-border mt-0.5 shadow-md">
						<div className="max-h-48 overflow-auto">
							{[{ label: 'Select All', value: 'all' }, ...options].map(option => (
								<div
									key={option.label}
									className="px-6 flex gap-x-2.5 items-center py-3 text-sm text-primary cursor-pointer hover:bg-gray-100"
									onClick={() => handleOptionClick(option)}>
									{selectedOptions.length === options.length ||
									selectedOptions.find(opt => opt.label === option.label) ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="18"
											height="19"
											viewBox="0 0 18 19"
											fill="none">
											<path
												d="M7.94998 10.8096L6.20766 9.06731C6.10382 8.96346 5.97329 8.91033 5.81608 8.90793C5.65888 8.90552 5.52596 8.95864 5.41731 9.06731C5.30864 9.17596 5.25431 9.30768 5.25431 9.46248C5.25431 9.61728 5.30864 9.74901 5.41731 9.85766L7.47547 11.9158C7.61105 12.0514 7.76922 12.1192 7.94998 12.1192C8.13074 12.1192 8.28891 12.0514 8.42449 11.9158L12.5971 7.74324C12.7009 7.6394 12.7541 7.50887 12.7565 7.35166C12.7589 7.19445 12.7057 7.06152 12.5971 6.95287C12.4884 6.84422 12.3567 6.78989 12.2019 6.78989C12.0471 6.78989 11.9154 6.84422 11.8067 6.95287L7.94998 10.8096ZM3.98077 15.875C3.60193 15.875 3.28125 15.7437 3.01875 15.4812C2.75625 15.2187 2.625 14.898 2.625 14.5192V4.48078C2.625 4.10193 2.75625 3.78125 3.01875 3.51875C3.28125 3.25625 3.60193 3.125 3.98077 3.125H14.0192C14.398 3.125 14.7187 3.25625 14.9812 3.51875C15.2437 3.78125 15.375 4.10193 15.375 4.48078V14.5192C15.375 14.898 15.2437 15.2187 14.9812 15.4812C14.7187 15.7437 14.398 15.875 14.0192 15.875H3.98077Z"
												fill="#13BAB4"
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
											/>
										</svg>
									)}
									{option.label}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

interface MultiSelectProps {
	label?: string
	options: { label: string; value: any }[]
	selectedOptions: { label: string; value: any }[]
	onChange: (selectedOptions: any[]) => void
	className?: string
}

export const MultiOptionSelect: React.FC<MultiSelectProps> = ({
	label,
	options,
	selectedOptions,
	onChange,
	className
}) => {
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false)

	const handleOptionClick = (option: { label: string; value: any }) => {
		const isSelected = selectedOptions.find(opt => opt.label === option.label)
		let newSelectedOptions: any[] = []
		if (option?.value === 'all' && selectedOptions.length === options.length) {
			newSelectedOptions = []
			return onChange(newSelectedOptions)
		}
		newSelectedOptions = isSelected
			? selectedOptions.filter(selectedOption => selectedOption.label !== option.label)
			: [...selectedOptions, option]
		if (newSelectedOptions.find(option => option.value === 'all')) {
			newSelectedOptions = [...options]
		}
		onChange(newSelectedOptions)
	}

	return (
		<div className="flex flex-col gap-y-2">
			{label && (
				<label className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
			)}
			<div ref={ref} className="relative">
				<div
					className={clsx(
						'w-full flex flex-wrap gap-y-0.5 gap-x-2 items-center rounded-md font-normal pl-4 min-h-[43px] py-2 bg-transparent focus:ring-0 border text-primary placeholder-[#7F9AB2] placeholder:text-base focus:outline-none max-md:text-sm',
						isComponentVisible ? 'border-secondary' : 'border-[#D3E3F1]'
					)}
					onClick={() => setIsComponentVisible(prev => !prev)}>
					{selectedOptions.map(option => (
						<div
							key={option.value}
							className="flex bg-[#D3E3F1] whitespace-nowrap overflow-auto text-sm w-fit gap-x-[3px] rounded-full py-0.5 pl-3 pr-2 justify-between item-center">
							<span>{option.label}</span>
							<svg
								onClick={event => {
									event.stopPropagation()
									handleOptionClick(option)
								}}
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 19 19"
								className="mt-px cursor-pointer"
								fill="none">
								<g clipPath="url(#clip0_3281_13039)">
									<path
										d="M14.75 5.74842L13.6925 4.69092L9.5 8.88342L5.3075 4.69092L4.25 5.74842L8.4425 9.94092L4.25 14.1334L5.3075 15.1909L9.5 10.9984L13.6925 15.1909L14.75 14.1334L10.5575 9.94092L14.75 5.74842Z"
										fill="#001F3F"
									/>
								</g>
								<defs>
									<clipPath id="clip0_3281_13039">
										<rect width="18" height="18" fill="white" transform="translate(0.5 0.940918)" />
									</clipPath>
								</defs>
							</svg>
						</div>
					))}
					<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
						<ChevronDownIcon className="w-4 h-4" />
					</span>
				</div>
				{isComponentVisible && (
					<div className="absolute z-20 w-full rounded bg-white border border-border mt-0.5 shadow-md">
						<div className="max-h-48 overflow-auto">
							{[{ label: 'Select All', value: 'all' }, ...options].map(option => (
								<div
									key={option.label}
									className="px-6 flex gap-x-2.5 items-center py-3 text-sm text-primary cursor-pointer hover:bg-gray-100"
									onClick={() => handleOptionClick(option)}>
									{selectedOptions.length === options.length ||
									selectedOptions.find(opt => opt.label === option.label) ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="18"
											height="19"
											viewBox="0 0 18 19"
											fill="none">
											<path
												d="M7.94998 10.8096L6.20766 9.06731C6.10382 8.96346 5.97329 8.91033 5.81608 8.90793C5.65888 8.90552 5.52596 8.95864 5.41731 9.06731C5.30864 9.17596 5.25431 9.30768 5.25431 9.46248C5.25431 9.61728 5.30864 9.74901 5.41731 9.85766L7.47547 11.9158C7.61105 12.0514 7.76922 12.1192 7.94998 12.1192C8.13074 12.1192 8.28891 12.0514 8.42449 11.9158L12.5971 7.74324C12.7009 7.6394 12.7541 7.50887 12.7565 7.35166C12.7589 7.19445 12.7057 7.06152 12.5971 6.95287C12.4884 6.84422 12.3567 6.78989 12.2019 6.78989C12.0471 6.78989 11.9154 6.84422 11.8067 6.95287L7.94998 10.8096ZM3.98077 15.875C3.60193 15.875 3.28125 15.7437 3.01875 15.4812C2.75625 15.2187 2.625 14.898 2.625 14.5192V4.48078C2.625 4.10193 2.75625 3.78125 3.01875 3.51875C3.28125 3.25625 3.60193 3.125 3.98077 3.125H14.0192C14.398 3.125 14.7187 3.25625 14.9812 3.51875C15.2437 3.78125 15.375 4.10193 15.375 4.48078V14.5192C15.375 14.898 15.2437 15.2187 14.9812 15.4812C14.7187 15.7437 14.398 15.875 14.0192 15.875H3.98077Z"
												fill="#13BAB4"
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
											/>
										</svg>
									)}
									{option.label}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
