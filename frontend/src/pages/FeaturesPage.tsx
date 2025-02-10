import AOS from 'aos'
import 'aos/dist/aos.css'
import { AppLayout } from 'components/app/layout'
import { useEffect } from 'react'
import { features } from 'sections/features'

const FeaturesPage = () => {
	useEffect(() => {
		AOS.init({
			once: true,
			mirror: false,
			anchorPlacement: 'top-bottom'
		})

		window.scrollTo(0, 0)

		const handleHashNavigation = () => {
			const hash = window.location.hash
			if (hash) {
				setTimeout(() => {
					const id = hash.replace('#', '')
					const element = document.getElementById(id)
					if (element) {
						element.scrollIntoView({ behavior: 'smooth', block: 'start' })
					}
				}, 100)
			}
		}

		setTimeout(handleHashNavigation, 100)

		window.addEventListener('hashchange', handleHashNavigation)

		return () => {
			window.removeEventListener('hashchange', handleHashNavigation)
		}
	}, [])

	return (
		<AppLayout isFooterVisible={true}>
			<style>{`
        .feature-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          overflow: hidden;
          margin-top: 16px;
          margin-bottom: 16px;
        }
        .feature-text {
          width: 50%;
          transform: translateX(-100%);
          transition: transform 0.5s ease-out;
          opacity: 0;
        }
        .feature-text.active {
          transform: translateX(0);
          opacity: 1;
        }
        .feature-image-container {
          width: 50%;
          overflow: hidden;
          perspective: 1000px;
          border-radius: 12px;
        }
        .feature-image {
          width: 100%;
          height: auto;
          transition: transform 0.5s ease-out;
          transform: rotateY(0deg) rotateX(0deg) scale(1);
          border-radius: 12px;
        }
        .feature-image:hover {
          transform: rotateY(5deg) rotateX(5deg) scale(1.05);
        }
      `}</style>
			<div className="bg-darkBlue min-h-screen text-white p-6">
				<div className="max-w-6xl mx-auto">
					{features.map((feature, index) => (
						<div
							key={index}
							id={`${feature.name.replace(/ /g, '-').toLowerCase()}`}
							className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center my-16`}
							data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'}
							data-aos-delay="200"
							data-aos-duration="1000">
							<div className="w-1/2 p-4">
								<h2 className="text-3xl font-bold mb-4">{feature.name}</h2>
								<p className="mb-4">{feature.description}</p>
								<p className="text-gray-400 mb-4">{feature.detailedDescription}</p>
								<ul className="list-disc pl-8 text-gray-400">
									{feature.benefits.map((benefit, bIndex) => (
										<li key={bIndex}>{benefit}</li>
									))}
								</ul>
							</div>
							<div className="w-1/2 p-4 feature-image-container">
								<img src={feature.image} alt={feature.name} className="feature-image" />
							</div>
						</div>
					))}
				</div>
			</div>
		</AppLayout>
	)
}

export default FeaturesPage
