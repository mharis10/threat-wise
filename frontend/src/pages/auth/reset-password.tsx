import { yupResolver } from '@hookform/resolvers/yup'
import { AppLayout } from 'components/app/layout'
import { Input } from 'components/inputs/input'
import { QUERY_KEYS } from 'constants'
import { enqueueSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import authService from 'services/auth-service'
import * as yup from 'yup'

export const ResetPassword = () => {
	const schema = yup.object<{ email: string }>().shape({
		email: yup.string().required('Email is missing').email('Enter a valid email')
	})

	const { mutate } = useMutation({
		mutationKey: QUERY_KEYS.VALIDATE_EMAIL,
		mutationFn: (email: string) => authService.validateEmail(email),
		onSuccess: () => {
			enqueueSnackbar('Check your email to reset your password!')
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<{ email: string }>({
		resolver: yupResolver(schema as any),
		mode: 'all'
	})

	const onSubmit = (data: { email: string }) => {
		mutate(data.email)
	}

	return (
		<AppLayout>
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 pt-10 py-16 lg:px-8">
				<div className="lg:border lg:border-gray-300 w-full lg:w-2/5 md:rounded-xl lg:shadow-xl md:p-5 lg:p-10 mx-auto">
					<div className="sm:mx-auto sm:w-full sm:max-w-sm">
						<img className="mx-auto h-24 w-auto" src="/images/logo.png" alt="Phishing Defender" />
						<h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-primary">
							Reset your password
						</h2>
					</div>

					<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							<Input
								id="email"
								labelText="Email address"
								register={register}
								errors={errors}
								name="email"
								type="email"
								autoComplete="email"
							/>

							<button
								type="submit"
								className="flex w-full justify-center rounded-md bg-tertiary px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-darkBlue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
								Send Email
							</button>
						</form>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
