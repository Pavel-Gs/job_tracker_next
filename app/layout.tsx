// ROOT LAYOUT

// IMPORT NEXT.JS COMPONENTS
import type { Metadata } from 'next'
// IMPORT CLERK COMPONENTS
import { ClerkProvider } from '@clerk/nextjs'
import { Providers } from './providers.tsx'
// IMPORT FONTS
import { Inter } from 'next/font/google'
// IMPORT CSS
import './globals.css'


// set app's font style
const inter = Inter({ subsets: ['latin'] })

// app's description   //type
export const metadata: Metadata = {
	title: "Project tracker", // web-site's title
	description: "Job tracker and database for your projects"
};

// represent's the layout for the whole app (must be default export, file name must be layout.*)
//											   // prop's type
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
	return ( // wrap the entire app in ClerkProvider, to enable auth (will require middleware)
		<ClerkProvider>
			<html lang='en' suppressHydrationWarning>
				<body className={inter.className}>
					<Providers>
						{children}
					</Providers>
				</body>
			</html>
		</ClerkProvider>
	)
}
