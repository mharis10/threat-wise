import { cn } from 'utils/cn'

interface ButtonProps
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
	return (
		<button
			{...props}
			className={cn(
				'bg-primaryRed rounded text-white py-3 px-8 text-base capitalize cursor-pointer',
				className,
				{
					'pointer-events-none cursor-not-allowed text-gray-400': props.disabled
				}
			)}>
			{children}
		</button>
	)
}
