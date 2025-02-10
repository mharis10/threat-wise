import { InputHTMLAttributes } from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

import { cn } from 'utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	labelText?: string
	isRequired?: string
	name: string
	register?: UseFormRegister<any>
	errors?: FieldErrors<FieldValues>
	className?: string
}

export const Input = ({ labelText, isRequired, name, register, errors, ...props }: InputProps) => {
	const errorText = errors?.[name]?.message as string

	return (
		<div className="grow">
			<div className="flex flex-col gap-y-2">
				{labelText && (
					<label htmlFor={props.id} className="block text-sm font-medium leading-6 text-gray-900">
						{labelText}{' '}
						{isRequired === 'false' ? (
							<span className="text-xs text-gray-500">(optional)</span>
						) : (
							''
						)}
					</label>
				)}
				<input
					{...(register?.(name) ?? {})}
					type="text"
					name={name}
					{...props}
					className={cn(
						'w-full rounded font-normal py-2 pl-4 bg-white focus:ring-0 border disabled:text-gray-500 focus:border-secondary focus-visible:outline-none border-[#D3E3F1] text-primary placeholder-[#7F9AB2] placeholder:text-sm focus:outline-none text-sm',
						{ 'border-red-500 focus:border-red-500': errorText },
						props.className
					)}
				/>
			</div>
			{errorText && <p className="text-xs text-red-500 mt-1">{errorText}</p>}
		</div>
	)
}
