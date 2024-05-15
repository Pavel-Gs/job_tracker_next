'use client' // Next.js components are server components by default. Need 'use client' to use client-side React hooks

// IMPORT REACT HOOKS
import { useState } from 'react'
// IMPORT TANSTACK REACT HOOKS
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// IMPORT TSX COMPONENTS
import { ThemeProvider } from '../components/theme-provider.tsx'
// IMPORT SHADCN-UI COMPONENTS
import { Toaster } from '../components/ui/toaster.tsx'


										// prop's type
export const Providers = ({ children }: { children: React.ReactNode }) => {
	const [queryClient] = useState(() => {
		return new QueryClient({
			defaultOptions: {
				queries: {
					staleTime: 60 * 1000 * 5 //stale time in milliseconds, results in 5 minutes; other users viewing the same data through the app will see changes only after the data is refetched (interaction with some elements triggers a data refetch too)
				}
			}
		})
	})
	return (
		<>
			<ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
				<Toaster />
				<QueryClientProvider client={queryClient}>
					{children}
					{process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />} {/* only render devtools during development */}
				</QueryClientProvider>
			</ThemeProvider>
		</>
	)
}
