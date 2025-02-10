import { useEffect, useRef, useState } from 'react'

export const useComponentVisible = (isVisible: boolean) => {
	const [isComponentVisible, setIsComponentVisible] = useState(isVisible)
	const ref = useRef<any>(null)

	useEffect(() => {
		const handleClickOutside = (e: any) => {
			if (ref.current && !ref.current?.contains(e.target) && isComponentVisible) {
				setIsComponentVisible(false)
			}
		}
		document.addEventListener('click', handleClickOutside, true)
		return () => {
			document.removeEventListener('click', handleClickOutside, true)
		}
	}, [isComponentVisible])

	return { ref, isComponentVisible, setIsComponentVisible }
}
