import { AppLayout } from 'components/app/layout'
import { FeatureSection } from 'sections/feature-section'
import { HeroSection } from 'sections/hero-section'
import { StatsSection } from 'sections/stats-section'

export const Home = () => {
	return (
		<AppLayout className="bg-transparent absolute inset-x-0 z-50" isFooterVisible>
			<HeroSection />
			<StatsSection />
			<FeatureSection />
		</AppLayout>
	)
}
