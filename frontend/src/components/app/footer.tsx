import { Link } from 'react-router-dom'

const navigation = [
	{ name: 'Home', href: '/' },
	{ name: 'Features', href: '/features' },
	{ name: 'Pricing', href: '/pricing' },
	{ name: 'Contact', href: '/contact-us' },
	{ name: 'Blog', href: '/blog' }
]

export const AppFooter = () => {
	return (
		<footer className="bg-white">
			<div className="mx-auto overflow-hidden pt-6 px-6 lg:px-8">
				<nav
					className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
					aria-label="Footer">
					{navigation.map(item => (
						<div key={item.name} className="pb-6">
							<Link to={item.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
								{item.name}
							</Link>
						</div>
					))}
				</nav>
				<p className="mt-4 py-4 text-center text-xs leading-5 text-gray-500">
					&copy; {new Date().getFullYear()} PhishDefender, Inc. All rights reserved.
				</p>
			</div>
		</footer>
	)
}
