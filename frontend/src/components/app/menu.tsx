import { Menu, MenuItem, MenuItems, Transition } from '@headlessui/react'
import {
  ArrowLeftStartOnRectangleIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { useAppSelector } from 'hooks'
import { useNavigate } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'
import authService from 'services/auth-service'
import { cn } from 'utils/cn'

export const ProfileMenu = () => {
	const navigate = useNavigate()

	const auth = useAppSelector(state => state.auth)

	return (
		<Menu as="div" className="relative z-10">
			<Menu.Button className="relative flex items-center gap-x-2">
				<div className="rounded-full h-10 w-10 flex items-center justify-center text-sm font-domine bg-[#D3E3F1]">
					<p
						style={{
							color: 'radial-gradient(235.66% 76.09% at 3.32% 56.06%, #070027 54.79%, #022161 100%)'
						}}
						className="text-lg">
						{(auth.user as User).firstName.slice(0, 1) + (auth.user as User).lastName.slice(0, 1)}
					</p>
				</div>

				<div className="flex flex-col gap-y-1 max-md:hidden">
					<h3 className="text-white font-sm font-semibold">
						{auth.user?.firstName + ' ' + auth.user?.lastName}
					</h3>
				</div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					className="max-md:hidden"
					fill="none">
					<path d="M15.8078 10.6875H8.19238L12.0001 14.4952L15.8078 10.6875Z" fill="white" />
				</svg>
			</Menu.Button>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-200"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95">
				<MenuItems className="absolute z-50 right-0 mt-2 w-fit origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<MenuItem>
						<span className="bg-white text-tertiary items-center px-2 py-1 text-xs flex gap-x-2.5">
							<EnvelopeIcon className="h-3.5 w-3.5 shrink-0" />
							{auth.user?.email}
						</span>
					</MenuItem>
					<MenuItem>
						<span className="bg-white text-tertiary items-center px-2 pt-1 pb-2 text-xs flex gap-x-2.5">
							<PhoneIcon className="h-3.5 w-3.5 shrink-0" />
							{auth.user?.phoneNumber}
						</span>
					</MenuItem>
					{auth.user?.role !== 'Company Employee' && (
						<MenuItem>
							{({ active }) => (
								<span
									onClick={() => navigate('/admin/users/list')}
									className={cn(
										active ? 'bg-primary text-white' : 'bg-white text-tertiary',
										'cursor-pointer px-2 py-2 border-t border-border items-center text-sm flex gap-x-2.5 whitespace-nowrap'
									)}>
									<UserGroupIcon className="h-4 w-4 shrink-0" />
									Admin Panel
								</span>
							)}
						</MenuItem>
					)}
					<MenuItem>
						{({ active }) => (
							<span
								onClick={() => navigate('/update-password')}
								className={cn(
									active ? 'bg-primary text-white' : 'bg-white text-tertiary',
									'cursor-pointer px-2 py-2 border-t border-border items-center text-sm flex gap-x-2.5 whitespace-nowrap'
								)}>
								<Cog6ToothIcon className="h-4 w-4 shrink-0" />
								Settings
							</span>
						)}
					</MenuItem>
					<MenuItem>
						{({ active }) => (
							<span
								onClick={() => authService.logout()}
								className={cn(
									active ? 'bg-primary text-white' : 'bg-white text-tertiary',
									'cursor-pointer px-2 py-2 border-t border-border items-center text-sm flex gap-x-2.5 whitespace-nowrap'
								)}>
								<ArrowLeftStartOnRectangleIcon className="h-4 w-4 shrink-0" />
								Logout
							</span>
						)}
					</MenuItem>
				</MenuItems>
			</Transition>
		</Menu>
	)
}
