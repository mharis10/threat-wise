import { useRef } from 'react'
import { Link } from 'react-router-dom'

const navigation = [
	{ name: 'Home', href: '/' },
	{ name: 'Features', href: '/features' },
	{ name: 'Pricing', href: '/pricing' },
	{ name: 'Contact', href: '/contact' },
	{ name: 'Blog', href: '/blog' }
]

export const HeroSection = () => {
	const contentRef = useRef<HTMLDivElement>(null)

	const scrollToContent = () => {
		contentRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	return (
		<div className="bg-darkBlue">
			<div className="relative isolate px-6 pt-14 lg:px-8">
				{/* Gradient background elements */}
				<div
					className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
					aria-hidden="true">
					<div
						className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
						style={{
							clipPath:
								'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
						}}
					/>
				</div>
				<div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-56">
					<div className="text-center">
						<h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
							Protect Your Company from Phishing Attacks
						</h1>
						<p className="mt-6 text-lg leading-8 text-white">
							Our phishing protection platform helps companies train their employees to recognize
							and avoid phishing emails, keeping your organization safe from cyber threats.
						</p>
						<div className="mt-10 flex items-center justify-center gap-x-6">
							<Link
								to="#"
								className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
								Get started
							</Link>
						</div>
					</div>
				</div>
				<div className="absolute inset-x-0 bottom-20 flex justify-center">
					{/* Adjusted bottom margin for better visibility */}
					<button onClick={scrollToContent} className="text-white text-3xl animate-bounce">
						˅
					</button>
				</div>
				<div ref={contentRef}></div>
			</div>
		</div>
	)
}
