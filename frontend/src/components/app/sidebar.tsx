import { Dialog, Disclosure, Transition } from '@headlessui/react'
import {
  AtSymbolIcon,
  Bars3Icon,
  BuildingOffice2Icon,
  ChartBarIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  UserGroupIcon,
  UsersIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useAppSelector } from 'hooks'
import { Fragment, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

import { cn } from 'utils/cn'

interface SidebarProps {
	children: React.ReactNode
}

export const Sidebar = ({ children }: SidebarProps) => {
	const navigate = useNavigate()
	const location = useLocation()

	const auth = useAppSelector(state => state.auth)
	const [sidebarOpen, setSidebarOpen] = useState(false)

	const navigation = [
		{
			name: auth.user?.role === 'Super Admin' ? 'Users' : 'Employees',
			href: '/admin/users',
			icon: UsersIcon,
			...(auth.user?.role === 'Company Admin' && {
				children: [
					{ name: 'My Employees', href: '/admin/users/list' },
					{ name: 'Groups', href: '/admin/users/groups' }
				]
			})
		},
		...(auth.user?.role === 'Company Admin'
			? [{ name: 'Stats', href: '/admin/stats', icon: ChartBarIcon }]
			: []),
		{
			name: auth.user?.role === 'Super Admin' ? 'Companies' : 'Company',
			href: '/admin/companies',
			icon: BuildingOffice2Icon
		},
		{
			name: 'Email Templates',
			href: '/admin/email-templates',
			icon: AtSymbolIcon,
			children: [
				{ name: 'Create Template', href: '/admin/email-templates/create' },
				{ name: 'My Templates', href: '/admin/email-templates/list' }
			]
		},
		...(auth.user?.role === 'Company Admin'
			? [
					{
						name: 'Email Campaigns',
						href: '/admin/email-campaigns',
						icon: UserGroupIcon,
						children: [
							{ name: 'Create New Campaign', href: '/admin/email-campaigns/create' },
							{ name: 'My Existing Campaigns', href: '/admin/email-campaigns/list' }
						]
					}
				]
			: []),
		...(auth.user?.role === 'Super Admin'
			? [
					{ name: 'Logs', href: '/admin/logs', icon: DocumentDuplicateIcon },
					{ name: 'Error Logs', href: '/admin/error-logs', icon: FolderIcon }
				]
			: [])
	]

	return (
		<div>
			<Transition.Root show={sidebarOpen} as={Fragment}>
				<Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
					<Transition.Child
						as={Fragment}
						enter="transition-opacity ease-linear duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity ease-linear duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						<div className="fixed inset-0 bg-gray-900/80" />
					</Transition.Child>

					<div className="fixed inset-0 flex">
						<Transition.Child
							as={Fragment}
							enter="transition ease-in-out duration-300 transform"
							enterFrom="-translate-x-full"
							enterTo="translate-x-0"
							leave="transition ease-in-out duration-300 transform"
							leaveFrom="translate-x-0"
							leaveTo="-translate-x-full">
							<Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
								<Transition.Child
									as={Fragment}
									enter="ease-in-out duration-300"
									enterFrom="opacity-0"
									enterTo="opacity-100"
									leave="ease-in-out duration-300"
									leaveFrom="opacity-100"
									leaveTo="opacity-0">
									<div className="absolute left-full top-0 flex w-16 justify-center pt-5">
										<button
											type="button"
											className="-m-2.5 p-2.5"
											onClick={() => setSidebarOpen(false)}>
											<span className="sr-only">Close sidebar</span>
											<XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
										</button>
									</div>
								</Transition.Child>
								{/* Sidebar component, swap this element with another sidebar if you like */}
								<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-darkBlue px-6 pb-2">
									<div
										onClick={() => navigate('/')}
										className="cursor-pointer flex h-16 shrink-0 items-center">
										<img
											className="h-16 pt-3 w-auto"
											src="/images/logo.png"
											alt="Phishing Defender"
										/>
									</div>
									<nav className="flex flex-1 flex-col">
										<ul role="list" className="flex flex-1 flex-col gap-y-7">
											<li>
												<ul role="list" className="-mx-2 space-y-1">
													{navigation.map(item =>
														!('children' in item && item.children) ? (
															<li key={item.name}>
																<NavLink
																	to={item.href}
																	className={({ isActive }) =>
																		cn(
																			isActive
																				? 'bg-primaryRed text-white'
																				: 'text-indigo-200 hover:text-white hover:bg-red-500',
																			'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
																		)
																	}>
																	{({ isActive }) => (
																		<>
																			<item.icon
																				className={cn(
																					isActive
																						? 'text-white'
																						: 'text-indigo-200 group-hover:text-white',
																					'h-6 w-6 shrink-0'
																				)}
																				aria-hidden="true"
																			/>
																			{item.name}
																		</>
																	)}
																</NavLink>
															</li>
														) : (
															<Disclosure
																as="div"
																key={item.name}
																className="space-y-1"
																defaultOpen={location.pathname.includes(item.href)}>
																<Disclosure.Button
																	className={({ open }) =>
																		cn(
																			'group flex w-full hover:bg-primaryRed hover:text-white items-center group gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-left focus:outline-none',
																			open ? 'bg-primaryRed text-white' : 'text-indigo-200'
																		)
																	}>
																	{({ open }) => (
																		<div className="flex justify-between w-full items-center">
																			<div className="flex gap-x-1 items-center">
																				<item.icon
																					className={cn(
																						open
																							? 'text-white'
																							: 'text-indigo-200 group-hover:text-white',
																						'h-6 w-6 shrink-0'
																					)}
																					aria-hidden="true"
																				/>
																			</div>
																			<span className="flex-1 ml-3">{item.name}</span>
																			<svg
																				xmlns="http://www.w3.org/2000/svg"
																				width="16"
																				height="16"
																				viewBox="0 0 16 16"
																				fill="none"
																				className={cn(open ? 'rotate-90' : 'rotate-0')}>
																				<path
																					fillRule="evenodd"
																					clipRule="evenodd"
																					d="M5.65967 12.3536C5.44678 12.1583 5.44678 11.8417 5.65967 11.6464L9.25 8.35355C9.4629 8.15829 9.4629 7.84171 9.25 7.64645L5.65968 4.35355C5.44678 4.15829 5.44678 3.84171 5.65968 3.64645C5.87257 3.45118 6.21775 3.45118 6.43065 3.64645L10.021 6.93934C10.6597 7.52513 10.6597 8.47487 10.021 9.06066L6.43065 12.3536C6.21775 12.5488 5.87257 12.5488 5.65967 12.3536Z"
																					fill="white"
																				/>
																			</svg>
																		</div>
																	)}
																</Disclosure.Button>
																<Disclosure.Panel className="space-y-1">
																	{Array.isArray(item.children) &&
																		item.children.map(subItem => (
																			<NavLink
																				key={subItem.name}
																				to={subItem.href}
																				className={({ isActive }) =>
																					cn(
																						'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold py-2 pl-[46px] hover:bg-primaryRed',
																						isActive
																							? 'bg-primaryRed text-white'
																							: 'text-indigo-200'
																					)
																				}>
																				{subItem.name}
																			</NavLink>
																		))}
																</Disclosure.Panel>
															</Disclosure>
														)
													)}
												</ul>
											</li>
										</ul>
									</nav>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition.Root>

			{/* Static sidebar for desktop */}
			<div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
				{/* Sidebar component, swap this element with another sidebar if you like */}
				<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-darkBlue px-6">
					<div
						onClick={() => navigate('/')}
						className="cursor-pointer flex h-16 shrink-0 items-center">
						<img className="h-16 pt-3 w-auto" src="/images/logo.png" alt="Phishing Defender" />
					</div>
					<nav className="flex flex-1 flex-col">
						<ul role="list" className="flex flex-1 flex-col gap-y-7">
							<li>
								<ul role="list" className="-mx-2 space-y-1">
									{navigation.map(item =>
										!('children' in item && item.children) ? (
											<li key={item.name}>
												<NavLink
													to={item.href}
													className={({ isActive }) =>
														cn(
															isActive
																? 'bg-primaryRed text-white'
																: 'text-indigo-200 hover:text-white hover:bg-red-500',
															'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
														)
													}>
													{({ isActive }) => (
														<>
															<item.icon
																className={cn(
																	isActive
																		? 'text-white'
																		: 'text-indigo-200 group-hover:text-white',
																	'h-6 w-6 shrink-0'
																)}
																aria-hidden="true"
															/>
															{item.name}
														</>
													)}
												</NavLink>
											</li>
										) : (
											<Disclosure
												as="div"
												key={item.name}
												className="space-y-1"
												defaultOpen={location.pathname.includes(item.href)}>
												<Disclosure.Button
													className={({ open }) =>
														cn(
															'group flex w-full hover:bg-primaryRed hover:text-white items-center group gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-left focus:outline-none',
															open ? 'bg-primaryRed text-white' : 'text-indigo-200'
														)
													}>
													{({ open }) => (
														<div className="flex justify-between w-full items-center">
															<div className="flex gap-x-1 items-center">
																<item.icon
																	className={cn(
																		open ? 'text-white' : 'text-indigo-200 group-hover:text-white',
																		'h-6 w-6 shrink-0'
																	)}
																	aria-hidden="true"
																/>
															</div>
															<span className="flex-1 ml-3">{item.name}</span>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="16"
																height="16"
																viewBox="0 0 16 16"
																fill="none"
																className={cn(open ? 'rotate-90' : 'rotate-0')}>
																<path
																	fillRule="evenodd"
																	clipRule="evenodd"
																	d="M5.65967 12.3536C5.44678 12.1583 5.44678 11.8417 5.65967 11.6464L9.25 8.35355C9.4629 8.15829 9.4629 7.84171 9.25 7.64645L5.65968 4.35355C5.44678 4.15829 5.44678 3.84171 5.65968 3.64645C5.87257 3.45118 6.21775 3.45118 6.43065 3.64645L10.021 6.93934C10.6597 7.52513 10.6597 8.47487 10.021 9.06066L6.43065 12.3536C6.21775 12.5488 5.87257 12.5488 5.65967 12.3536Z"
																	fill="white"
																/>
															</svg>
														</div>
													)}
												</Disclosure.Button>
												<Disclosure.Panel className="space-y-1">
													{Array.isArray(item.children) &&
														item.children.map(subItem => (
															<NavLink
																key={subItem.name}
																to={subItem.href}
																className={({ isActive }) =>
																	cn(
																		'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold py-2 pl-[46px] hover:bg-primaryRed',
																		isActive ? 'bg-primaryRed text-white' : 'text-indigo-200'
																	)
																}>
																{subItem.name}
															</NavLink>
														))}
												</Disclosure.Panel>
											</Disclosure>
										)
									)}
								</ul>
							</li>

							<li className="-mx-6 mt-auto">
								<Link
									to="#"
									className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-red-500">
									<img
										className="h-16 pt-3 w-auto"
										src="/images/logo.png"
										alt="Phishing Defender"
									/>
									<span className="sr-only">Your profile</span>
									<span aria-hidden="true">Phishing Defender</span>
								</Link>
							</li>
						</ul>
					</nav>
				</div>
			</div>

			<div className="sticky top-0 z-40 flex items-center gap-x-6 bg-darkBlue px-4 py-4 shadow-sm sm:px-6 lg:hidden">
				<button
					type="button"
					className="-m-2.5 p-2.5 text-indigo-200 lg:hidden"
					onClick={() => setSidebarOpen(true)}>
					<span className="sr-only">Open sidebar</span>
					<Bars3Icon className="h-6 w-6" aria-hidden="true" />
				</button>
				<div className="flex-1 text-sm font-semibold leading-6 text-white">
					{navigation.find(nav => nav.href === location.pathname)?.name}
				</div>
				<a href="#">
					<span className="sr-only">Your profile</span>
					<img className="h-16 pt-3 w-auto" src="/images/logo.png" alt="Phishing Defender" />
				</a>
			</div>

			<main className="py-10 lg:pl-72">
				<div className="px-4 sm:px-6 lg:px-8">{children}</div>
			</main>
		</div>
	)
}
