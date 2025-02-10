import React from 'react'

import { AppHeader } from 'components/app/header'
import { useLocation } from 'react-router-dom'
import { AppFooter } from './footer'
import { Sidebar } from './sidebar'

interface AppLayoutProps {
	children: React.ReactNode
	isHeaderVisible?: boolean
	isFooterVisible?: boolean
	isSidebarVisible?: boolean
	className?: string
}

export const AppLayout: React.FC<AppLayoutProps> = ({
	children,
	isHeaderVisible = true,
	isSidebarVisible = false,
	isFooterVisible = false,
	className
}) => {
	const location = useLocation()
	return (
		<div className="relative">
			{isHeaderVisible ? <AppHeader className={className} /> : null}
			{isSidebarVisible ? <Sidebar>{children}</Sidebar> : <>{children}</>}
			{isFooterVisible ? <AppFooter /> : null}
		</div>
	)
}
