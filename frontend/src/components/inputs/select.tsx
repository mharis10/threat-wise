import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

import { cn } from 'utils/cn'

interface SelectProps
	extends React.DetailedHTMLProps<
		React.SelectHTMLAttributes<HTMLSelectElement>,
		HTMLSelectElement
	> {
	children: React.ReactNode
	labelText?: string
	isRequired?: string
	index?: string
	errors?: FieldErrors<FieldValues>
	name: string
	register?: UseFormRegister<any>
}

export const Select: React.FC<SelectProps> = ({
	labelText,
	isRequired,
	errors,
	index,
	children,
	register,
	name,
	className,
	...restProps
}) => {
	const errorText = errors?.[name]?.message as string
	return (
		<div className="grow">
			<div className="flex flex-col gap-y-2">
				{labelText && (
					<label
						htmlFor={restProps.id}
						className="block text-sm font-medium leading-6 text-gray-900">
						{labelText}{' '}
						{isRequired === 'false' ? (
							<span className="text-xs text-gray-500">(optional)</span>
						) : (
							''
						)}
					</label>
				)}
				<select
					{...(register?.(name) ?? {})}
					{...restProps}
					className={cn(
						'w-full rounded font-normal py-2 pl-4 bg-white focus:ring-0 border disabled:text-gray-500 focus:border-secondary focus-visible:outline-none border-[#D3E3F1] text-primary placeholder-[#7F9AB2] placeholder:text-sm focus:outline-none text-sm',
						{ 'border-red-500 focus:border-red-500': errorText },
						className
					)}>
					{children}
				</select>
			</div>
			{errorText && <p className="text-xs mt-1 text-red-500">{errorText}</p>}
		</div>
	)
}
