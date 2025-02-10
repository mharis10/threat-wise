import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { yupResolver } from '@hookform/resolvers/yup'
import { AppLayout } from 'components/app/layout'
import { QUERY_KEYS } from 'constants'
import { enqueueSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import emailService from 'services/email-service'
import * as yup from 'yup'

export type PricingForm = {
	name: string
	email: string
	company: string
	message: string
}

const schema = yup.object<PricingForm>().shape({
	name: yup.string().required('Name is required'),
	email: yup.string().required('Email is required').email('Invalid email format'),
	company: yup.string().required('Company name is required'),
	message: yup.string()
})

export const Pricing = () => {
	const { mutate: mutateEmail, isLoading: emailLoading } = useMutation({
		mutationKey: QUERY_KEYS.REQUEST_DEMO,
		mutationFn: (data: PricingForm) => emailService.requestDemo(data),
		onSuccess: () => {
			enqueueSnackbar('Email sent successfully')
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<PricingForm>({
		resolver: yupResolver(schema as any)
	})

	const onSubmit = (data: any) => {
		mutateEmail(data)
	}

	return (
		<AppLayout>
			<div className="bg-darkBlue py-8 sm:py-12">
				<div className="mx-auto max-w-7xl px-4 lg:px-6">
					<div className="mx-auto max-w-3xl lg:text-center">
						<p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
							Request a Demo for Pricing
						</p>
						<p className="mt-2 text-base leading-6 text-gray-300 sm:text-lg">
							Fill out the form below to learn more about our pricing and request a demo tailored to
							your organization's needs.
						</p>
					</div>
					<div className="mx-auto mt-6 max-w-2xl sm:mt-8 lg:mt-10">
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
							<input
								type="text"
								placeholder="Name"
								{...register('name')}
								className={`w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} p-2`}
							/>
							{errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

							<input
								type="email"
								placeholder="Email"
								{...register('email')}
								className={`w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-2`}
							/>
							{errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

							<input
								type="text"
								placeholder="Company"
								{...register('company')}
								className={`w-full rounded-md border ${errors.company ? 'border-red-500' : 'border-gray-300'} p-2`}
							/>
							{errors.company && <p className="text-red-500 text-sm">{errors.company.message}</p>}

							<textarea
								placeholder="Message (Optional)"
								{...register('message')}
								className="w-full rounded-md border border-gray-300 p-2"
								rows={4}
							/>
							{errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}

							<button
								type="submit"
								disabled={emailLoading}
								className="w-full flex items-center justify-center rounded-md bg-green-500 px-3 py-2 text-sm text-white hover:bg-green-700 transition duration-150 ease-in-out">
								<CheckCircleIcon className="h-4 w-4 mr-2 text-white" aria-hidden="true" />
								Submit Request
							</button>
						</form>
						<div className="mt-6 text-center">
							<p className="text-md text-white sm:text-lg">Interested in trying before buying?</p>
							<p className="mt-2 text-sm leading-6 text-gray-300 sm:text-md">
								Contact us to start your <span className="font-bold">14-day free trial</span> with
								no credit card required. Experience all our features and see how we can meet your
								organization's needs.
							</p>
						</div>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
