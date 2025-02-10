import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { yupResolver } from '@hookform/resolvers/yup'
import { enqueueSnackbar } from 'notistack'

import { AppLayout } from 'components/app/layout'
import { Input } from 'components/inputs/input'
import { QUERY_KEYS } from 'constants'
import authService from 'services/auth-service'
import { cn } from 'utils/cn'

import * as yup from 'yup'

export const Settings = () => {
	const navigate = useNavigate()
	const [searchParams, setSearchParams] = useSearchParams()

	const [isPasswordVisible, setIsPasswordVisible] = useState({
		newPassword: false,
		confirmPassword: false
	})

	const { mutate } = useMutation({
		mutationKey: QUERY_KEYS.SETTINGS,
		mutationFn: (password: string) =>
			authService.setupPassword(password, searchParams.get('token') as string),
		onSuccess: () => {
			enqueueSnackbar('Password Setup Successful!')
			navigate('/')
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const { mutate: resetPassword } = useMutation({
		mutationKey: QUERY_KEYS.RESET_PASSWORD,
		mutationFn: (password: string) =>
			authService.resetPassword(password, searchParams.get('token') as string),
		onSuccess: () => {
			enqueueSnackbar('Password Reset Successful!')
			navigate('/')
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const schema = yup.object<{ newPassword: string; confirmPassword: string }>().shape({
		newPassword: yup.string().required('Password is missing'),
		confirmPassword: yup
			.string()
			.required('Confirm Password is missing')
			.oneOf([yup.ref('newPassword'), ''], 'Passwords should match')
	})

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<{ newPassword: string; confirmPassword: string }>({
		resolver: yupResolver(schema as any),
		mode: 'all'
	})

	const onSubmit = (data: { newPassword: string; confirmPassword: string }) => {
		if (!searchParams.get('token')) {
			return enqueueSnackbar('You are unauthorized to perform this operation', { variant: 'error' })
		}
		if (searchParams.get('type') === 'reset') {
			return resetPassword(data.newPassword)
		}
		mutate(data.newPassword)
	}

	return (
		<AppLayout>
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 pt-10 py-16 lg:px-8">
				<div className="lg:border lg:border-gray-300 w-full lg:w-2/5 md:rounded-xl lg:shadow-xl md:p-5 lg:p-10 mx-auto">
					<div className="sm:mx-auto sm:w-full sm:max-w-sm">
						<img className="mx-auto h-24 w-auto" src="/images/logo.png" alt="Phishing Defender" />
						<h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-primary">
							{searchParams.get('type') === 'reset' ? 'Reset your password' : 'Setup your password'}
						</h2>
					</div>

					<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							<div>
								<div className="flex items-center justify-between">
									<label
										htmlFor="password"
										className="block text-sm font-medium leading-6 text-black">
										New Password
									</label>
								</div>
								<div className="relative z-0 mt-2 flex items-center">
									<Input
										type={isPasswordVisible.newPassword ? 'text' : 'password'}
										register={register}
										autoCapitalize="false"
										autoCorrect="off"
										autoComplete="new-password"
										name="newPassword"
										className={cn({ 'border-red-500 focus:border-red-500': errors.newPassword })}
									/>
									<div
										onClick={() =>
											setIsPasswordVisible(prev => ({ ...prev, newPassword: !prev.newPassword }))
										}
										className="cursor-pointer absolute right-4">
										{isPasswordVisible.newPassword ? (
											<EyeIcon className="w-6 h-6 stroke-primary" />
										) : (
											<EyeSlashIcon className="w-6 h-6 stroke-primary" />
										)}
									</div>
								</div>
								{errors.newPassword && (
									<p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>
								)}
							</div>

							<div>
								<div className="flex items-center justify-between">
									<label
										htmlFor="password"
										className="block text-sm font-medium leading-6 text-black">
										Confirm Password
									</label>
								</div>
								<div className="relative z-0 mt-2 flex items-center">
									<Input
										type={isPasswordVisible.confirmPassword ? 'text' : 'password'}
										register={register}
										autoCapitalize="false"
										autoCorrect="off"
										autoComplete="new-password"
										name="confirmPassword"
										className={cn({
											'border-red-500 focus:border-red-500': errors.confirmPassword
										})}
									/>
									<div
										onClick={() =>
											setIsPasswordVisible(prev => ({
												...prev,
												confirmPassword: !prev.confirmPassword
											}))
										}
										className="cursor-pointer absolute right-4">
										{isPasswordVisible.confirmPassword ? (
											<EyeIcon className="w-6 h-6 stroke-primary" />
										) : (
											<EyeSlashIcon className="w-6 h-6 stroke-primary" />
										)}
									</div>
								</div>
								{errors.confirmPassword && (
									<p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
								)}
							</div>

							<button
								type="submit"
								className="flex w-full justify-center rounded-md bg-tertiary px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-darkBlue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
								{searchParams.get('type') === 'reset' ? 'Reset Password' : 'Setup Password'}
							</button>
						</form>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
