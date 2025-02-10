import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'

import { yupResolver } from '@hookform/resolvers/yup'
import { enqueueSnackbar } from 'notistack'
import * as yup from 'yup'

import { Input } from 'components/inputs/input'
import { Select } from 'components/inputs/select'
import { QUERY_KEYS } from 'constants'
import { useState } from 'react'
import emailTemplateService from 'services/email-template-service'
import { cn } from 'utils/cn'

export type HelperForm = {
	impersonate: string
	callToAction: string
	consequences: string
	urgency: string
	additionalContent: string
}

interface HelperFormProps {
	onResult: (result: string) => void
}

export const HelperForm = ({ onResult }: HelperFormProps) => {
	const [isSubmitting, setIsSubmitting] = useState(false)

	const schema = yup.object<HelperForm>().shape({
		impersonate: yup.string().required('Please answer this'),
		callToAction: yup.string().required('Please answer this'),
		consequences: yup.string().required('Please answer this'),
		urgency: yup.string().required('Please answer this'),
		additionalContent: yup.string()
	})

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<HelperForm>({
		resolver: yupResolver(schema as any),
		mode: 'all'
	})

	const { mutate: getTemplateHelp, isLoading } = useMutation({
		mutationKey: QUERY_KEYS.TEMPLATE_HELP,
		mutationFn: (query: HelperForm) => emailTemplateService.getTemplateHelp(query),
		onSuccess: data => {
			onResult(data.response)
			setIsSubmitting(false)
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
			setIsSubmitting(false)
		}
	})

	const onSubmit = (data: HelperForm) => {
		setIsSubmitting(true)
		getTemplateHelp(data)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="px-4 py-6 sm:px-6 lg:px-8 mt-2">
			<div className="space-y-4 sm:space-y-6">
				<div>
					<div className="space-y-8 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:pb-0">
						<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pb-6">
							<label
								htmlFor="impersonate"
								className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
								Who do you want to impersonate? e.g HR, IT support etc.
							</label>
							<div className="mt-2 sm:col-span-2 sm:mt-0">
								<Input
									register={register}
									errors={errors}
									type="text"
									name="impersonate"
									id="impersonate"
									autoComplete="impersonate"
									className="block flex-1 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>

						<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
							<label
								htmlFor="about"
								className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
								Any specific calls to action? e.g click here to update password
							</label>
							<div className="mt-2 sm:col-span-2 sm:mt-0">
								<Input
									type="text"
									name="callToAction"
									errors={errors}
									register={register}
									id="callToAction"
									autoComplete="callToAction"
									className="block flex-1 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>

						<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
							<label
								htmlFor="about"
								className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
								Any specific consequences? e.g account will be locked
							</label>
							<div className="mt-2 sm:col-span-2 sm:mt-0">
								<Input
									type="text"
									name="consequences"
									register={register}
									errors={errors}
									id="consequences"
									autoComplete="consequences"
									className="block flex-1 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>

						<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
							<label
								htmlFor="urgency"
								className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
								Level of urgency?
							</label>
							<div className="mt-2 sm:col-span-2 sm:mt-0">
								<Select
									id="urgency"
									name="urgency"
									register={register}
									errors={errors}
									className="block w-full max-w-2xl rounded-md py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
									defaultValue={''}>
									<option value="low">Low</option>
									<option value="medium">Medium</option>
									<option value="high">High</option>
								</Select>
							</div>
						</div>

						<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 pb-6 sm:pt-6">
							<label
								htmlFor="about"
								className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
								⁠Anything else you want in the email?
							</label>
							<div className="mt-2 sm:col-span-2 sm:mt-0">
								<textarea
									{...register('additionalContent')}
									id="about"
									rows={3}
									className={cn(
										'block w-full max-w-2xl rounded-md focus:ring-0 border border-[#D3E3F1] py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-secondary sm:text-sm sm:leading-6',
										{ '!border-red-500': errors.additionalContent?.message }
									)}
									defaultValue={''}
								/>
								{errors.additionalContent?.message && (
									<p className="mt-1 text-red-500 text-xs">{errors.additionalContent.message}</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="flex items-center justify-end gap-x-6">
				<button
					type="submit"
					className="inline-flex justify-center rounded-md bg-darkBlue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					disabled={isSubmitting || isLoading}>
					{isSubmitting || isLoading ? 'Processing...' : 'Submit'}
				</button>
			</div>
		</form>
	)
}
