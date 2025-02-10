import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

import { AppLayout } from 'components/app/layout'
import { Modal } from 'components/app/modal'
import { useAppSelector } from 'hooks'
import { CreateOrEditTemplate } from 'pages/admin/email-templates/create'
import { HelperForm } from './helper-form'

type State = isModalVisible | undefined

type isModalVisible = {
	visibility: boolean
	id?: number | undefined
}

export const CreateEmailTemplates = () => {
	const auth = useAppSelector(state => state.auth)

	const [initialSubject, setInitialSubject] = useState<string>()
	const [initialBody, setInitialBody] = useState<string>()
	const [modalState, setModalState] = useState<State>({
		visibility: false,
		id: undefined
	})

	const handleHelperResult = (result: string) => {
		const parsedResult = normalizeResponse(result)
		setInitialSubject(parsedResult.emailSubject)
		setInitialBody(parsedResult.emailBody)
		setModalState({
			visibility: false,
			id: undefined
		})
	}

	const normalizeResponse = (response: string) => {
		const jsonString = response.match(/\{.*\}/s)?.[0] || '{}'
		try {
			const jsonResponse = JSON.parse(jsonString)
			const { emailSubject, emailBody } = jsonResponse
			return { emailSubject, emailBody }
		} catch (error) {
			console.error('Invalid JSON response format:', error)
			return { emailSubject: '', emailBody: '' }
		}
	}

	return (
		<AppLayout isHeaderVisible={false} isSidebarVisible>
			{modalState?.visibility && (
				<Modal isFullHeight width="w-[900px]" noPadding onClose={() => setModalState(undefined)}>
					<div className="sticky max-md:grid max-md:grid-flow-col max-md:auto-cols-auto md:flex items-center md:justify-between top-0 z-10 bg-white max-md:p-5 md:px-8 py-4 border-b border-border">
						<ChevronLeftIcon
							onClick={() => setModalState(undefined)}
							className="w-3 h-3 md:hidden cursor-pointer"
						/>
						<h1 className="text-primary text-[20px] max-md:text-center whitespace-nowrap max-md:text-sm font-domine font-bold">
							AI Assisstance
						</h1>
						<div className="md:hidden" />
						<XMarkIcon
							onClick={() => setModalState(undefined)}
							className="text-primary max-md:hidden bg-white h-6 w-6 cursor-pointer"
						/>
					</div>
					<HelperForm onResult={handleHelperResult} />
				</Modal>
			)}
			<div>
				<div className="sm:flex sm:items-center">
					<div className="sm:flex-auto">
						<h1 className="text-base font-semibold leading-6 text-gray-900">
							Create Email Template
						</h1>
						<p className="mt-2 text-sm text-gray-700">
							Create an email templates by filling the following parameters.
						</p>
					</div>
					{auth.user?.role !== 'Company Employee' && (
						<div className="mt-4 sm:ml-16 sm:mt-0 flex gap-x-2 sm:flex-none">
							<button
								type="button"
								onClick={() => setModalState({ visibility: true })}
								className="block rounded-md bg-darkBlue px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
								Need AI Assisstance
							</button>
						</div>
					)}
				</div>
				<div className="mt-5">
					<CreateOrEditTemplate
						templateId={undefined}
						initialSubjectContent={initialSubject}
						initialBodyContent={initialBody}
						template={undefined}
					/>
				</div>
			</div>
		</AppLayout>
	)
}
