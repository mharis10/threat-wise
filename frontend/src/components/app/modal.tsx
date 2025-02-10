import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Fragment, useState } from 'react'

import useIsMobile from 'hooks/useIsMobile'
import { cn } from 'utils/cn'

interface ModalProps {
	onClose?: () => void
	title?: string
	className?: string
	children?: React.ReactNode
	showCrossIcon?: boolean
	closeOnOutsideClick?: boolean
	width?: string
	isFullHeight?: boolean
	noPadding?: boolean
	crossIconPosition?: string
}

export const Modal: React.FC<ModalProps> = ({
	children,
	showCrossIcon = false,
	title,
	width,
	closeOnOutsideClick = false,
	onClose,
	noPadding = false,
	crossIconPosition,
	isFullHeight = false
}) => {
	const isMobile = useIsMobile()

	const [isOpen, setIsOpen] = useState(true)

	return (
		<Transition.Root show={true} as={Fragment}>
			<Dialog
				open={isOpen}
				as="div"
				className="relative z-50"
				onClose={() =>
					closeOnOutsideClick ? (
						<>
							{onClose?.()}
							{setIsOpen(false)}
						</>
					) : (
						onClose?.()
					)
				}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0">
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>
				<div className="fixed inset-0 z-50 overflow-y-auto">
					<div className="flex max-md:min-h-[70%] min-h-full items-end justify-center text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
							<Dialog.Panel
								className={cn(
									'relative transform overflow-y-auto rounded-none md:rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:item-center',
									{ 'px-4 pt-5 pb-4 sm:p-6': !noPadding },
									width ? width : 'md:w-[600px] w-full',
									isFullHeight ? 'max-md:min-h-screen' : 'max-h-[100vh]'
								)}>
								<div
									className={cn(
										'absolute sm:flex-auto flex justify-between',
										crossIconPosition
											? crossIconPosition
											: isMobile
												? 'top-32 right-4'
												: 'top-3 right-4'
									)}>
									<h1 className=" font-semibold leading-6 text-gray-900 text-2xl ml-2">{title}</h1>
									{showCrossIcon && (
										<div className="z-20" onClick={onClose}>
											<XMarkIcon className="text-tertiary bg-white h-6 w-6 cursor-pointer" />
										</div>
									)}
								</div>
								{children}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}
