import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import ReactQuill from 'react-quill'

import * as yup from 'yup'

import { Spinner } from 'components/animation/spinner'
import { Button } from 'components/app/button'
import { Input } from 'components/inputs/input'

import { QUERY_KEYS } from 'constants'
import { useAppSelector } from 'hooks'
import { enqueueSnackbar } from 'notistack'
import { useMutation, useQuery } from 'react-query'
import 'react-quill/dist/quill.snow.css'
import emailTemplateService from 'services/email-template-service'
import { cn } from 'utils/cn'
import './editor.css'

interface CreateOrEditTemplateProps {
	template: EmailTemplate | undefined
	templateId: number | undefined
	initialSubjectContent?: string
	initialBodyContent?: string
	refetch?: () => void
	onCancel?: () => void
}

export type TemplateForm = {
	title: string
	subject: string
	body: string
	tags: string[]
}

export const CreateOrEditTemplate = ({
	template,
	templateId,
	initialSubjectContent = '',
	initialBodyContent = '',
	refetch,
	onCancel
}: CreateOrEditTemplateProps) => {
	const auth = useAppSelector(state => state.auth)

	const [tags, setTags] = useState<string[]>([])
	const [selectedTags, setSelectedTags] = useState<string[]>(template?.tags ?? [])
	const quillRef = useRef<any>(null)

	useQuery(QUERY_KEYS.ALL_TAGS, emailTemplateService.getValidTags, {
		refetchOnWindowFocus: false,
		onSuccess(data) {
			setTags(data)
		},
		onError() {
			setTags([])
			enqueueSnackbar('Error fetching tags', { variant: 'error' })
		}
	})

	const { mutate: mutateTemplate, isLoading: templateLoading } = useMutation({
		mutationKey: QUERY_KEYS.CREATE_TEMPLATE,
		mutationFn: (data: TemplateForm) => emailTemplateService.createTemplate(data),
		onSuccess: () => {
			enqueueSnackbar('Template created successfully')
			refetch?.()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const { mutate: updateTemplate, isLoading: templateUpdating } = useMutation({
		mutationKey: QUERY_KEYS.UPDATE_TEMPLATE,
		mutationFn: ({ id, data }: { id: number; data: TemplateForm }) =>
			emailTemplateService.updateTemplate(id, data, auth.user?.role as User['role']),
		onSuccess: () => {
			enqueueSnackbar('Template updated successfully')
			refetch?.()
		},
		onError: (err: any) => {
			enqueueSnackbar(err?.response?.data?.error || 'An error occurred', { variant: 'error' })
		}
	})

	const schema = yup.object<TemplateForm>().shape({
		title: yup.string().required('Title is missing'),
		subject: yup.string().required('Subject is missing'),
		body: yup
			.string()
			.required('Body is missing')
			.min(15, 'Body must be greater than 15 characters')
	})

	const {
		register,
		handleSubmit,
		reset,
		control,
		watch,
		formState: { errors }
	} = useForm<TemplateForm>({
		resolver: yupResolver(schema as any),
		defaultValues: template,
		mode: 'all'
	})

	console.log('EEEEEEEEE', template)

	useEffect(() => {
		if (!templateId && initialSubjectContent && initialBodyContent) {
			reset({ subject: initialSubjectContent, body: initialBodyContent })
		}
	}, [initialBodyContent, templateId, initialSubjectContent])

	const body = watch('body')
	const regex = /\{\{([^}]+)\}\}/g

	const matchedWords: string[] = []

	let match
	while ((match = regex.exec(body)) !== null) {
		matchedWords.push(match[1])
	}

	const handleTagClick = (tag: string) => {
		if (!selectedTags.includes(tag)) {
			const newTags = [...selectedTags, tag]
			setSelectedTags(newTags)
		}

		if (quillRef.current) {
			const quill = quillRef.current.getEditor()
			const range = quill.getSelection(true)
			if (range) {
				const position = range.index
				quill.insertText(position, ` ${tag} `, 'user')
				quill.setSelection(position + tag.length + 1, 0, 'user')
			}
			quill.focus()
		}
	}

	const onSubmit = (data: TemplateForm) => {
		if (templateId) {
			return updateTemplate({ id: templateId, data: { ...data, tags: selectedTags } })
		}
		mutateTemplate({
			...data,
			tags: [
				...selectedTags,
				...matchedWords
					.filter(word => !selectedTags.includes(`{{${word}}}`))
					.map(word => `{{${word}}}`)
			]
		})
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className={cn('py-6', { 'py-6 md:px-8 max-md:px-5': !!templateId })}>
			<div className="flex flex-col gap-y-5">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-5">
					<Input register={register} errors={errors} labelText="Title" name="title" />
					<Input register={register} errors={errors} labelText="Subject" name="subject" />
				</div>

				<div className="flex gap-x-2 items-center">
					<label className="block text-sm font-medium leading-6 text-gray-900">
						Available Tags
					</label>
				</div>
				<div className="flex flex-wrap gap-2">
					{tags.map(tag => (
						<button
							key={tag}
							onClick={() => handleTagClick(tag)}
							className={`px-3 py-1 rounded-full text-white font-semibold text-sm bg-blue-500`}
							type="button">
							{tag}
						</button>
					))}
				</div>

				<Controller
					control={control}
					name="body"
					render={({ field: { onChange, value } }) => (
						<div className="flex flex-col gap-y-1">
							<div className="flex flex-col gap-y-2">
								<div className="flex gap-x-2 items-center">
									<label
										htmlFor="content"
										className="block text-sm font-medium leading-6 text-gray-900">
										Content
									</label>
								</div>
								<ReactQuill
									ref={quillRef}
									className="editor treatment"
									theme="snow"
									onChange={onChange}
									value={value}
									style={{
										minHeight: '200px',
										outline: 'none',
										width: '100%'
									}}
								/>
							</div>
							{errors?.body?.message && (
								<p className="text-xs text-red-500 mt-1">{errors.body?.message}</p>
							)}
						</div>
					)}
				/>

				<div className="flex gap-x-6 justify-end">
					{onCancel && (
						<button type="button" onClick={onCancel} className="text-primary font-bold text-sm">
							Cancel
						</button>
					)}
					<Button disabled={templateLoading || templateUpdating} className="text-sm font-bold">
						{templateLoading || templateUpdating ? (
							<div className="flex items-center justify-center gap-x-5">
								<Spinner />
								<span className="animate-pulse whitespace-nowrap">Please Wait...</span>
							</div>
						) : (
							<span>{templateId ? 'Update' : 'Save'}</span>
						)}
					</Button>
				</div>
			</div>
		</form>
	)
}
