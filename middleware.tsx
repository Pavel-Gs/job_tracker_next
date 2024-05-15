// CLERK MIDDLEWARE (refer to https://clerk.com/docs/references/nextjs/auth-middleware)

import { authMiddleware } from '@clerk/nextjs'


export default authMiddleware({
	publicRoutes: ['/'], // publicly available routes, without the need to login
})

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}