const stats = [
	{ id: 1, name: 'OF DATA BREACHES ARE CAUSED BY PHISHING ATTACKS', value: '90%' },
	{ id: 2, name: 'GLOBAL AVERAGE COST OF A DATA BREACH', value: '$4.35M' },
	{ id: 3, name: 'OF ORGANIZATIONS HAVE EXPERIENCED A SUCCESSFUL PHISHING ATTACK', value: '74%' }
]

export const StatsSection = () => {
	return (
		<div className="bg-white py-24 sm:py-32">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-2xl lg:max-w-none" data-aos="fade-up">
					<div className="text-center">
						<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
							The Dangers of Phishing
						</h2>
						<p className="mt-4 text-lg leading-8 text-gray-600">
							Phishing attacks can cause severe damage to organizations, resulting in financial
							loss, data breaches, and damaged reputation. By training your employees to recognize
							phishing emails, you can significantly reduce the risk of falling victim to these
							attacks.
						</p>
					</div>
					<dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-3">
						{stats.map(stat => (
							<div key={stat.id} className="flex flex-col bg-primaryRed p-8" data-aos="fade-up">
								<dt className="text-sm font-semibold leading-6 text-white">{stat.name}</dt>
								<dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
									{stat.value}
								</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
		</div>
	)
}
