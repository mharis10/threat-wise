import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { Link, useLocation } from 'react-router-dom'
import { TypeAnimation } from 'react-type-animation'

import { QUERY_KEYS } from 'constants'
import { useAppSelector } from 'hooks'
import authService from 'services/auth-service'
import { cn } from 'utils/cn'
import { ProfileMenu } from './menu'

const navigation = [
	{ name: 'Home', href: '/' },
	{ name: 'Features', href: '/features' },
	{ name: 'Pricing', href: '/pricing' },
	{ name: 'Contact', href: '/contact-us' },
	{ name: 'Blog', href: '/blog' }
]

interface AppHeaderProps {
	className?: string
}

export const AppHeader = ({ className }: AppHeaderProps) => {
	const location = useLocation()
	const auth = useAppSelector(state => state.auth)

	const { mutate } = useMutation({
		mutationKey: QUERY_KEYS.LOGOUT,
		mutationFn: () => authService.logout(),
		onSuccess: () => window.location.reload()
	})

	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	return (
		<header className={cn('w-full bg-darkBlue', className)}>
			<nav className="flex items-center justify-between py-4 px-6 lg:px-8" aria-label="Global">
				<div className="flex gap-x-4 lg:gap-x-6 lg:flex-1 items-center">
					<Link to="/">
						<span className="sr-only">Phishing Defender</span>
						<img className="h-16 w-auto shrink-0" src="/images/logo.png" alt="logo" />
					</Link>
					<TypeAnimation
						sequence={['PhishDefender']}
						className="text-white font-bold text-xl sm:text-3xl"
					/>
				</div>
				<div className="flex lg:hidden">
					<button
						type="button"
						className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
						onClick={() => setMobileMenuOpen(true)}>
						<span className="sr-only">Open main menu</span>
						<Bars3Icon className="h-6 w-6" aria-hidden="true" />
					</button>
				</div>
				<div className="hidden lg:flex gap-x-20 items-center">
					<div className="hidden lg:flex lg:gap-x-12">
						{navigation.map(item => (
							<Link
								key={item.name}
								to={item.href}
								className="text-lg font-semibold leading-6 text-white">
								{item.name}
							</Link>
						))}
					</div>
					{!auth.accessToken ? (
						<>
							{!location.pathname.includes('/login') && (
								<div className="hidden lg:flex lg:flex-1 lg:justify-end">
									<Link to="/login" className="text-lg font-semibold leading-6 text-primaryRed">
										Log in <span aria-hidden="true">&rarr;</span>
									</Link>
								</div>
							)}
						</>
					) : (
						<div className="hidden cursor-pointer lg:flex lg:flex-1 lg:justify-end">
							<ProfileMenu />
						</div>
					)}
				</div>
			</nav>
			<Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
				<div className="fixed inset-0 z-50" />
				<Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
					<div className="flex items-center justify-between">
						<a href="#" className="-m-1.5 p-1.5">
							<span className="sr-only">Your Company</span>
							<img className="h-20 w-auto" src="/images/logo.png" alt="logo" />
						</a>
						<button
							type="button"
							className="-m-2.5 rounded-md p-2.5 text-gray-700"
							onClick={() => setMobileMenuOpen(false)}>
							<span className="sr-only">Close menu</span>
							<XMarkIcon className="h-6 w-6" aria-hidden="true" />
						</button>
					</div>
					<div className="mt-6 flow-root">
						<div className="-my-6 divide-y divide-gray-500/10">
							<div className="space-y-2 py-6">
								{navigation.map(item => (
									<a
										key={item.name}
										href={item.href}
										className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
										{item.name}
									</a>
								))}
							</div>
							{!auth.accessToken ? (
								<>
									{!location.pathname.includes('/login') && (
										<div className="py-6">
											<Link
												to="/login"
												className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
												Log in
											</Link>
										</div>
									)}
								</>
							) : (
								<div className="py-6">
									<ProfileMenu />
								</div>
							)}
						</div>
					</div>
				</Dialog.Panel>
			</Dialog>
		</header>
	)
}
