// File: src/sections/features.ts
import {
  ArrowTrendingUpIcon,
  BoltIcon,
  BookOpenIcon,
  BugAntIcon,
  CheckBadgeIcon,
  UserGroupIcon
} from '@heroicons/react/20/solid'

export const features = [
	{
		name: 'Employee Training',
		description: 'Comprehensive training materials to help employees recognize phishing attempts.',
		detailedDescription:
			'Interactive training modules simulate real-world phishing scenarios, providing hands-on experience in identifying and responding to threats.',
		benefits: [
			'Increases employee confidence in identifying phishing emails.',
			'Reduces the risk of successful phishing attacks.',
			'Promotes a culture of continuous learning and vigilance.'
		],
		image: '/images/employee-training.png',
		icon: UserGroupIcon
	},
	{
		name: 'Advanced Threat Detection',
		description: 'Real-time monitoring and advanced analytics to detect threats as they occur.',
		detailedDescription:
			'Our system scans for unusual patterns and potential threats, using machine learning to preemptively block attacks before they happen.',
		benefits: [
			'Immediate detection of security threats.',
			'Enhanced reaction times to potential breaches.',
			'Cutting-edge technology keeps you ahead of threats.'
		],
		image: '/images/threat-detection.png',
		icon: BoltIcon
	},
	{
		name: 'Secure Access',
		description: 'Ensure that only authorized personnel can access sensitive systems and data.',
		detailedDescription:
			'Deploy multi-factor authentication and continuous monitoring to ensure that all access is legitimate and secure.',
		benefits: [
			'Strengthens security protocols around sensitive systems.',
			'Prevents unauthorized access through stolen credentials.',
			'Provides audit trails for regular security audits.'
		],
		image: '/images/secure-access.png',
		icon: CheckBadgeIcon
	},
	{
		name: 'Compliance Tracking',
		description: 'Automated tools to help you maintain compliance with industry regulations.',
		detailedDescription:
			'Keep track of all regulatory requirements and ensure your operations remain in compliance with automated monitoring and reporting tools.',
		benefits: [
			'Reduces the risk of non-compliance penalties.',
			'Simplifies the management of compliance data.',
			'Ensures transparency and accountability in operations.'
		],
		image: '/images/compliance-tracking.png',
		icon: BookOpenIcon
	},
	{
		name: 'Incident Response',
		description: 'Rapid response capabilities to mitigate the impact of security breaches.',
		detailedDescription:
			'Our team of experts is ready to respond to security incidents, minimizing downtime and mitigating any potential damage from security breaches.',
		benefits: [
			'Minimizes the impact of breaches with quick response.',
			'Reduces downtime and operational disruption.',
			'Improves resilience against future security threats.'
		],
		image: '/images/incident-response.png',
		icon: BugAntIcon
	},
	{
		name: 'Data Protection',
		description: 'Robust mechanisms to protect critical business data from cyber threats.',
		detailedDescription:
			'Implement advanced encryption, data loss prevention, and secure backup solutions to safeguard your most valuable data assets.',
		benefits: [
			'Ensures the integrity and confidentiality of critical data.',
			'Prevents data breaches and loss of data.',
			'Supports business continuity by securing data backups.'
		],
		image: '/images/data-protection.png',
		icon: ArrowTrendingUpIcon
	}
]

export default features
