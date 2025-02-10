import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { features } from './features'

export const FeatureSection = () => {
	useEffect(() => {
		AOS.init({
			duration: 1200,
			once: true
		})
	}, [])

	return (
		<div className="relative bg-darkBlue py-24 sm:py-32">
			{/* Gradient background with your dark colors */}
			<div className="absolute inset-0 bg-gradient-to-r from-darkBlue to-primary opacity-70 mix-blend-multiply"></div>
			<div className="relative mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-3xl lg:text-center">
					<p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
						Our Features
					</p>
					<p className="mt-6 text-lg leading-8 text-gray-300">
						With continuous monitoring and real-time updates, our platform swiftly identifies
						evolving phishing threats, safeguarding users against malicious attempts to steal
						sensitive information.
					</p>
				</div>
				<div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
					<dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
						{features.map((feature, index) => (
							<div key={index} className="flex flex-col" data-aos="fade-up">
								<dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
									<feature.icon className="h-5 w-5 flex-none text-primaryRed" aria-hidden="true" />
									{feature.name}
								</dt>
								<dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
									<p className="flex-auto">{feature.description}</p>
									<p className="mt-6">
										<Link
											to={`/features#${feature.name.replace(/ /g, '-').toLowerCase()}`}
											className="text-sm font-semibold leading-6 text-primaryRed">
											Learn more <span aria-hidden="true">→</span>
										</Link>
									</p>
								</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
		</div>
	)
}
