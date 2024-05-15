// CODE FROM SHADCN-UI DOCS
// (allows to switch theme-modes: light/dark)

'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

													  // prop's type       // return's type (wasn't in the docs, but suggested by VSCode)
export const ThemeProvider = ({ children, ...props }: ThemeProviderProps): React.JSX.Element => {
	return (
		<NextThemesProvider {...props}>
			{children}
		</NextThemesProvider>
	)
}