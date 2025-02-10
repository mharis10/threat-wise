import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { enqueueSnackbar } from 'notistack'
import * as yup from 'yup'

import { AppLayout } from 'components/app/layout'
import { Input } from 'components/inputs/input'
import { QUERY_KEYS } from 'constants'
import { useAppDispatch } from 'hooks'
import { useMutation } from 'react-query'
import { Link, useNavigate } from 'react-router-dom'
import authService from 'services/auth-service'
import { login } from 'slices/auth'
import { cn } from 'utils/cn'

export const Login = () => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	const { mutate } = useMutation({
		mutationKey: QUERY_KEYS.LOGIN,
		mutationFn: (data: { email: string; password: string }) =>
			authService.login(data.email, data.password),
		onSuccess: res => {
			dispatch(
				login({ user: res.user, accessToken: res.accessToken, refreshToken: res.refreshToken })
			)
			enqueueSnackbar('Login Successful!')
			navigate('/')
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const [isPasswordVisible, setIsPasswordVisible] = useState(false)

	const schema = yup.object<{ email: string; password: string }>().shape({
		email: yup.string().required('Email is missing').email('Enter a valid email'),
		password: yup.string().required('Password is missing')
	})

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<{ email: string; password: string }>({
		resolver: yupResolver(schema as any),
		mode: 'all'
	})

	const onSubmit = (data: { email: string; password: string }) => {
		mutate({ email: data.email, password: data.password })
	}

	return (
		<AppLayout>
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 pt-10 py-16 lg:px-8">
				<div className="lg:border lg:border-gray-300 w-full lg:w-2/5 md:rounded-xl lg:shadow-xl md:p-5 lg:p-10 mx-auto">
					<div className="sm:mx-auto sm:w-full sm:max-w-sm">
						<img className="mx-auto h-24 w-auto" src="/images/logo.png" alt="Phishing Defender" />
						<h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-primary">
							Sign in to your account
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

							<div>
								<div className="flex items-center justify-between">
									<label
										htmlFor="password"
										className="block text-sm font-medium leading-6 text-black">
										Password
									</label>
									<div className="text-sm">
										<Link
											to="/reset-password"
											className="font-semibold text-tertiary hover:text-darkBlue">
											Forgot password?
										</Link>
									</div>
								</div>
								<div className="relative z-0 mt-2 flex items-center">
									<Input
										type={isPasswordVisible ? 'text' : 'password'}
										register={register}
										autoCapitalize="false"
										autoCorrect="off"
										autoComplete="new-password"
										name="password"
										className={cn({ 'border-red-500 focus:border-red-500': errors.password })}
									/>
									<div
										onClick={() => setIsPasswordVisible(!isPasswordVisible)}
										className="cursor-pointer absolute right-4">
										{isPasswordVisible ? (
											<EyeIcon className="w-6 h-6 stroke-primary" />
										) : (
											<EyeSlashIcon className="w-6 h-6 stroke-primary" />
										)}
									</div>
								</div>
								{errors.password && (
									<p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
								)}
							</div>

							<button
								type="submit"
								className="flex w-full justify-center rounded-md bg-tertiary px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-darkBlue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
								Sign in
							</button>
						</form>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
