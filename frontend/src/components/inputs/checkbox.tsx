import { InputHTMLAttributes } from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

import clsx from 'clsx'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
	labelText?: string
	name: string
	index?: string
	placeholder?: string
	register?: UseFormRegister<any>
	error?: FieldErrors<FieldValues>
	type?: string
	className?: string
}

export const Checkbox = ({
	labelText,
	name,
	index,
	placeholder,
	register,
	error,
	className,
	...props
}: CheckboxProps) => {
	const errorText = error?.[name]?.message as string

	return (
		<div className="flex items-center gap-x-2">
			<input
				{...props}
				{...(register?.(name) ?? {})}
				id={props.id}
				type="checkbox"
				className={clsx(
					'p-2 appearance-none rounded text-main focus:outline-none focus:ring-transparent border-[#D3E3F1] text-darkBlue text-base',
					className
				)}
			/>
			<label
				htmlFor={props.id}
				className="block cursor-pointer text-sm font-medium leading-6 text-gray-900">
				{labelText}
			</label>
			{errorText && <p className="text-xs text-red-500 mt-1">{errorText}</p>}
		</div>
	)
}
