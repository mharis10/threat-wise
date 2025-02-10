import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { enqueueSnackbar } from 'notistack'
import * as yup from 'yup'

import { AppLayout } from 'components/app/layout'
import { Input } from 'components/inputs/input'
import { QUERY_KEYS } from 'constants'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import authService from 'services/auth-service'
import { cn } from 'utils/cn'

export const UpdatePassword = () => {
	const navigate = useNavigate()

	const { mutate } = useMutation({
		mutationKey: QUERY_KEYS.UPDATE_PASSWORD,
		mutationFn: (data: { oldPassword: string; newPassword: string }) =>
			authService.updatePassword(data.oldPassword, data.newPassword),
		onSuccess: () => {
			enqueueSnackbar('Password updated Successfully!')
			navigate('/')
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const [isPasswordVisible, setIsPasswordVisible] = useState({
		oldPassword: false,
		newPassword: false
	})

	const schema = yup.object<{ oldPassword: string; newPassword: string }>().shape({
		oldPassword: yup.string().required('Old Password is missing'),
		newPassword: yup.string().required('New Password is missing')
	})

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<{ oldPassword: string; newPassword: string }>({
		resolver: yupResolver(schema as any),
		mode: 'all'
	})

	const onSubmit = (data: { oldPassword: string; newPassword: string }) => {
		mutate({ oldPassword: data.oldPassword, newPassword: data.newPassword })
	}

	return (
		<AppLayout>
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 pt-10 py-16 lg:px-8">
				<div className="lg:border lg:border-gray-300 w-full lg:w-2/5 md:rounded-xl lg:shadow-xl md:p-5 lg:p-10 mx-auto">
					<div className="sm:mx-auto sm:w-full sm:max-w-sm">
						<h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-primary">
							Update your Password
						</h2>
					</div>

					<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							<div>
								<label
									htmlFor="oldPassword"
									className="block text-sm font-medium leading-6 text-black">
									Old Password
								</label>
								<div className="relative z-0 mt-2 flex items-center">
									<Input
										type={isPasswordVisible.oldPassword ? 'text' : 'password'}
										register={register}
										autoCapitalize="false"
										autoCorrect="off"
										autoComplete="old-password"
										name="oldPassword"
										className={cn({ 'border-red-500 focus:border-red-500': errors.oldPassword })}
									/>
									<div
										onClick={() =>
											setIsPasswordVisible(prev => ({ ...prev, oldPassword: !prev.oldPassword }))
										}
										className="cursor-pointer absolute right-4">
										{isPasswordVisible.oldPassword ? (
											<EyeIcon className="w-6 h-6 stroke-primary" />
										) : (
											<EyeSlashIcon className="w-6 h-6 stroke-primary" />
										)}
									</div>
								</div>
								{errors.oldPassword && (
									<p className="mt-1 text-xs text-red-500">{errors.oldPassword.message}</p>
								)}
							</div>

							<div>
								<label
									htmlFor="newPassword"
									className="block text-sm font-medium leading-6 text-black">
									New Password
								</label>
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

							<button
								type="submit"
								className="flex w-full justify-center rounded-md bg-tertiary px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-darkBlue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
								Update Password
							</button>
						</form>
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
