import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import { SnackbarProvider } from 'notistack'

import Routing from 'routing'

import store from 'store'
import 'styles/main.css'

const container = document.getElementById('root')
const queryClient = new QueryClient()

const persistor = persistStore(store)

if (container) {
	const root = createRoot(container)
	root.render(
		<StrictMode>
			<Provider store={store}>
				<PersistGate persistor={persistor}>
					<QueryClientProvider client={queryClient}>
						<SnackbarProvider
							anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
							variant="success"
							autoHideDuration={3000}
						/>
						<Routing />
						<ReactQueryDevtools initialIsOpen={false} />
					</QueryClientProvider>
				</PersistGate>
			</Provider>
		</StrictMode>
	)
}
