import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { enqueueSnackbar } from 'notistack'
import * as yup from 'yup'

import { AppLayout } from 'components/app/layout'
import { Input } from 'components/inputs/input'
import { QUERY_KEYS } from 'constants'
import { useMutation } from 'react-query'
import emailService from 'services/email-service'
import { cn } from 'utils/cn'

export type ContactUsForm = {
	firstName: string
	lastName: string
	email: string
	message: string
}

export const ContactUs = () => {
	const schema = yup.object<ContactUsForm>().shape({
		firstName: yup.string().required('First name is missing'),
		lastName: yup.string().required('Last name is missing'),
		email: yup.string().required('Email is missing').email('Enter a valid email'),
		message: yup.string().required('Message is missing')
	})

	const { mutate: mutateEmail, isLoading: emailLoading } = useMutation({
		mutationKey: QUERY_KEYS.CONTACT_US,
		mutationFn: (data: ContactUsForm) => emailService.contactUs(data),
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
		reset,
		formState: { errors }
	} = useForm<ContactUsForm>({
		resolver: yupResolver(schema as any),
		mode: 'onSubmit'
	})

	const onSubmit = (data: ContactUsForm) => {
		mutateEmail(data)
	}

	return (
		<AppLayout>
			<div className="isolate bg-pr px-6 py-12 sm:py-10 lg:px-8">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
						Contact Us
					</h2>
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-8 max-w-xl sm:mt-12">
					<div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
						<Input
							type="text"
							labelText="First Name"
							register={register}
							errors={errors}
							name="firstName"
							id="first-name"
							autoComplete="given-name"
						/>

						<Input
							type="text"
							labelText="Last Name"
							register={register}
							errors={errors}
							name="lastName"
							id="last-name"
							autoComplete="family-name"
						/>
						<div className="sm:col-span-2">
							<Input
								id="email"
								labelText="Email address"
								register={register}
								errors={errors}
								name="email"
								type="email"
								autoComplete="email"
							/>
						</div>

						<div className="sm:col-span-2">
							<label
								htmlFor="message"
								className="block text-sm font-semibold leading-6 text-gray-900">
								Message
							</label>
							<div className="mt-2.5">
								<textarea
									id="message"
									{...register('message')}
									rows={4}
									className={cn(
										'w-full rounded font-normal py-2 pl-4 bg-transparent focus:ring-0 border disabled:text-gray-500 focus:border-secondary focus-visible:outline-none border-[#D3E3F1] text-primary placeholder-[#7F9AB2] placeholder:text-sm focus:outline-none text-sm',
										{ 'border-red-500 focus:border-red-500': errors.message }
									)}
								/>
							</div>
							{errors.message && (
								<p className="mt-1 text-red-500 text-xs">{errors.message.message}</p>
							)}
						</div>
					</div>
					<div className="mt-10">
						<button
							type="submit"
							disabled={emailLoading}
							className="block w-full rounded-md bg-tertiary px-3.5 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-darkBlue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
							Send Message
						</button>
					</div>
				</form>
			</div>
		</AppLayout>
	)
}
